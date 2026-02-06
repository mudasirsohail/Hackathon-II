import requests
import json

# Test the chat endpoint
def test_chat_endpoint():
    url = "http://127.0.0.1:8080/api/chat"
    
    # Sample payload
    payload = {
        "message": "What are my pending tasks?",
        "user_id": "test_user_123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("[SUCCESS] Chat endpoint is working correctly!")
        else:
            print("[ERROR] Chat endpoint returned an error")
            
    except Exception as e:
        print(f"[ERROR] Error testing chat endpoint: {e}")

if __name__ == "__main__":
    test_chat_endpoint()