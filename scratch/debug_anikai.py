
import sys
import os

# Add the current directory to sys.path so we can import modules
sys.path.append(os.getcwd())

from api.index import AnikaiScraper, HttpClient

def debug_anikai():
    scraper = AnikaiScraper()
    slug = "rezero-kara-hajimeru-isekai-seikaitsu-4th-season-8lj0" # From user screenshot
    
    print(f"--- Debugging Anikai for slug: {slug} ---")
    
    # 1. Get info and ID
    info = scraper.get_info(slug)
    if not info:
        print("Failed to get info for slug.")
        return
        
    ani_id = info.get("ani_id")
    print(f"Resolved AniID: {ani_id}")
    
    if not ani_id:
        print("No AniID found.")
        return
        
    # 2. Get episodes
    episodes = scraper.get_episodes(ani_id)
    print(f"Found {len(episodes)} episodes.")
    
    if len(episodes) > 0:
        print(f"Sample episode: {episodes[0]}")
    else:
        print("Episode list is EMPTY.")

if __name__ == "__main__":
    debug_anikai()
