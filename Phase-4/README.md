# Phase 4: Local Kubernetes Deployment - Todo AI Chatbot

> **Status:** ✅ Completed  
> **Platform:** Minikube (Local Kubernetes Cluster)  
> **Container Runtime:** Docker Desktop  
> **Package Manager:** Helm Charts  

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Docker Images](#docker-images)
- [Helm Charts](#helm-charts)
- [Kubernetes Resources](#kubernetes-resources)

---

## 🎯 Overview

Phase 4 introduces **cloud-native deployment** of the Todo AI Chatbot on a local Kubernetes cluster using Minikube. This phase focuses on containerization, orchestration, and package management using industry-standard tools.

### Key Objectives
- ✅ Containerize frontend and backend applications
- ✅ Create production-ready Docker images with multi-stage builds
- ✅ Package applications using Helm charts
- ✅ Deploy to local Kubernetes cluster (Minikube)
- ✅ Implement secrets management for sensitive data
- ✅ Configure health checks and auto-healing

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│               Minikube Kubernetes Cluster                │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Frontend Deployment (2 Pods)            │    │
│  │      Next.js App (Port 3000)                    │    │
│  │      Image: todo-frontend:v1                    │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │                                    │
│  ┌─────────────────▼──────────────────────────────┐    │
│  │   Frontend Service (LoadBalancer)               │    │
│  │   External Access: http://localhost:XXXXX       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Backend Deployment (2 Pods)             │    │
│  │      FastAPI + Groq AI (Port 8000)              │    │
│  │      Image: todo-backend:v4                     │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │                                    │
│  ┌─────────────────▼──────────────────────────────┐    │
│  │   Backend Service (ClusterIP)                   │    │
│  │   Internal: todo-backend-backend-chart:8000     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Kubernetes Secrets                      │    │
│  │   - backend-secrets (DB, API keys)              │    │
│  │   - frontend-secrets (Auth, DB)                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Neon Database   │
              │  (PostgreSQL)    │
              └──────────────────┘
```

---

## ✨ Features

### Application Features
- **AI-Powered Chatbot**: Natural language task management using Groq (Llama 3.3 70B)
- **Task Management**: Create, read, update, delete tasks via chat
- **User Authentication**: Secure login/signup with NextAuth.js
- **Persistent Storage**: PostgreSQL database on Neon

### Kubernetes Features
- **Container Orchestration**: Automated deployment, scaling, and management
- **High Availability**: Multiple pod replicas for fault tolerance
- **Auto-Healing**: Automatic pod restart on failure
- **Health Checks**: Liveness and readiness probes
- **Secrets Management**: Secure storage of credentials
- **Load Balancing**: Traffic distribution across pods
- **Rolling Updates**: Zero-downtime deployments

---

## 🛠️ Technology Stack

### Application Layer
| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | Next.js | 16.1.3 |
| Backend | FastAPI | 0.128.4 |
| AI Engine | Groq (Llama) | 3.3 70B |
| Database | PostgreSQL | Neon Serverless |
| Auth | NextAuth.js | Latest |

### Infrastructure Layer
| Component | Technology | Version |
|-----------|-----------|---------|
| Container Runtime | Docker Desktop | 4.53+ |
| Container Registry | Docker Hub | - |
| Orchestration | Kubernetes (Minikube) | 1.38.0 |
| Package Manager | Helm | 4.1.0 |
| CLI Tools | kubectl | 1.34.1 |

### Docker AI Agent
- **Gordon**: AI-assisted Docker operations (enabled in Docker Desktop)

---

## 📦 Prerequisites

### Required Software

1. **Docker Desktop** (v4.53+)
```bash
   # Download from: https://www.docker.com/products/docker-desktop/
   # Enable Gordon: Settings → Beta features → Enable Docker AI
   docker --version
   docker ai "What can you do?"
```

2. **Minikube** (v1.38.0)
```bash
   # Windows (Chocolatey)
   choco install minikube
   
   minikube version
```

3. **kubectl** (v1.34.1)
```bash
   # Included with Docker Desktop
   kubectl version --client
```

4. **Helm** (v4.1.0)
```bash
   # Windows (Chocolatey)
   choco install kubernetes-helm
   
   helm version
```

### Optional Tools
- **kubectl-ai**: AI-assisted Kubernetes operations (optional)
- **Kagent**: Advanced Kubernetes AI agent (optional)

### Required Credentials
- Neon Database URL (PostgreSQL connection string)
- Groq API Key (for AI chatbot)

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/mudasirsohail/Hackathon-II.git
cd "Hackathon II/Phase-3"
```

### 2. Start Minikube
```bash
# Start with sufficient resources
minikube start --cpus=2 --memory=4000

# Verify cluster
kubectl cluster-info
kubectl get nodes
```

### 3. Build Docker Images

#### Backend Image
```bash
cd backend

# Build multi-stage production image
docker build -t todo-backend:v4 .

# Verify image
docker images | grep todo-backend
```

#### Frontend Image
```bash
cd ../frontend

# Build Next.js production image
docker build -t todo-frontend:v1 .

# Verify image
docker images | grep todo-frontend
```

### 4. Load Images into Minikube
```bash
# Backend
minikube image load todo-backend:v4

# Frontend
minikube image load todo-frontend:v1

# Verify images in Minikube
minikube image ls | grep todo
```

---

## 🔐 Secrets Configuration

### 1. Generate Secret Keys
```bash
# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Create Kubernetes Secrets

#### Backend Secrets
```bash
kubectl create secret generic backend-secrets \
  --from-literal=DATABASE_URL='postgresql://user:password@host.neon.tech/db?sslmode=require' \
  --from-literal=GROQ_API_KEY='gsk_your_groq_api_key_here' \
  --from-literal=SECRET_KEY='your_generated_secret_key'
```

#### Frontend Secrets
```bash
kubectl create secret generic frontend-secrets \
  --from-literal=DATABASE_URL='postgresql://user:password@host.neon.tech/db?sslmode=require' \
  --from-literal=NEXTAUTH_SECRET='your_generated_nextauth_secret'
```

### 3. Verify Secrets
```bash
kubectl get secrets
kubectl describe secret backend-secrets
kubectl describe secret frontend-secrets
```

---

## 📊 Deployment

### Using Helm Charts

#### 1. Deploy Backend
```bash
cd backend-chart

# Install backend
helm install todo-backend .

# Verify deployment
helm list
kubectl get deployments
kubectl get pods
```

#### 2. Deploy Frontend
```bash
cd ../frontend-chart

# Install frontend
helm install todo-frontend .

# Verify deployment
helm list
kubectl get deployments
kubectl get pods
```

### Check Deployment Status
```bash
# Watch pods until all are Running
kubectl get pods -w

# Check services
kubectl get services

# Check all resources
kubectl get all
```

Expected Output:
```
NAME                                            READY   STATUS    RESTARTS   AGE
todo-backend-backend-chart-575f7bc4d7-2h87q     1/1     Running   0          5m
todo-backend-backend-chart-575f7bc4d7-cm8f9     1/1     Running   0          5m
todo-frontend-frontend-chart-759567bbfb-h2wkw   1/1     Running   0          5m
todo-frontend-frontend-chart-759567bbfb-rkrjv   1/1     Running   0          5m
```

---

## ✅ Verification

### 1. Check Pod Health
```bash
# Get pod status
kubectl get pods

# Describe pod for details
kubectl describe pod 

# Check pod logs
kubectl logs 
```

### 2. Test Backend API
```bash
# Port forward to backend
kubectl port-forward svc/todo-backend-backend-chart 8000:8000

# Test health endpoint (in new terminal)
curl http://localhost:8000/health
```

Expected Response:
```json
{"status": "healthy"}
```

### 3. Access Frontend Application

#### Option 1: Minikube Service
```bash
minikube service todo-frontend-frontend-chart --url
```

#### Option 2: Minikube Tunnel
```bash
# Start tunnel (keep running)
minikube tunnel

# Access at
http://localhost:3000
```

### 4. Test Full Application
1. Open frontend URL in browser
2. Sign up / Login
3. Test chatbot:
   - "Add task buy groceries"
   - "Show my tasks"
   - "Complete task 1"
   - "Delete task 2"

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Pods in CrashLoopBackOff
```bash
# Check logs
kubectl logs 

# Common causes:
# - Wrong environment variables
# - Database connection failed
# - Missing secrets
```

**Solution**: Verify secrets and environment variables

#### 2. Image Pull Errors
```bash
# If pods can't find images
minikube image load todo-backend:v4
minikube image load todo-frontend:v1
```

#### 3. Service Not Accessible
```bash
# Check service
kubectl get svc

# For LoadBalancer, use tunnel
minikube tunnel
```

#### 4. Database Connection Issues
```bash
# Verify secret
kubectl get secret backend-secrets -o yaml

# Decode database URL
echo "base64_string" | base64 --decode
```

**Solution**: Ensure Neon database URL is correct and accessible

#### 5. Frontend Can't Reach Backend
```bash
# Check backend service
kubectl get svc todo-backend-backend-chart

# Ensure frontend environment variables point to correct backend URL
```

### Debug Commands
```bash
# Pod logs (last 100 lines)
kubectl logs  --tail=100

# Follow logs
kubectl logs -f 

# Execute into pod
kubectl exec -it  -- /bin/sh

# Describe resource
kubectl describe pod 
kubectl describe deployment 

# Events
kubectl get events --sort-by='.lastTimestamp'
```

---

## 📁 Project Structure
```
Phase-3/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── services/
│   │   │   └── chat_service.py  # Groq AI integration
│   │   └── models/
│   │       └── database.py      # Database models
│   ├── Dockerfile               # Multi-stage production build
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── chat/page.tsx        # Chatbot interface
│   │   └── api/                 # API routes
│   ├── Dockerfile               # Next.js production build
│   └── package.json             # Node dependencies
│
├── backend-chart/
│   ├── Chart.yaml               # Helm chart metadata
│   ├── values.yaml              # Configuration values
│   └── templates/
│       ├── deployment.yaml      # Kubernetes deployment
│       ├── service.yaml         # Kubernetes service
│       └── secrets.yaml         # Secret references
│
└── frontend-chart/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment.yaml
        ├── service.yaml
        └── secrets.yaml
```

---

## 🐳 Docker Images

### Backend Image (todo-backend:v4)

**Dockerfile Highlights:**
```dockerfile
# Multi-stage build
FROM python:3.11-slim AS builder
# Install dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .
EXPOSE 8000
USER appuser
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Features:**
- Multi-stage build for smaller image size (522MB)
- Non-root user for security
- Optimized layer caching
- Production-ready uvicorn server

### Frontend Image (todo-frontend:v1)

**Dockerfile Highlights:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**Features:**
- Multi-stage build for optimization (296MB)
- Next.js standalone output
- Alpine Linux for minimal size
- Production build with optimizations

---

## 📦 Helm Charts

### Backend Chart Configuration

**values.yaml:**
```yaml
replicaCount: 2

image:
  repository: todo-backend
  tag: v4
  pullPolicy: Never  # For local Minikube

service:
  type: ClusterIP
  port: 8000

env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: backend-secrets
        key: database_url
  - name: GROQ_API_KEY
    valueFrom:
      secretKeyRef:
        name: backend-secrets
        key: groq_api_key
  - name: SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: backend-secrets
        key: secret_key

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 15
  periodSeconds: 5
```

### Frontend Chart Configuration

**values.yaml:**
```yaml
replicaCount: 2

image:
  repository: todo-frontend
  tag: v1
  pullPolicy: Never

service:
  type: LoadBalancer  # Accessible externally
  port: 3000

env:
  - name: NEXTAUTH_URL
    value: "http://localhost:3000"
  - name: NEXTAUTH_SECRET
    valueFrom:
      secretKeyRef:
        name: frontend-secrets
        key: nextauth_secret
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: frontend-secrets
        key: database_url
  - name: NEXT_PUBLIC_API_URL
    value: "http://todo-backend-backend-chart:8000"

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
```

---

## ☸️ Kubernetes Resources

### Deployments
```bash
# Backend Deployment
Name:               todo-backend-backend-chart
Replicas:           2
Strategy:           RollingUpdate
Image:              todo-backend:v4
Port:               8000
Environment:        From secrets (DATABASE_URL, GROQ_API_KEY, SECRET_KEY)

# Frontend Deployment
Name:               todo-frontend-frontend-chart
Replicas:           2
Strategy:           RollingUpdate
Image:              todo-frontend:v1
Port:               3000
Environment:        From secrets (NEXTAUTH_SECRET, DATABASE_URL)
```

### Services
```bash
# Backend Service
Name:               todo-backend-backend-chart
Type:               ClusterIP
ClusterIP:          10.100.77.145
Port:               8000/TCP
Endpoints:          :8000

# Frontend Service
Name:               todo-frontend-frontend-chart
Type:               LoadBalancer
Port:               3000/TCP
NodePort:           32324/TCP
External IP:         (use minikube tunnel)
```

### Secrets
```bash
# backend-secrets
Type:               Opaque
Keys:               database_url, groq_api_key, secret_key

# frontend-secrets
Type:               Opaque
Keys:               database_url, nextauth_secret
```

---

## 🎯 Key Achievements

✅ **Containerization**: Multi-stage Docker builds for optimized images  
✅ **Orchestration**: Kubernetes deployment with auto-healing  
✅ **Package Management**: Helm charts for easy deployment  
✅ **Secrets Management**: Secure credential storage  
✅ **High Availability**: Multiple pod replicas  
✅ **Health Checks**: Liveness and readiness probes  
✅ **Local Testing**: Full Kubernetes experience on Minikube  

---

## 📈 Performance Metrics

| Metric | Value |
|--------|-------|
| Backend Image Size | 522 MB |
| Frontend Image Size | 296 MB |
| Pod Startup Time | ~15-30 seconds |
| Average Response Time | <100ms |
| Concurrent Replicas | 2 per service |
| CPU per Pod | 250m request, 500m limit |
| Memory per Pod | 256Mi request, 512Mi limit |

---

## 🔄 Helm Operations

### Upgrade Deployment
```bash
# Update image tag in values.yaml
# Then upgrade
helm upgrade todo-backend ./backend-chart
helm upgrade todo-frontend ./frontend-chart
```

### Rollback Deployment
```bash
# View revision history
helm history todo-backend

# Rollback to previous version
helm rollback todo-backend
```

### Uninstall
```bash
helm uninstall todo-backend
helm uninstall todo-frontend
```

### Delete Secrets
```bash
kubectl delete secret backend-secrets
kubectl delete secret frontend-secrets
```

---

## 🌟 Next Steps (Phase 5)

Phase 5 will extend this deployment to:
- ☁️ **Cloud Kubernetes**: Deploy to DigitalOcean (DOKS) / GKE / AKS
- 🔄 **Event-Driven**: Integrate Kafka via Redpanda Cloud
- 🚀 **Dapr**: Distributed application runtime
- 📊 **Monitoring**: Prometheus + Grafana
- 📝 **Logging**: ELK Stack
- 🔁 **CI/CD**: GitHub Actions pipeline
- ✨ **Advanced Features**: Recurring tasks, priorities, tags, search

---

## 📚 Resources

### Documentation
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Minikube Guide](https://minikube.sigs.k8s.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Tools
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Helm Chart Development Guide](https://helm.sh/docs/chart_template_guide/)

---

## 👨‍💻 Developer

**Mudasir Sohail**  
- GitHub: [@mudasirsohail](https://github.com/mudasirsohail)
- LinkedIn: [Mudasir Sohail](https://linkedin.com/in/mudasirsohail)

---

## 🏆 Hackathon Progress

- ✅ **Phase 1**: Foundation
- ✅ **Phase 2**: Authentication & Database
- ✅ **Phase 3**: AI Chatbot Deployment (Cloud)
- ✅ **Phase 4**: Local Kubernetes Deployment (Current)
- ⏳ **Phase 5**: Advanced Cloud Deployment

---

## 📄 License

This project is part of Governor Sindh's Hackathon II initiative.

---

**Built with ❤️ using Cloud-Native Technologies**
