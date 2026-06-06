import os
import json
import requests

def handler(event: dict, context) -> dict:
    """
    Submit video generation job to HuggingFace async queue.
    Returns job_id instantly without waiting for completion.
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
    print(f"[generate-video] prompt={enhanced_prompt[:120]}")

    # Use HuggingFace Jobs API — submits async, returns job_id immediately
    response = requests.post(
        'https://api-inference.huggingface.co/models/Lightricks/LTX-Video/queue',
        headers={
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
        },
        json={
            'inputs': enhanced_prompt,
            'parameters': {
                'num_frames': 25,
                'num_inference_steps': 25,
                'height': 480,
                'width': 704,
            }
        },
        timeout=10
    )

    print(f"[generate-video] queue status={response.status_code} body={response.text[:400]}")

    # Fallback to standard endpoint if /queue not supported
    if response.status_code not in (200, 201):
        response = requests.post(
            'https://api-inference.huggingface.co/models/Lightricks/LTX-Video',
            headers={
                'Authorization': f'Bearer {api_token}',
                'Content-Type': 'application/json',
                'X-Wait-For-Model': 'false',
            },
            json={
                'inputs': enhanced_prompt,
                'parameters': {'num_frames': 25, 'num_inference_steps': 25, 'height': 480, 'width': 704},
                'options': {'wait_for_model': False, 'use_cache': False}
            },
            timeout=10
        )
        print(f"[generate-video] fallback status={response.status_code} ct={response.headers.get('content-type','')} body={response.text[:400]}")

    if response.status_code == 503:
        try:
            est = response.json().get('estimated_time', 30)
        except Exception:
            est = 30
        return {'statusCode': 200, 'headers': CORS,
                'body': json.dumps({'error': f'Model is warming up, please retry in {int(est)+5}s.'})}

    if response.status_code != 200:
        return {'statusCode': 200, 'headers': CORS,
                'body': json.dumps({'error': f'HuggingFace error {response.status_code}: {response.text[:300]}'})}

    content_type = response.headers.get('content-type', '')
    print(f"[generate-video] ct={content_type} len={len(response.content)}")

    # Got video bytes directly
    if 'video' in content_type or 'octet' in content_type or len(response.content) > 5000:
        import base64
        return {
            'statusCode': 200, 'headers': CORS,
            'body': json.dumps({
                'task_id': 'direct',
                'status': 'SUCCEEDED',
                'video_b64': base64.b64encode(response.content).decode(),
                'video_mime': 'video/mp4',
            })
        }

    # Got JSON — look for any job/task id field
    try:
        data = response.json()
        print(f"[generate-video] json={json.dumps(data)[:400]}")
        job_id = data.get('job_id') or data.get('id') or data.get('task_id') or data.get('request_id')
        if job_id:
            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'task_id': str(job_id), 'status': 'RUNNING'})}
    except Exception as e:
        print(f"[generate-video] json parse error: {e}")

    return {'statusCode': 200, 'headers': CORS,
            'body': json.dumps({'error': f'Unexpected response: {response.text[:300]}'})}
