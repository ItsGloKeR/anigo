
import sys
import os

# Add the current directory to sys.path so we can import modules
sys.path.append(os.getcwd())

from api.index import AnikaiScraper

def check_search():
    scraper = AnikaiScraper()
    query = "Re:Zero"
    print(f"--- Searching Anikai for: {query} ---")
    results = scraper.search(query)
    for r in results:
        print(f"Title: {r['title']} | Slug: {r['slug']}")

if __name__ == "__main__":
    check_search()
