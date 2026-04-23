import cloudscraper
import json

def test():
    scraper = cloudscraper.create_scraper()
    try:
        print("Testing encryption bridge...")
        resp = scraper.get("https://enc-dec.app/api", timeout=10)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text[:100]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
