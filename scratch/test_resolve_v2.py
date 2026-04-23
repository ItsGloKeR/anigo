import cloudscraper
import json

def test_resolve_v2():
    scraper = cloudscraper.create_scraper()
    link_id = "dIOz9qam5Q"
    base = "https://anikai.to"
    enc_url = "https://enc-dec.app/api/enc-kai"
    dec_kai_url = "https://enc-dec.app/api/dec-kai"
    
    try:
        # 1. Encrypt link_id
        resp = scraper.get(enc_url, params={"text": link_id})
        token = resp.json().get("result")
        
        # 2. Get embed URL
        links_view_url = f"{base}/ajax/links/view"
        headers = {"Referer": f"{base}/watch/naruto-9r5k", "X-Requested-With": "XMLHttpRequest"}
        resp = scraper.get(links_view_url, params={"id": link_id, "_": token}, headers=headers)
        enc_result = resp.json().get("result")
        
        # 3. Decrypt
        resp = scraper.post(dec_kai_url, json={"text": enc_result})
        embed_url = resp.json().get("result")["url"]
        print(f"Embed URL: {embed_url}")

        # 4. Try to find the media JSON via different patterns
        video_id = embed_url.rstrip("/").split("/")[-1].split("?")[0]
        
        # Pattern 1: /ajax/v2/embed-1/media?id=ID
        p1 = f"https://anikai.to/ajax/v2/embed-1/media?id={video_id}"
        print(f"Trying Pattern 1: {p1}")
        resp = scraper.get(p1, headers={"Referer": embed_url, "X-Requested-With": "XMLHttpRequest"})
        print(f"P1 Status: {resp.status_code}")
        if resp.status_code == 200:
             print(f"P1 Result: {resp.text[:100]}")

        # Pattern 2: /iframe/media/ID
        p2 = f"https://anikai.to/iframe/media/{video_id}"
        print(f"Trying Pattern 2: {p2}")
        resp = scraper.get(p2, headers={"Referer": embed_url, "X-Requested-With": "XMLHttpRequest"})
        print(f"P2 Status: {resp.status_code}")
        if resp.status_code == 200:
             print(f"P2 Result: {resp.text[:100]}")

        # Pattern 3: /ajax/embed-1/media?id=ID
        p3 = f"https://anikai.to/ajax/embed-1/media?id={video_id}"
        print(f"Trying Pattern 3: {p3}")
        resp = scraper.get(p3, headers={"Referer": embed_url, "X-Requested-With": "XMLHttpRequest"})
        print(f"P3 Status: {resp.status_code}")
        if resp.status_code == 200:
             print(f"P3 Result: {resp.text[:100]}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_resolve_v2()
