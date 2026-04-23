import cloudscraper
import json

def test_resolve():
    scraper = cloudscraper.create_scraper()
    link_id = "dIOz9qam5Q" # From debug output
    base = "https://anikai.to"
    enc_url = "https://enc-dec.app/api/enc-kai"
    dec_kai_url = "https://enc-dec.app/api/dec-kai"
    dec_mega_url = "https://enc-dec.app/api/dec-mega"
    
    try:
        # 1. Encrypt link_id
        print(f"Encrypting link_id {link_id}...")
        resp = scraper.get(enc_url, params={"text": link_id})
        token = resp.json().get("result")
        
        # 2. Get encrypted result from Anikai
        print("Fetching encrypted result from Anikai...")
        links_view_url = f"{base}/ajax/links/view"
        headers = {"Referer": f"{base}/watch/naruto-9r5k", "X-Requested-With": "XMLHttpRequest"}
        resp = scraper.get(links_view_url, params={"id": link_id, "_": token}, headers=headers)
        enc_result = resp.json().get("result")
        print(f"Encrypted result: {enc_result[:100]}...")

        # 3. Decrypt with dec-kai
        print("Decrypting with dec-kai...")
        resp = scraper.post(dec_kai_url, json={"text": enc_result})
        embed_data = resp.json().get("result")
        if not embed_data or not embed_data.get("url"):
            print("Failed to decrypt embed URL")
            return
        embed_url = embed_data["url"]
        print(f"Embed URL: {embed_url}")

        # 4. Resolve media from embed
        # This part usually fails if the provider changed
        video_id = embed_url.rstrip("/").split("/")[-1].split("?")[0]
        embed_base = embed_url.split("/e/")[0] if "/e/" in embed_url else embed_url.rsplit("/", 1)[0]
        media_url = f"{embed_base}/media/{video_id}"
        print(f"Fetching media info from {media_url}...")
        resp = scraper.get(media_url)
        enc_media = resp.json().get("result")
        print(f"Encrypted media: {enc_media[:100]}...")

        # 5. Decrypt with dec-mega
        print("Decrypting with dec-mega...")
        resp = scraper.post(dec_mega_url, json={"text": enc_media, "agent": "Mozilla/5.0 ..."})
        final = resp.json().get("result")
        print(f"Final Sources: {json.dumps(final, indent=2)}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_resolve()
