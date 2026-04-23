import cloudscraper

def test_hianime():
    scraper = cloudscraper.create_scraper()
    base = "https://hianime.to/ajax"
    try:
        print("Testing HiAnime Search...")
        headers = {
            "Referer": "https://hianime.to/",
            "X-Requested-With": "XMLHttpRequest"
        }
        resp = scraper.get(f"{base}/anime/search?keyword=Naruto", headers=headers, timeout=10)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_hianime()
