import os
import json
import requests

def handler(event: dict, context) -> dict:
    """
    Poll Replicate prediction status by task_id (prediction_id).
    Returns status (RUNNING, SUCCEEDED, FAILED) and video URL when done.
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

    params = event.get('queryStringParameters') or {}
    task_id = params.get('task_id', '').strip()

    if not task_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'task_id is required'})}

    api_token = os.environ.get('REPLICATE_API_TOKEN')
    if not api_token:
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': 'REPLICATE_API_TOKEN not configured'})}

    response = requests.get(
        f'https://api.replicate.com/v1/predictions/{task_id}',
        headers={
            'Authorization': f'Token {api_token}',
            'Content-Type': 'application/json',
        },
        timeout=15
    )

    if response.status_code == 404:
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Prediction not found'})}

    if response.status_code != 200:
        return {'statusCode': response.status_code, 'headers': CORS, 'body': json.dumps({'error': 'Replicate API error'})}

    data = response.json()
    status = data.get('status', 'starting')

    status_map = {'starting': 'RUNNING', 'processing': 'RUNNING', 'succeeded': 'SUCCEEDED', 'failed': 'FAILED', 'canceled': 'FAILED'}
    mapped_status = status_map.get(status, 'RUNNING')

    output = data.get('output')
    video_url = output if isinstance(output, str) else (output[0] if isinstance(output, list) and output else None)

    # Estimate progress from logs if available
    logs = data.get('logs') or ''
    progress = 50 if mapped_status == 'RUNNING' else (100 if mapped_status == 'SUCCEEDED' else 0)

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'task_id': task_id,
            'status': mapped_status,
            'progress': progress,
            'video_url': video_url,
            'error': data.get('error'),
        })
    }