import os
import json
import requests

def handler(event: dict, context) -> dict:
    """
    Start AI video generation via Runway ML Gen-3 Alpha Turbo.
    Accepts prompt, duration (5 or 10 seconds), style, template.
    Returns a task_id to poll for completion.
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
    duration = int(body.get('duration', 5))
    style = body.get('style', 'realistic')
    template = body.get('template', 'cinematic')

    if not prompt:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Prompt is required'})}

    api_key = os.environ.get('RUNWAY_API_KEY')
    if not api_key:
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': 'RUNWAY_API_KEY not configured'})}

    # Runway Gen-3 only supports 5 or 10 seconds
    runway_duration = 10 if duration >= 60 else 5

    # Enhance prompt with style and template context
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

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06',
    }

    payload = {
        'promptText': enhanced_prompt,
        'model': 'gen3a_turbo',
        'duration': runway_duration,
        'ratio': '1280:768',
        'watermark': False,
    }

    response = requests.post(
        'https://api.dev.runwayml.com/v1/image_to_video',
        headers=headers,
        json=payload,
        timeout=30
    )

    # Runway returns 200 with task info
    if response.status_code not in (200, 201):
        error_detail = response.text
        return {
            'statusCode': response.status_code,
            'headers': CORS,
            'body': json.dumps({'error': 'Runway API error', 'detail': error_detail})
        }

    data = response.json()
    task_id = data.get('id')

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'task_id': task_id,
            'status': 'RUNNING',
            'message': 'Video generation started',
            'estimated_seconds': runway_duration * 10
        })
    }