import cloudscraper

def test_iframe_content():
    scraper = cloudscraper.create_scraper()
    url = "https://anikai.to/iframe/Ksf-sOWq_1C7hntHyI7D-mpY4MJQsQaXw6IkkHl2cRT41Q_CtOiQxxwrR6hTeg"
    try:
        print(f"Fetching iframe content from {url}...")
        resp = scraper.get(url, headers={"Referer": "https://anikai.to/"})
        print(f"Status: {resp.status_code}")
        print(f"Content: {resp.text[:1000]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_iframe_content()
