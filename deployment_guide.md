# Deployment Guide: Sales Platform

This guide details the steps to set up the environment and deploy the Sales Platform on a fresh Linux server or PC (Ubuntu/Debian assumed).

## 1. System Setup & Prerequisites

### 1.1 Update System & Install Basic Utilities
```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl wget git apt-transport-https ca-certificates software-properties-common gnupg lsb-release
```

### 1.2 Install Docker
```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Add current user to docker group (to run without sudo)
sudo usermod -aG docker $USER
# NOTE: You must log out and back in for this to take effect!
```

### 1.3 Install Kubernetes (Minikube) - Optional for Docker Compose users
For a single-node setup or testing, Minikube is recommended.

```bash
# Download Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube (requires Docker)
minikube start --driver=docker
```

### 1.4 Install kubectl - Optional for Docker Compose users
```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Install kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

### 1.5 Install Node.js (Optional - for local development)
If you want to run `npm install` locally instead of using Docker.
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 2. Getting the Code

```bash
# Clone the repository (Replace with your actual repository URL)
git clone <YOUR_REPOSITORY_URL>

# Navigate to the project directory
cd api_ventas
```

---

## 3. Application Deployment

You have two options to deploy the application: **Docker Compose** (Simpler) or **Kubernetes** (Scalable).

### Option A: Docker Compose (Recommended for simple servers)
This method orchestrates the containers automatically.

1.  **Start the application**:
    ```bash
    docker compose up -d --build
    ```

2.  **Verify**:
    -   Backend: `http://localhost:3000`
    -   Frontend: `http://localhost:5173`
    -   Database: `localhost:5433`

### Option B: Kubernetes Deployment
This method uses the manifests in the `k8s/` directory.

1.  **Build Docker Images**:
    Since we are using local Kubernetes (Minikube), we need to build images into Minikube's Docker daemon.
    ```bash
    eval $(minikube docker-env)
    
    # Build Backend
    docker build -t sales-backend:latest ./backend
    
    # Build Frontend
    docker build -t sales-frontend:latest ./frontend
    
    # Build Tailscale Gateway
    docker build -t tailscale-gateway:with-socat -f ./k8s/Dockerfile.tailscale ./k8s
    ```

2.  **Configure Secrets**:
    -   Edit `k8s/tailscale-auth.yaml` and add your Tailscale Auth Key.

3.  **Deploy**:
    ```bash
    # Create Namespace
    kubectl create namespace sales-platform

    # Apply Manifests
    kubectl apply -f k8s/tailscale-auth.yaml
    kubectl apply -f k8s/postgres-deployment.yaml
    kubectl apply -f k8s/backend-deployment.yaml
    kubectl apply -f k8s/frontend-deployment.yaml
    kubectl apply -f k8s/tailscale-gateway.yaml
    ```

4.  **Access**:
    -   **Internal**: Access via the Frontend Service LoadBalancer IP.
    -   **External**: Access via the Tailscale IP provided by the gateway.

## 4. Troubleshooting

-   **Ports in use**: If port 5433 or 3000 is taken, edit `docker-compose.yml` to map to different host ports.
-   **Database Connection**: Ensure the `DATABASE_URL` in `backend-deployment.yaml` or `docker-compose.yml` matches the service name and port.
-   **Minikube Image Pull Error**: If K8s can't find the image, ensure you ran `eval $(minikube docker-env)` before building, and that `imagePullPolicy` is set to `Never` or `IfNotPresent` in the manifests.