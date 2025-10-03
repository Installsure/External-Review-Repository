#!/usr/bin/env python3
"""
NexusLocalAI Router - Main routing service for AI model requests
"""
import os
import sys
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import yaml
from pathlib import Path

# Configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
PRIMARY_MODEL = os.getenv("PRIMARY_MODEL", "qwen-coder")
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "deepseek-coder")
FAST_MODEL = os.getenv("FAST_MODEL", "qwen2.5")
ROUTER_PORT = int(os.getenv("ROUTER_PORT", "8099"))
ROUTER_HOST = os.getenv("ROUTER_HOST", "0.0.0.0")

# Initialize FastAPI app
app = FastAPI(title="NexusLocalAI Router", version="1.0.0")

# Load guardrails configuration
def load_guardrails():
    """Load guardrails configuration"""
    config_path = Path(__file__).parent.parent / "guardrails" / "config.yaml"
    if config_path.exists():
        with open(config_path, "r") as f:
            return yaml.safe_load(f)
    return {}

guardrails_config = load_guardrails()

class RouteRequest(BaseModel):
    """Request model for routing"""
    prompt: str
    model: Optional[str] = None
    max_tokens: int = 2048
    temperature: float = 0.7
    stream: bool = False

class RouteResponse(BaseModel):
    """Response model for routing"""
    model_used: str
    response: str
    tokens_used: int
    duration_ms: float

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "NexusLocalAI Router",
        "version": "1.0.0",
        "ollama_url": OLLAMA_BASE_URL,
        "models": {
            "primary": PRIMARY_MODEL,
            "fallback": FALLBACK_MODEL,
            "fast": FAST_MODEL
        }
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            response.raise_for_status()
            models = response.json()
            return {
                "status": "healthy",
                "ollama": "connected",
                "available_models": [m.get("name") for m in models.get("models", [])]
            }
    except Exception as e:
        return {
            "status": "degraded",
            "ollama": "disconnected",
            "error": str(e)
        }

@app.post("/route", response_model=RouteResponse)
async def route_request(request: RouteRequest):
    """
    Route a request to the appropriate model
    """
    # Select model
    model = request.model or PRIMARY_MODEL
    
    # Apply guardrails
    if guardrails_config:
        max_tokens_limit = guardrails_config.get("guardrails", {}).get("model_constraints", {}).get("max_tokens", 4096)
        if request.max_tokens > max_tokens_limit:
            raise HTTPException(status_code=400, detail=f"max_tokens exceeds limit of {max_tokens_limit}")
    
    # Make request to Ollama
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            ollama_request = {
                "model": model,
                "prompt": request.prompt,
                "stream": request.stream,
                "options": {
                    "num_predict": request.max_tokens,
                    "temperature": request.temperature
                }
            }
            
            import time
            start_time = time.time()
            
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json=ollama_request
            )
            response.raise_for_status()
            
            duration_ms = (time.time() - start_time) * 1000
            
            result = response.json()
            
            return RouteResponse(
                model_used=model,
                response=result.get("response", ""),
                tokens_used=result.get("eval_count", 0),
                duration_ms=duration_ms
            )
            
    except httpx.HTTPError as e:
        # Try fallback model
        if model != FALLBACK_MODEL:
            print(f"Primary model failed, trying fallback: {e}")
            request.model = FALLBACK_MODEL
            return await route_request(request)
        raise HTTPException(status_code=500, detail=f"Model request failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting NexusLocalAI Router on {ROUTER_HOST}:{ROUTER_PORT}")
    print(f"📊 Ollama URL: {OLLAMA_BASE_URL}")
    print(f"🤖 Primary Model: {PRIMARY_MODEL}")
    print(f"🔄 Fallback Model: {FALLBACK_MODEL}")
    uvicorn.run(app, host=ROUTER_HOST, port=ROUTER_PORT)
