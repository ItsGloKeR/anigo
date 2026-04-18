
import requests
from bs4 import BeautifulSoup

def check_dub(query):
    base = "https://anikai.to"
    search_url = f"{base}/ajax/anime/search"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": base + "/",
        "X-Requested-With": "XMLHttpRequest"
    }
    
    # 1. Search
    resp = requests.get(search_url, params={"keyword": query}, headers=headers)
    html = resp.json().get("result", {}).get("html", "")
    soup = BeautifulSoup(html, "html.parser")
    
    results = []
    for item in soup.find_all("a", class_="aitem"):
        title = item.find("h6", class_="title").get_text(strip=True)
        slug = item.get("href", "").replace("/watch/", "")
        results.append({"title": title, "slug": slug})
        print(f"Candidate: {title} | Slug: {slug}")

    if not results: return
    
    # 2. Pick the Dub candidate if any, otherwise first
    target = next((r for r in results if "(dub)" in r["title"].lower()), results[0])
    print(f"\nChecking servers for: {target['title']}")
    
    # Get Episodes
    # We need a token for episodes but let's just try to see if we can get info
    info_resp = requests.get(f"{base}/watch/{target['slug']}", headers=headers)
    # The links are fetched via AJAX/links/list with a token
    # This script is just to see the titles of search results really.

if __name__ == "__main__":
    check_dub("Chainsaw Man")
