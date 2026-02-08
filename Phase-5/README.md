# Phase 5: Advanced Cloud Deployment - Todo AI Chatbot

> **Status:** ✅ Completed  
> **Cloud Platform:** DigitalOcean Kubernetes (DOKS) / Google Cloud (GKE) / Azure (AKS)  
> **Event-Driven Architecture:** Kafka on Redpanda Cloud  
> **Distributed Runtime:** Dapr  

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features Implemented](#features-implemented)
- [Technology Stack](#technology-stack)
- [Local Deployment (Minikube)](#local-deployment-minikube)
- [Cloud Deployment](#cloud-deployment)
- [Dapr Integration](#dapr-integration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Environment Variables](#environment-variables)
- [Deployment Guide](#deployment-guide)

---

## 🎯 Overview

Phase 5 represents the culmination of the Governor Sindh Hackathon II project, featuring advanced cloud-native deployment with event-driven architecture, distributed application runtime, and production-grade Kubernetes deployment.

This phase implements:
- **Advanced Todo Features**: Recurring tasks, due dates, reminders
- **Intermediate Features**: Priorities, tags, search, filter, sort
- **Event-Driven Architecture**: Kafka integration via Redpanda Cloud
- **Distributed Runtime**: Dapr for pub/sub, state management, bindings, secrets, and service invocation
- **Cloud Deployment**: Production Kubernetes cluster on DigitalOcean/GKE/AKS
- **DevOps**: CI/CD pipeline, monitoring, and logging

---

## 🏗️ Architecture┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│              (Next.js Frontend - 2 Pods)                 │
└───────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│              Load Balancer Service                       │
└───────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│            Kubernetes Cluster (DOKS/GKE/AKS)            │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Backend API (FastAPI - 2+ Pods)                │   │
│  │   - AI Chatbot (Groq LLM)                        │   │
│  │   - Task Management                              │   │
│  │   - Event Publishing                             │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                    │
│                     ▼                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Dapr Sidecar (Distributed Runtime)       │   │
│  │   - Pub/Sub (Kafka/Redpanda)                     │   │
│  │   - State Management                             │   │
│  │   - Service Invocation                           │   │
│  │   - Secrets Management                           │   │
│  │   - Bindings (Cron Jobs)                         │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                    │
└─────────────────────┼────────────────────────────────────┘
│
┌───────────┴──────────┐
▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│  Redpanda Cloud  │   │  Neon Database   │
│  (Kafka Cluster) │   │  (PostgreSQL)    │
└──────────────────┘   └──────────────────┘

---

## ✨ Features Implemented

### Advanced Level Features
- ✅ **Recurring Tasks**: Daily, weekly, monthly task recurrence
- ✅ **Due Dates**: Task deadline management
- ✅ **Reminders**: Automated notifications via Dapr bindings

### Intermediate Level Features
- ✅ **Priority Levels**: High, Medium, Low task prioritization
- ✅ **Tags**: Categorize tasks with custom labels
- ✅ **Search**: Full-text search across tasks
- ✅ **Filter**: Filter by status, priority, tags, due date
- ✅ **Sort**: Sort by creation date, due date, priority

### Event-Driven Features
- ✅ **Task Created Events**: Published to Kafka when tasks are created
- ✅ **Task Updated Events**: Track task modifications
- ✅ **Task Completed Events**: Trigger workflows on completion
- ✅ **Reminder Events**: Scheduled notifications via cron bindings

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.3
- **UI**: Tailwind CSS, TypeScript
- **Authentication**: NextAuth.js
- **State Management**: React Hooks

### Backend
- **Framework**: FastAPI (Python 3.11)
- **AI**: Groq (Llama 3.3 70B)
- **ORM**: SQLAlchemy, SQLModel
- **Message Broker**: Kafka (Redpanda Cloud)

### Infrastructure
- **Container Orchestration**: Kubernetes (Minikube → DOKS/GKE/AKS)
- **Package Manager**: Helm Charts
- **Distributed Runtime**: Dapr
- **Database**: PostgreSQL (Neon Serverless)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Cloud Services
- **Kubernetes**: DigitalOcean Kubernetes (DOKS) / Google Kubernetes Engine (GKE) / Azure Kubernetes Service (AKS)
- **Message Queue**: Redpanda Cloud (Kafka)
- **Database**: Neon PostgreSQL
- **Container Registry**: Docker Hub / DigitalOcean Container Registry

---

## 🖥️ Local Deployment (Minikube)

### Prerequisites
```bash
