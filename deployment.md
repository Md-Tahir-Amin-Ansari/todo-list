# Engineering R&D Report: Deploying Production React SPAs in Air-Gapped Environments (Zero Node.js Runtime)

**Author:** Fullstack / DevOps Engineering  
**Classification:** Enterprise Infrastructure Architecture  
**Target Environments:**  
1. Air-gapped container host (Docker engine present, strictly offline).  
2. Air-gapped bare-metal / VM host (No container runtime, zero Node.js, strictly offline).

---

## 1. Executive Summary & Core Principle

A pervasive architectural misconception is that running a React application requires a server-side Node.js runtime. 

In a production Single Page Application (SPA), Node.js is exclusively a **build-time compiler tool** (executing bundlers such as Vite or Webpack). Once compiled via `npm run build`, the application consists entirely of **static assets** (`index.html`, JavaScript chunks, CSS stylesheets, images). Execution occurs entirely within the client's browser engine.

Therefore, the production server—whether bare-metal or containerized—**does not require Node.js, npm, or any JavaScript runtime**. It requires only a high-performance static HTTP server (Nginx).

### The Air-Gap Constraint
In an air-gapped environment (defense, banking, critical infrastructure), the target host has **no outbound or inbound internet connectivity**. All binaries, packages, and application assets must be pre-packaged on a connected "Staging / Build Machine", transferred across the air-gap via secure portable media or an internal artifact repository, and deployed offline.

---

## 2. Architectural Comparison: With Docker vs. Without Docker

```
  CONNECTED BUILD MACHINE (Internet Access)
  ├── Source Code (.tsx, .css)
  └── npm run build ──► dist/ (HTML, JS, CSS)
                              │
         AIR-GAP DATA DIODE / SECURE TRANSFER
                              │
  ┌───────────────────────────┴───────────────────────────┐
  ▼                                                       ▼
[ CASE 1: With Docker (Offline) ]              [ CASE 2: Without Docker (Offline) ]
Target Host Requirements:                      Target Host Requirements:
- Docker Engine installed                      - OS: Linux (Ubuntu/RHEL)
- ZERO Node.js                                 - ZERO Node.js, ZERO Docker
- Nginx base image imported from tar           - Nginx installed via offline .deb/.rpm
Delivery Artifact:                             Delivery Artifact:
- `react-app-production.tar.gz` (Docker image) - `dist.tar.gz` + `nginx-offline-bundle.tar.gz`
```

| Dimension | Case 1: Docker (Air-Gapped) | Case 2: Bare-Metal / VM (Air-Gapped) |
| :--- | :--- | :--- |
| **Server Runtime** | Docker Engine | Native Linux Nginx service |
| **Node.js on Target Host** | **None** (stripped in multi-stage build) | **None** (never installed) |
| **Delivery Artifact** | Single image archive (`.tar.gz`) | Static tarball (`dist.tar.gz`) + OS package bundle |
| **Rollback Mechanism** | `docker run` previous image tag | Atomic symlink swap (`/var/www/current`) |
| **Portability** | Identical on any Linux distribution with Docker | Dependent on OS distro package manager (apt/yum) |
| **Footprint on Host** | ~25 MB (Alpine + Nginx) | ~10 MB (Native Nginx binaries + static assets) |

---

## 3. The Universal SPA Routing Problem (`try_files`)

In both cases, Single Page Applications rely on client-side routing (React Router). 
* When a user visits `http://server/`, Nginx serves `index.html`.
* When navigating to `http://server/today`, React updates the browser URL without requesting a new page from the server.
* **The Failure Mode:** If the user refreshes (`F5`) on `http://server/today`, the browser asks Nginx for the file `/today`. Because `/today` is a virtual client route and not an actual HTML file on disk, Nginx returns **404 Not Found**.

### The Universal Solution (`try_files`)
In both Docker and Bare-Metal, the Nginx virtual host configuration must include:
```nginx
location / {
    root /usr/share/nginx/html; # or /var/www/react-app/dist
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}
```
`try_files $uri $uri/ /index.html` instructs Nginx:
1. Check if the exact file exists (`$uri`). If so, serve it (e.g. `/assets/index.js`).
2. Check if a directory exists (`$uri/`).
3. If neither exists, fallback to `/index.html` and let the client-side JavaScript router resolve the route.

---

## 4. Case 1: Air-Gapped Deployment WITH Docker

### 4.1 Production Multi-Stage `Dockerfile`
Created on the **Build Machine**:

```dockerfile
# ==========================================
# STAGE 1: Compilation (Throwaway Node Build Environment)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package*.json ./
RUN npm ci

# Copy source files and compile
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Production Server (ZERO Node.js)
# ==========================================
FROM nginx:1.27-alpine

# Remove default boilerplate configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy hardened Nginx SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY static compiled assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 Associated `nginx.conf`
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Optional: Cache static assets aggressively
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Optional: Reverse proxy to backend API (if colocated)
    location /api/ {
        proxy_pass http://backend-server:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4.3 Air-Gap Packaging & Transfer Protocol

#### Step 1: On Connected Build Machine
```bash
# Build the production image
docker build -t react-app:production -f Dockerfile .

# Export the entire image into a compressed tarball
docker save react-app:production | gzip > react-app-production.tar.gz

# Verify file size (typically ~25MB to 35MB)
ls -lh react-app-production.tar.gz
```

#### Step 2: Transfer across Air-Gap
Transfer `react-app-production.tar.gz` to the isolated target machine via approved physical media or secure internal diode.

#### Step 3: On Target Offline Host (No Internet)
```bash
# Load the image archive into local Docker engine
docker load < react-app-production.tar.gz

# Verify the image is available locally without network
docker images

# Run the container
docker run -d \
  --name production-react-app \
  -p 80:80 \
  --restart unless-stopped \
  react-app:production

# Verify execution
curl -I http://localhost
```

---

## 5. Case 2: Air-Gapped Deployment WITHOUT Docker (Bare Metal / VM)

### 5.1 Overview
In this scenario, the target machine runs a native Linux OS (e.g. Ubuntu 22.04 LTS or RHEL 9). The server has:
* **NO Node.js**
* **NO npm**
* **NO Docker**

### 5.2 Air-Gap Preparation on Build Machine

#### Step 1: Build the Static Bundle
```bash
cd client
npm ci
npm run build
# Package the dist directory
tar -czvf react-dist.tar.gz -C dist .
```

#### Step 2: Download Nginx Offline Packages
If Nginx is not already pre-installed on the offline OS, download the offline `.deb` packages (Ubuntu/Debian) or `.rpm` packages (RHEL/CentOS):

**For Ubuntu/Debian (on an internet-connected Ubuntu instance):**
```bash
mkdir -p nginx-offline && cd nginx-offline
# Download nginx and all required dependencies without installing
apt-get update
apt-get download $(apt-cache depends --recurse --no-recommends --no-suggests \
  --no-conflicts --no-breaks --no-replaces --no-enhances nginx | grep "^\w" | sort -u)
cd ..
tar -czvf nginx-offline-ubuntu.tar.gz nginx-offline/
```

### 5.3 Deployment on Target Offline Host (No Internet)

#### Step 1: Install Nginx Offline
```bash
# Extract and install offline packages
tar -xzvf nginx-offline-ubuntu.tar.gz
cd nginx-offline
sudo dpkg -i *.deb
```

#### Step 2: Deploy the Application Files
```bash
# Create application root directory
sudo mkdir -p /var/www/react-app/releases/v1
sudo mkdir -p /var/www/react-app/shared

# Extract the static build bundle
sudo tar -xzvf react-dist.tar.gz -C /var/www/react-app/releases/v1

# Create an atomic symlink to current release
sudo ln -sfn /var/www/react-app/releases/v1 /var/www/react-app/current
```

#### Step 3: Configure Native Nginx
Create `/etc/nginx/sites-available/react-app`:
```nginx
server {
    listen 80 default_server;
    server_name _;

    root /var/www/react-app/current;
    index index.html;

    # Gzip compression for static assets
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache immutable static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Verification and Health Check Protocol

To verify zero-internet, zero-Node compliance on the target host:

### 1. Verify Node.js is Absent
```bash
node -v
# Output: command not found (PASS)
npm -v
# Output: command not found (PASS)
```

### 2. Verify Air-Gap Isolation
```bash
ping -c 2 8.8.8.8
# Output: Network is unreachable (PASS)
curl -I https://google.com
# Output: Could not resolve host (PASS)
```

### 3. Verify Local SPA Serving & Deep Linking
```bash
# 1. Root route: should return index.html
curl -I http://localhost/
# Output: HTTP/1.1 200 OK

# 2. Deep route: should fallback to index.html with 200 (NOT 404!)
curl -I http://localhost/today
# Output: HTTP/1.1 200 OK (Content-Type: text/html)

# 3. Static asset: should return exact file with correct MIME type
curl -I http://localhost/assets/index.js
# Output: HTTP/1.1 200 OK (Content-Type: application/javascript)
```

---

## 7. Recommendation Matrix for Team Presentation

1. **If Target Machine Has Docker:**  
   **Recommend Case 1.** Docker Image archive transport (`docker save | gzip`) is foolproof. It encapsulates Nginx, configuration, and static assets in a single cryptographically verifiable archive, eliminating OS library differences.
2. **If Target Machine is Pure Bare-Metal:**  
   **Recommend Case 2.** Pre-installing Nginx and deploying versioned `dist.tar.gz` directories using symlink swapping (`/var/www/react-app/current`) yields instantaneous rollbacks and zero runtime overhead.
