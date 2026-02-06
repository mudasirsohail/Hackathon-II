import requests
import json

# Test the health endpoint first
def test_health():
    url = "http://127.0.0.1:8000/health"
    try:
        response = requests.get(url)
        print(f"Health endpoint - Status: {response.status_code}, Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing health endpoint: {e}")
        return False

# Test the chat endpoint
def test_chat():
    url = "http://127.0.0.1:8000/api/chat"
    
    # Sample payload
    payload = {
        "message": "Hello",
        "user_id": "test_user_123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Chat endpoint - Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error response: {response.text}")
        return response.status_code
    except Exception as e:
        print(f"Error testing chat endpoint: {e}")
        return None

if __name__ == "__main__":
    print("Testing backend server...")
    health_ok = test_health()
    if health_ok:
        print("\nTesting chat endpoint...")
        test_chat()
    else:
        print("Health check failed, skipping chat test")