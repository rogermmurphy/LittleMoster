<!--
  Little Monster GPA Study Platform
  Local AI Setup Guide
  
  Author: Ella K. Murphy (ella.k.murphy@gmail.com)
  Created: October 31, 2025 10:09 AM CST
  Last Updated: October 31, 2025 10:09 AM CST
  Version: 1.0
  
  This is a LIVING DOCUMENT - Update as local AI setup evolves
-->

# Local AI Setup Guide
## 100% Local AI Stack - Zero API Keys Required!

**Author**: Ella K. Murphy (ella.k.murphy@gmail.com)  
**Created**: October 31, 2025 10:09 AM CST  
**Status**: Local AI Stack Configured

---

## Overview

The Little Monster GPA platform uses a **fully local AI stack** with no external API dependencies. All AI processing happens on your machine:

- **Chat/Generation**: GPT-OSS (OpenAI's open-weight model) via Ollama
- **Transcription**: Local Whisper models
- **Embeddings**: Sentence-transformers models
- **Vector DB**: ChromaDB (already configured)

**No API keys needed. Everything runs locally!**

---

## Prerequisites

**Required:**
- Docker Desktop installed and running
- At least 16GB RAM (32GB+ recommended)
- 50GB+ free disk space for models

**Recommended:**
- NVIDIA GPU with 16GB+ VRAM for GPT-OSS-20B
- Or 80GB+ VRAM for GPT-OSS-120B
- (CPU-only mode works but is much slower)

---

## Quick Start (5 minutes)

### Step 1: Start Docker Services

```bash
docker-compose up -d
```

This starts 6 services:
- PostgreSQL (database)
- Redis (job queue)
- ChromaDB (vector database)
- Qdrant (alt vector database)
- Adminer (database UI)
- **Ollama** (local LLM server)

### Step 2: Pull GPT-OSS Model

```bash
# For 16GB GPU/RAM (smaller, faster)
docker exec lm-ollama ollama pull gpt-oss:20b

# OR for 80GB GPU (larger, more capable)
docker exec lm-ollama ollama pull gpt-oss:120b
```

This downloads the model (may take 10-30 minutes depending on your internet).

### Step 3: Test Ollama

```bash
# Test that Ollama is working
curl http://localhost:11434/api/tags

# Test GPT-OSS chat
curl http://localhost:11434/api/chat -d '{
  "model": "gpt-oss",
  "messages": [{"role": "user", "content": "Hello!"}],
  "stream": false
}'
```

### Step 4: Update .env

Copy the example and set OLLAMA_URL:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and ensure:
OLLAMA_URL=http://localhost:11434
```

**That's it!** Your AI chat will now use GPT-OSS locally.

---

## Architecture

### Current Setup (Working Now)

```
┌─────────────────────────────────────────┐
│  Little Monster Backend (Node.js)       │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ChatService                        │ │
│  │  → Ollama API (GPT-OSS)          │ │──┐
│  │  → http://localhost:11434         │ │  │
│  └────────────────────────────────────┘ │  │
│                                          │  │
│  ┌────────────────────────────────────┐ │  │
│  │ TranscriptionService               │ │  │
│  │  → Placeholder (needs Whisper)    │ │  │
│  └────────────────────────────────────┘ │  │
│                                          │  │
│  ┌────────────────────────────────────┐ │  │
│  │ EmbeddingService                   │ │  │
│  │  → Placeholder (needs embeddings) │ │  │
│  └────────────────────────────────────┘ │  │
└─────────────────────────────────────────┘  │
                                              │
┌─────────────────────────────────────────┐  │
│  Ollama (Docker Container)               │◄─┘
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ GPT-OSS Model                      │ │
│  │  - gpt-oss:120b (80GB) OR         │ │
│  │  - gpt-oss:20b (16GB)             │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Port: 11434                            │
└─────────────────────────────────────────┘
```

### Optional Python Services (For Full Features)

```
┌──────────────────────────────┐
│ Whisper Service (Python)     │
│  - FastAPI on port 8002      │
│  - Local Whisper model       │
│  - Handles transcription     │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Embedding Service (Python)   │
│  - FastAPI on port 8001      │
│  - sentence-transformers     │
│  - Handles embeddings        │
└──────────────────────────────┘
```

---

## Model Information

### GPT-OSS (Chat/Generation)

**From**: OpenAI (open-weight)  
**License**: Apache 2.0  
**Released**: October 2025  
**Sizes**: 
- 120B params (5.1B active) - Requires 80GB GPU
- 20B params (3.6B active) - Requires 16GB RAM/GPU

**Features**:
- Full chain-of-thought reasoning
- Function calling support
- Agentic capabilities
- Fine-tunable
- No API key required!

**Running via Ollama**:
```bash
ollama pull gpt-oss:20b    # Smaller model
ollama pull gpt-oss:120b   # Larger model
ollama run gpt-oss         # Interactive chat
```

---

## Optional: Set Up Whisper Service

If you want actual transcription (not placeholders), create a Python service:

### Create `ai-services/whisper-service/app.py`:

```python
from fastapi import FastAPI, File, UploadFile
from transformers import pipeline
import torch

app = FastAPI()

# Load Whisper model
transcriber = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-large-v3-turbo",
    torch_dtype=torch.float16,
    device="cuda" if torch.cuda.is_available() else "cpu"
)

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    result = transcriber(audio_bytes)
    return {"text": result["text"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
```

### Run Whisper Service:
```bash
pip install fastapi uvicorn transformers torch
python ai-services/whisper-service/app.py
```

---

## Optional: Set Up Embedding Service

For actual embeddings (not placeholders):

### Create `ai-services/embedding-service/app.py`:

```python
from fastapi import FastAPI
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.post("/embed")
async def embed_single(data: dict):
    text = data.get("text", "")
    embedding = model.encode(text).tolist()
    return {"embedding": embedding}

@app.post("/embed/batch")
async def embed_batch(data: dict):
    texts = data.get("texts", [])
    embeddings = model.encode(texts).tolist()
    return {"embeddings": embeddings}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Run Embedding Service:
```bash
pip install fastapi uvicorn sentence-transformers
python ai-services/embedding-service/app.py
```

---

## Testing the Local AI Stack

### 1. Test Ollama is Running

```bash
curl http://localhost:11434/api/tags
```

Expected: JSON with list of models including `gpt-oss`

### 2. Test GPT-OSS Chat

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gpt-oss",
  "messages": [
    {"role": "user", "content": "Explain photosynthesis"}
  ],
  "stream": false
}'
```

Expected: JSON response with generated answer

### 3. Test Through Backend API

```bash
# First login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"SecurePass123!"}'

# Then test chat (use token from above)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "classId": "YOUR_CLASS_ID",
    "message": "What is photosynthesis?"
  }'
```

Expected: Response with AI answer and source citations

---

## Troubleshooting

### Ollama Not Starting

**Symptom**: `docker ps` doesn't show `lm-ollama`

**Solutions**:
1. Check Docker Desktop is running
2. Check GPU drivers installed (NVIDIA Docker)
3. Try CPU-only: Remove GPU config from docker-compose.yml
4. Check logs: `docker logs lm-ollama`

### Model Not Found

**Symptom**: Error "model not found: gpt-oss"

**Solution**:
```bash
# Check what models are available
docker exec lm-ollama ollama list

# Pull the model
docker exec lm-ollama ollama pull gpt-oss:20b
```

### Out of Memory

**Symptom**: Ollama crashes or model won't load

**Solutions**:
1. Use smaller model: `gpt-oss:20b` instead of `gpt-oss:120b`
2. Increase Docker memory limit (Docker Desktop → Settings → Resources)
3. Close other applications
4. Use quantized versions if available

### Transcription Shows Placeholder

**Expected behavior** - Whisper service is optional

**To enable**:
1. Set up Python Whisper service (see guide above)
2. Run on port 8002
3. Transcriptions will work automatically

### Embeddings Show Zero Vectors

**Expected behavior** - Embedding service is optional

**To enable**:
1. Set up Python embedding service (see guide above)
2. Run on port 8001
3. Embeddings will work automatically

---

## Performance Expectations

### GPT-OSS-120B (80GB GPU)
- First token: ~2-3 seconds
- Generation: ~20-30 tokens/second
- Context: Up to 128K tokens
- Quality: Excellent for educational content

### GPT-OSS-20B (16GB GPU/RAM)
- First token: ~1 second
- Generation: ~40-60 tokens/second
- Context: Up to 128K tokens
- Quality: Good for most educational tasks

### CPU-Only Mode
- First token: ~10-30 seconds
- Generation: ~2-5 tokens/second
- Usable but slow for development/testing

---

## Model Management

### List Downloaded Models
```bash
docker exec lm-ollama ollama list
```

### Remove a Model
```bash
docker exec lm-ollama ollama rm gpt-oss:120b
```

### Update a Model
```bash
docker exec lm-ollama ollama pull gpt-oss:20b
```

---

## Cost Comparison

### OpenAI API (Previous Implementation)
- GPT-4: $0.01 per 1K input tokens, $0.03 per 1K output
- Whisper: $0.006 per minute
- Embeddings: $0.00002 per 1K tokens
- **Monthly cost for 1000 students: ~$500-2000**

### Local AI Stack (Current Implementation)
- Hardware cost: $0 (use existing)
- Electricity: ~$50-100/month (GPU running 24/7)
- API costs: $0
- **Monthly cost: ~$50-100 regardless of users!**

**Savings: 80-95% cost reduction at scale**

---

## Advantages of Local AI

**Privacy**: All data stays on your infrastructure
**Cost**: No per-request API charges
**Control**: Full control over model behavior
**Customization**: Can fine-tune models for your needs
**Reliability**: No external API dependencies
**Latency**: Can be faster with good hardware

---

## Next Steps

1. **Start Ollama**: `docker-compose up -d ollama`
2. **Pull GPT-OSS**: `docker exec lm-ollama ollama pull gpt-oss:20b`
3. **Test Chat**: Use curl commands above
4. **(Optional)** Set up Whisper service
5. **(Optional)** Set up Embedding service
6. **Use the platform!**

---

## Support & Resources

**Ollama Documentation**: https://ollama.com/  
**GPT-OSS Model Card**: https://huggingface.co/openai/gpt-oss-120b  
**Whisper Models**: https://huggingface.co/models?pipeline_tag=automatic-speech-recognition  
**Sentence-Transformers**: https://www.sbert.net/  

---

**Document Status**: Living Document - Update as models evolve  
**Last Updated**: October 31, 2025 10:09 AM CST  
**Next Review**: When upgrading models or adding new AI features
