import urllib.request
import json

def check_9222():
    try:
        with urllib.request.urlopen("http://127.0.0.1:9222/json") as r:
            pages = json.loads(r.read().decode())
            print(f"Found {len(pages)} pages on port 9222:")
            for p in pages:
                print(f"- {p.get('title')} ({p.get('url')})")
    except Exception as e:
        print(f"Error connecting to 9222: {e}")

if __name__ == "__main__":
    check_9222()
