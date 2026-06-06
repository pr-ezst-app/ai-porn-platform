import os
import json
import requests

def handler(event: dict, context) -> dict:
    """
    Start AI video generation via Replicate (minimax/video-01).
    Accepts prompt, style, template. Returns a prediction_id to poll.
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

    api_token = os.environ.get('REPLICATE_API_TOKEN')
    if not api_token:
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': 'REPLICATE_API_TOKEN not configured'})}

    style_hints = {
        'realistic': 'photorealistic, ultra HD, cinematic lighting',
        'anime': 'anime art style, vibrant colors, detailed illustration',
        '3d': '3D rendered, volumetric lighting, CGI quality',
    }
    template_hints = {
        'cinematic': 'cinematic wide angle, dramatic composition, film grain',
        'social': 'vertical format, vibrant and eye-catching, social media style',
        'explainer': 'clean and clear visuals, professional, corporate style',
        'promo': 'dynamic motion, brand colors, energetic and engaging',
        'documentary': 'natural lighting, authentic feel, documentary style',
        'animation': 'smooth animation, colorful, motion graphics',
    }

    enhanced_prompt = f"{prompt}. {style_hints.get(style, '')}. {template_hints.get(template, '')}"

    response = requests.post(
        'https://api.replicate.com/v1/models/minimax/video-01/predictions',
        headers={
            'Authorization': f'Token {api_token}',
            'Content-Type': 'application/json',
        },
        json={
            'input': {
                'prompt': enhanced_prompt,
            }
        },
        timeout=30
    )

    if response.status_code not in (200, 201):
        return {
            'statusCode': response.status_code,
            'headers': CORS,
            'body': json.dumps({'error': 'Replicate API error', 'detail': response.text})
        }

    data = response.json()
    prediction_id = data.get('id')
    status = data.get('status', 'starting')

    # Map Replicate status to our internal status
    status_map = {'starting': 'RUNNING', 'processing': 'RUNNING', 'succeeded': 'SUCCEEDED', 'failed': 'FAILED', 'canceled': 'FAILED'}
    mapped_status = status_map.get(status, 'RUNNING')

    output = data.get('output')
    video_url = output if isinstance(output, str) else (output[0] if isinstance(output, list) and output else None)

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'task_id': prediction_id,
            'status': mapped_status,
            'video_url': video_url,
            'message': 'Video generation started',
            'estimated_seconds': 60
        })
    }