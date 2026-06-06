import os
import json
import requests

def handler(event: dict, context) -> dict:
    """
    Start AI video generation via Hugging Face Inference API (LTX-Video).
    Accepts prompt, style, template. Returns a task_id to poll.
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    CORS = {'Access-Control-Allow-Origin': '*'}

    body = json.loads(event.get('body') or '{}')
    prompt = body.get('prompt', '').strip()
    style = body.get('style', 'realistic')
    template = body.get('template', 'cinematic')

    if not prompt:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Prompt is required'})}

    api_token = os.environ.get('HUGGINGFACE_API_TOKEN')
    if not api_token:
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': 'HUGGINGFACE_API_TOKEN not configured'})}

    style_hints = {
        'realistic': 'photorealistic, ultra HD, cinematic lighting',
        'anime': 'anime art style, vibrant colors, detailed illustration',
        '3d': '3D rendered, volumetric lighting, CGI quality',
    }
    template_hints = {
        'cinematic': 'cinematic wide angle, dramatic composition',
        'social': 'vibrant and eye-catching, social media style',
        'explainer': 'clean and clear visuals, professional',
        'promo': 'dynamic motion, energetic and engaging',
        'documentary': 'natural lighting, authentic feel',
        'animation': 'smooth animation, colorful, motion graphics',
    }

    enhanced_prompt = f"{prompt}. {style_hints.get(style, '')}. {template_hints.get(template, '')}"

    print(f"[generate-video] Prompt: {enhanced_prompt[:120]}")

    # Use HF Inference API with LTX-Video model
    response = requests.post(
        'https://api-inference.huggingface.co/models/Lightricks/LTX-Video',
        headers={
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
            'X-Wait-For-Model': 'true',
        },
        json={
            'inputs': enhanced_prompt,
            'parameters': {
                'num_frames': 25,
                'num_inference_steps': 30,
                'height': 480,
                'width': 704,
            }
        },
        timeout=120
    )

    print(f"[generate-video] HF status: {response.status_code}, content-type: {response.headers.get('content-type','')}, body[:200]: {response.text[:200]}")

    if response.status_code == 503:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'error': 'Model is loading, please try again in 30 seconds.'})
        }

    if response.status_code != 200:
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'error': f'HuggingFace error {response.status_code}: {response.text[:200]}'})
        }

    # HF Inference API returns the video bytes directly
    content_type = response.headers.get('content-type', '')
    if 'video' in content_type or len(response.content) > 1000:
        import base64
        video_b64 = base64.b64encode(response.content).decode('utf-8')
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'task_id': 'direct',
                'status': 'SUCCEEDED',
                'video_b64': video_b64,
                'video_mime': 'video/mp4',
                'message': 'Video ready',
            })
        }

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'error': f'Unexpected response: {response.text[:200]}'})
    }
