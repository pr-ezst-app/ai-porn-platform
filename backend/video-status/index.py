import os
import json
import requests

def handler(event: dict, context) -> dict:
    """
    Poll Runway ML task status by task_id.
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

    api_key = os.environ.get('RUNWAY_API_KEY')
    if not api_key:
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': 'RUNWAY_API_KEY not configured'})}

    headers = {
        'Authorization': f'Bearer {api_key}',
        'X-Runway-Version': '2024-11-06',
    }

    response = requests.get(
        f'https://api.dev.runwayml.com/v1/tasks/{task_id}',
        headers=headers,
        timeout=15
    )

    if response.status_code == 404:
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Task not found'})}

    if response.status_code != 200:
        return {'statusCode': response.status_code, 'headers': CORS, 'body': json.dumps({'error': 'Runway API error'})}

    data = response.json()
    status = data.get('status', 'RUNNING')
    output = data.get('output') or []
    progress = data.get('progressRatio', 0)

    video_url = output[0] if output and status == 'SUCCEEDED' else None

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'task_id': task_id,
            'status': status,
            'progress': round((progress or 0) * 100),
            'video_url': video_url,
            'failure_code': data.get('failureCode'),
        })
    }