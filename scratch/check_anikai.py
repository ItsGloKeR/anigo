import requests
from bs4 import BeautifulSoup
import json

BASE = "https://anikai.to"
AJAX = f"{BASE}/ajax"
AJAX_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": BASE + "/",
    "X-Requested-With": "XMLHttpRequest"
}

def check_search(query):
    print(f"Searching for: {query}")
    resp = requests.get(f"{AJAX}/anime/search", params={"keyword": query}, headers=AJAX_HEADERS)
    data = resp.json()
    html = data.get("result", {}).get("html", "")
    
    if not html:
        print("No HTML found")
        return

    soup = BeautifulSoup(html, "html.parser")
    items = soup.find_all("a", class_="aitem")
    print(f"Found {len(items)} items")
    
    for i, item in enumerate(items[:5]):
        print(f"\nItem {i+1}:")
        title = item.find("h6", class_="title").get_text(strip=True) if item.find("h6", class_="title") else "N/A"
        print(f"Title: {title}")
        
        # Check for other data
        details = item.select(".dot")
        for d in details:
            print(f"Detail (dot): {d.get_text(strip=True)}")
            
        extra = item.select(".tick-item")
        for e in extra:
            print(f"Extra (tick): {e.get_text(strip=True)}")
            
        # Raw HTML snippet to identify structure
        # print(f"Raw Snippet: {item.prettify()[:500]}")

if __name__ == "__main__":
    check_search("Re:Zero")
