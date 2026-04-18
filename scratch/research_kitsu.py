
import requests

def test_kitsu_episodes(title):
    # 1. Search for anime
    search_url = f"https://kitsu.io/api/edge/anime?filter[text]={title}"
    headers = {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
    }
    resp = requests.get(search_url, headers=headers)
    data = resp.json()
    
    if not data['data']:
        print("Not found on Kitsu")
        return
        
    anime_id = data['data'][0]['id']
    title_found = data['data'][0]['attributes']['canonicalTitle']
    print(f"Found on Kitsu: {title_found} (ID: {anime_id})")
    
    # 2. Get episodes
    ep_url = f"https://kitsu.io/api/edge/episodes?filter[mediaId]={anime_id}&page[limit]=20"
    ep_resp = requests.get(ep_url, headers=headers)
    ep_data = ep_resp.json()
    
    for ep in ep_data['data']:
        attr = ep['attributes']
        title = attr.get('canonicalTitle') or attr.get('titles', {}).get('en_us')
        num = attr.get('number')
        img = attr.get('thumbnail', {}).get('original')
        print(f"Ep {num}: {title} | Img: {img}")

if __name__ == "__main__":
    test_kitsu_episodes("Re:Zero Season 2")
