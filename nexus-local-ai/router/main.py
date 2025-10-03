#!/usr/bin/env python3
"""
NexusLocalAI Router - OpenAI-compatible API router for local models
"""

import os
import re
import logging
from typing import Optional, Dict, Any
from datetime import datetime

try:
    from flask import Flask, request, jsonify
    import requests
    import yaml
except ImportError:
    print("Installing required dependencies...")
    os.system("pip install flask requests pyyaml")
    from flask import Flask, request, jsonify
    import requests
    import yaml

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(ROOT_DIR, '.env')
CONFIG_FILE = os.path.join(ROOT_DIR, 'guardrails', 'config.yaml')

# Load environment variables
def load_env():
    env_vars = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env_vars[key] = value
    return env_vars

env = load_env()
OLLAMA_HOST = env.get('OLLAMA_HOST', 'http://localhost:11434')
DEFAULT_MODEL = env.get('DEFAULT_MODEL', 'qwen2.5-coder:7b')
ROUTER_PORT = int(env.get('ROUTER_PORT', 8099))

# Load guardrails config
guardrails_config = {}
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE) as f:
        guardrails_config = yaml.safe_load(f)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('nexus-router')

app = Flask(__name__)

def select_model(prompt: str) -> str:
    """Select appropriate model based on prompt content"""
    if not guardrails_config.get('guardrails', {}).get('routing'):
        return DEFAULT_MODEL
    
    for rule in guardrails_config['guardrails']['routing']:
        pattern = rule.get('pattern', '')
        if pattern and re.search(pattern, prompt, re.IGNORECASE):
            return rule.get('model', DEFAULT_MODEL)
    
    return DEFAULT_MODEL

def check_guardrails(prompt: str) -> Optional[Dict[str, Any]]:
    """Check prompt against guardrails"""
    if not guardrails_config.get('guardrails', {}).get('enabled'):
        return None
    
    # Simple content filter checks
    filters = guardrails_config.get('guardrails', {}).get('content_filters', [])
    for filter_config in filters:
        if not filter_config.get('enabled'):
            continue
            
        # Basic checks (extend as needed)
        if filter_config['name'] == 'prompt_injection':
            suspicious_patterns = ['ignore previous', 'system:', 'forget all']
            if any(p in prompt.lower() for p in suspicious_patterns):
                return {'error': 'Potential prompt injection detected', 'filter': filter_config['name']}
    
    return None

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """OpenAI-compatible chat completions endpoint"""
    try:
        data = request.json
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({'error': 'No messages provided'}), 400
        
        # Get the last user message for model selection
        last_message = next((m for m in reversed(messages) if m.get('role') == 'user'), None)
        if not last_message:
            return jsonify({'error': 'No user message found'}), 400
        
        prompt = last_message.get('content', '')
        
        # Check guardrails
        guardrail_result = check_guardrails(prompt)
        if guardrail_result:
            logger.warning(f"Guardrail triggered: {guardrail_result}")
            return jsonify(guardrail_result), 403
        
        # Select model
        model = data.get('model') or select_model(prompt)
        logger.info(f"Routing request to model: {model}")
        
        # Forward to Ollama
        ollama_data = {
            'model': model,
            'messages': messages,
            'stream': data.get('stream', False),
        }
        
        response = requests.post(
            f"{OLLAMA_HOST}/api/chat",
            json=ollama_data,
            stream=ollama_data['stream']
        )
        
        if ollama_data['stream']:
            return response.iter_content(), response.status_code
        
        result = response.json()
        
        # Convert Ollama response to OpenAI format
        openai_response = {
            'id': f"chatcmpl-{datetime.utcnow().timestamp()}",
            'object': 'chat.completion',
            'created': int(datetime.utcnow().timestamp()),
            'model': model,
            'choices': [{
                'index': 0,
                'message': {
                    'role': 'assistant',
                    'content': result.get('message', {}).get('content', '')
                },
                'finish_reason': 'stop'
            }],
            'usage': {
                'prompt_tokens': 0,
                'completion_tokens': 0,
                'total_tokens': 0
            }
        }
        
        return jsonify(openai_response)
        
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/route', methods=['POST'])
def route_request():
    """Simple routing endpoint"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        model = select_model(prompt)
        
        return jsonify({
            'model': model,
            'prompt': prompt,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error routing request: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info(f"Starting NexusLocalAI Router on port {ROUTER_PORT}")
    logger.info(f"Ollama host: {OLLAMA_HOST}")
    logger.info(f"Default model: {DEFAULT_MODEL}")
    app.run(host='0.0.0.0', port=ROUTER_PORT, debug=False)
