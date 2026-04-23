import cloudscraper
import re
import json

def test_stream():
    scraper = cloudscraper.create_scraper()
    slug = "naruto-9r5k"
    base = "https://anikai.to"
    try:
        print(f"Fetching info for {slug}...")
        resp = scraper.get(f"{base}/watch/{slug}")
        html = resp.text
        match = re.search(r'"anime_id"\s*:\s*"([^"]+)"', html)
        if not match:
            print("Failed to find anime_id")
            return
        ani_id = match.group(1)
        print(f"Found ani_id: {ani_id}")

        # Get Encrypted Token for episodes
        enc_url = "https://enc-dec.app/api/enc-kai"
        resp = scraper.get(enc_url, params={"text": ani_id})
        token = resp.json().get("result")
        print(f"Encrypted token: {token}")

        # Get Episodes
        ep_url = f"{base}/ajax/episodes/list"
        headers = {"Referer": f"{base}/watch/{slug}", "X-Requested-With": "XMLHttpRequest"}
        resp = scraper.get(ep_url, params={"ani_id": ani_id, "_": token}, headers=headers)
        print(f"Episodes status: {resp.status_code}")
        # print(f"Episodes result: {resp.json().get('result')[:200]}")
        
        # Get first episode token
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(resp.json().get('result'), "html.parser")
        first_ep = soup.select_one(".eplist a")
        if not first_ep:
            print("No episodes found")
            return
        ep_token = first_ep.get("token")
        print(f"First episode token: {ep_token}")

        # Get Links
        # Encrypt ep_token
        resp = scraper.get(enc_url, params={"text": ep_token})
        enc_ep_token = resp.json().get("result")
        
        links_url = f"{base}/ajax/links/list"
        resp = scraper.get(links_url, params={"token": ep_token, "_": enc_ep_token}, headers=headers)
        print(f"Links status: {resp.status_code}")
        links_html = resp.json().get("result")
        print(f"Links HTML: {links_html[:500]}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_stream()
