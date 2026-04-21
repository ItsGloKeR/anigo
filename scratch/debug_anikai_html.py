
import sys
import os
from bs4 import BeautifulSoup

# Add the current directory to sys.path so we can import modules
sys.path.append(os.getcwd())

from api.index import AnikaiScraper, HttpClient

def debug_anikai_html():
    http = HttpClient()
    slug = "rezero-kara-hajimeru-isekai-seikaitsu-4th-season-8lj0"
    url = f"https://anikai.to/anime/{slug}"
    
    print(f"--- Fetching HTML for: {url} ---")
    html = http.get_html(url)
    
    if not html:
        print("Failed to fetch HTML.")
        return
        
    soup = BeautifulSoup(html, "html.parser")
    
    # Check for syncData
    sync = soup.select_one("script#syncData")
    if sync:
        print(f"syncData found: {sync.string[:200]}...")
    else:
        print("syncData NOT found.")
        
    # Check for episode list directly in HTML
    eplist = soup.select(".eplist a")
    print(f"Direct HTML episodes found: {len(eplist)}")
    
    # Check for any other ID sources
    meta_id = soup.find("meta", {"name": "id"})
    if meta_id:
        print(f"Meta ID: {meta_id.get('content')}")

if __name__ == "__main__":
    debug_anikai_html()
