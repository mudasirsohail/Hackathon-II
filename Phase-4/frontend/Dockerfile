# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy the standalone output from builder stage
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user for security
RUN addgroup -g 1001 -S nextjs && \
    adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 3000

# Run the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]