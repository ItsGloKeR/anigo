import requests
import json

BASE = "http://localhost:5000/api/anikai"

def test_mapping(anilist_title, year, episodes):
    print(f"\n--- Testing Mapping for: {anilist_title} ({year}, {episodes} eps) ---")
    
    # 1. Search
    search_resp = requests.get(f"{BASE}/search", params={"keyword": anilist_title})
    results = search_resp.json().get("results", [])
    
    print(f"Search found {len(results)} results.")
    
    for res in results[:3]:
        # 2. Get Info
        info_resp = requests.get(f"{BASE}/info/{res['slug']}")
        info = info_resp.data if hasattr(info_resp, 'data') else info_resp.json()
        
        res_year = info.get("year", "N/A")
        res_eps = len(info.get("episodes", []))
        
        print(f"Result: {res['title']}")
        print(f"  Year: {res_year} (Target: {year})")
        print(f"  Eps: {res_eps} (Target: {episodes})")
        
        score = 0
        if str(res_year) == str(year): score += 50
        if abs(res_eps - episodes) <= 2: score += 50
        
        print(f"  Metadata Score: {score}")

if __name__ == "__main__":
    # Test cases that often fail with just title search
    test_mapping("Re:ZERO -Starting Life in Another World- Season 2", 2020, 13)
    test_mapping("Mushoku Tensei: Jobless Reincarnation Season 2", 2023, 12)
