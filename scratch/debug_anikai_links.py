import cloudscraper
import re
import json
from bs4 import BeautifulSoup

def test_links():
    scraper = cloudscraper.create_scraper()
    ep_token = "e9298OH2tROylH1c0ceX" # From previous test
    base = "https://anikai.to"
    enc_url = "https://enc-dec.app/api/enc-kai"
    try:
        resp = scraper.get(enc_url, params={"text": ep_token})
        enc_ep_token = resp.json().get("result")
        
        links_url = f"{base}/ajax/links/list"
        headers = {"Referer": f"{base}/watch/naruto-9r5k", "X-Requested-With": "XMLHttpRequest"}
        resp = scraper.get(links_url, params={"token": ep_token, "_": enc_ep_token}, headers=headers)
        links_html = resp.json().get("result")
        
        soup = BeautifulSoup(links_html, "html.parser")
        groups = soup.select(".server-items")
        print(f"Number of groups found: {len(groups)}")
        for i, group in enumerate(groups):
            print(f"Group {i} data-id: {group.get('data-id')}")
            servers = group.select(".server")
            print(f"  Servers in group: {len(servers)}")
            for s in servers:
                print(f"    Server: {s.get_text(strip=True)} (ID: {s.get('data-lid')})")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_links()
