<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="React" width="40" height="40" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg" alt="Next.js" width="40" height="40" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" alt="Tailwind CSS" width="40" height="40" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Python-Dark.svg" alt="Python" width="40" height="40" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Supabase-Dark.svg" alt="Supabase" width="40" height="40" />
</div>

<h1 align="center">AI NFT Personalizer</h1>

<div align="center">
  <strong>A full-stack pipeline for generating 3D models from images and minting them as NFTs.</strong>
</div>

<br />

<div align="center">
  <a href="#-overview">Overview</a>
  <span> · </span>
  <a href="#-features">Features</a>
  <span> · </span>
  <a href="#-technology-stack">Tech Stack</a>
  <span> · </span>
  <a href="#-architecture">Architecture</a>
  <span> · </span>
  <a href="#-getting-started">Quick Start</a>
</div>

<br />

<div align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Next.js-15-black.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Web3-Ready-blueviolet.svg?style=for-the-badge&logo=ethereum&logoColor=white" alt="Web3 Ready" />
</div>

<hr />

## 📖 Overview

**AI NFT Personalizer** is a portfolio project designed to demonstrate an end-to-end integration of Web3 mechanics with generative AI. The application allows users to upload a standard 2D image, leverages an AI pipeline to construct a 3D model, generates standardized metadata, and finally mints the result as a Non-Fungible Token (NFT) on Ethereum testnets.

Designed with a focus on accessibility and modern development patterns, the entire underlying stack relies on 100% free-tier services. It serves as an open-source technical showcase of how to connect modern frontend frameworks, asynchronous Python backends, third-party AI APIs, and blockchain networks.

---

## ✨ Features

- **2D-to-3D Generation:** Integrates the Tripo AI API to convert user-uploaded 2D images into 3D models.
- **Prompt Enhancement:** Utilizes Llama 3.3 70B via the Groq API to enrich user prompts and improve AI generation context.
- **Interactive 3D Viewer:** Renders generated 3D assets directly in the browser using React Three Fiber and Drei.
- **Testnet Minting:** Implements Web3 connectivity with `wagmi` and `viem` to facilitate NFT minting on Sepolia and Base Sepolia testnets.
- **Decentralized Storage:** Automates the pinning of 3D models and JSON metadata schemas to IPFS using Pinata.
- **Data Persistence & RAG:** Uses Supabase (PostgreSQL + pgvector) to store generation history and enable Retrieval-Augmented Generation capabilities.

---

## 💻 Technology Stack

| Capability | Technology |
| :--- | :--- |
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router), React, TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **3D Rendering** | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + Drei |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/) (Python) + Pydantic |
| **3D Generation API** | [Tripo AI](https://www.tripo3d.ai/) |
| **LLM Inference** | [Groq](https://groq.com/) API (Llama 3.3 70B) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL + pgvector) |
| **Web3 Integration** | `wagmi`, `viem` |
| **IPFS Storage** | [Pinata](https://www.pinata.cloud/) |

---

## 🗂 Architecture

The repository is structured as a monorepo containing a distinct frontend React application and a Python-based backend API service.

```text
ai-nft-personalizer-2026/
├── frontend/          # Client application layer (Next.js)
│   ├── src/
│   │   ├── app/       # Next.js App Router definitions
│   │   ├── components/# React UI components and 3D canvas rendering
│   │   └── lib/       # Utility functions, API fetching, Web3 config
│   └── .env.local.example
├── backend/           # API backend layer (FastAPI)
│   ├── app/
│   │   ├── main.py    # FastAPI application instance entry point
│   │   ├── routers/   # Route handlers and endpoint definitions
│   │   └── services/  # External API integrations (Tripo, Groq, IPFS)
│   └── .env.example
└── README.md
```

---

## 🚀 Getting Started

To run this project locally, you will need to set up both the frontend client and the backend API server. 

### Prerequisites

Ensure the following environments and tools are installed:
- **Node.js**: Version 20.0.0 or higher.
- **Package Manager**: pnpm version 9.0.0 or higher.
- **Python**: Version 3.11 or higher.
- **Accounts/API Keys**: You must register for free tier API keys from Groq, Tripo AI, Supabase, and Pinata.

### 1. Frontend Setup

Navigate to the `frontend` directory, install the required node modules, configure your environment variables, and start the development server:

```bash
cd frontend
pnpm install

# Copy the example environment file and insert your API keys
cp .env.local.example .env.local

# Start the Next.js development server
pnpm run dev
```
The frontend application will be accessible at [http://localhost:3000](http://localhost:3000).

### 2. Backend Setup

Open a new terminal session, navigate to the `backend` directory, create a Python virtual environment, install the dependencies, and start the FastAPI server:

```bash
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# -> On Windows: .venv\Scripts\activate
# -> On macOS/Linux: source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Copy the example environment file and insert your API keys
cp .env.example .env

# Start the FastAPI server using Uvicorn
uvicorn app.main:app --reload
```
The backend API will be accessible at [http://localhost:8000](http://localhost:8000). You can view the automatically generated interactive API documentation at `http://localhost:8000/docs`.

---

## 🔐 Environment Variables

Security is an essential consideration. Both the `frontend` and `backend` directories contain `.env.example` boilerplate files detailing the required keys. You must duplicate these files, rename them (to `.env.local` and `.env` respectively), and fill in your actual credentials.

> **Note:** The `.gitignore` file is configured to prevent your actual `.env` files from being committed to the repository. Never expose your private keys publicly.

---

## 📄 License

This repository is distributed under the **[MIT License](./LICENSE)**. You are free to use, modify, distribute, and learn from this codebase.

<div align="center">
  <p>Built by Marco in 2026.</p>
</div>