# 🎨 AI NFT Personalizer 2026

> **Upload an image → AI generates a 3D model + NFT metadata → Mint on testnet**  
> 100 % free-tier stack · Open Source · Portfolio Project

---

## ✨ Features

| Feature | Stack |
|---|---|
| 2D → 3D model generation | Tripo AI (image-to-3D API) |
| Style / prompt enhancement | Groq API · Llama 3.3 70B |
| Interactive 3D viewer | React Three Fiber + Drei |
| NFT metadata generation | JSON Schema · Pinata/IPFS |
| Testnet minting | wagmi + viem · Sepolia / Base Sepolia |
| History & RAG storage | Supabase · PostgreSQL + pgvector |
| Frontend hosting | Vercel (free) |
| Backend hosting | Render (free) |

---

## 🗂 Monorepo Structure

```
ai-nft-personalizer-2026/
├── frontend/          # Next.js 15 · App Router · TypeScript · Tailwind
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── .env.local.example
├── backend/           # FastAPI · Python · Pydantic
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   └── services/
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 20 · pnpm ≥ 9
- Python ≥ 3.11
- Free API keys: Groq · Tripo AI · Supabase · Pinata

### Frontend
```bash
cd frontend
pnpm install
cp .env.local.example .env.local   # fill in your keys
pnpm dev
```

### Backend
```bash
cd backend
python -m venv .venv
.venv/Scripts/activate             # Windows
pip install -r requirements.txt
cp .env.example .env               # fill in your keys
uvicorn app.main:app --reload
```

---

## 🔑 Environment Variables

See `frontend/.env.local.example` and `backend/.env.example` for all required keys.
**Never commit `.env` files.**

---

## 📄 License

MIT — free to use, fork, and learn from.