<div align="center">
  <img src="frontend/public/favicon.png" alt="CodeGuard AI Logo" width="120">

  <h1>CodeGuard AI</h1>
  <p><b>Next-Generation, AI-Powered Static Code Security Auditing</b></p>

  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black" alt="React"></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Language-Python_3.10+-3776AB?logo=python&logoColor=white" alt="Python"></a>
  <a href="#"><img src="https://img.shields.io/badge/Status-Production_Ready-success" alt="Status"></a>
</div>

<br/>

## Overview

**CodeGuard AI** is an enterprise-grade Static Application Security Testing (SAST) tool designed to integrate seamlessly into modern development workflows. By leveraging advanced Artificial Intelligence, it analyzes source code to identify vulnerabilities, anti-patterns, and security flaws in real-time, providing actionable remediation steps before code reaches production.

## Key Features

* **Intelligent Threat Detection:** Goes beyond traditional regex-based scanning by understanding code context and logic flaws.
* **Real-Time Analysis:** Lightning-fast backend powered by FastAPI for immediate audit results.
* **Actionable Remediation:** Does not just flag errors; provides context-aware, secure code replacements.
* **Enterprise-Ready Architecture:** Decoupled frontend (React/Vite) and backend (Python/FastAPI) built for scalability and cloud deployment.
* **Cross-Origin Secure:** Strictly configured CORS and environment-based secret management.

## Architecture Stack

* **Frontend:** React 18, Vite, TypeScript (Deployed on Vercel)
* **Backend:** Python, FastAPI, Uvicorn (Deployed on Render)
* **AI Engine:** Integrated via secure API endpoints for deep-code analysis.

## Getting Started (Local Development)

To run CodeGuard AI locally for development or contribution, follow these steps.

### 1. Backend Setup

```bash
git clone [https://github.com/yourusername/codeguard-ai.git](https://github.com/yourusername/codeguard-ai.git)
cd codeguard-ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd codeguard-ai/frontend
npm install
npm run dev
```

## Security & Privacy

CodeGuard AI is built with security as a priority. Code snippets analyzed via the API are processed strictly in-memory and are **not** stored or used to train public AI models. API keys and sensitive configurations are managed via environment variables.

## Production Deployment

This project is configured for seamless CI/CD:
* **Frontend:** Pushing to the `main` branch automatically triggers a build and deployment on **Vercel**.
* **Backend:** Pushing to the `main` branch triggers an environment update and deployment on **Render**.

---
*Developed with focus on secure, efficient, and intelligent code writing.*
