
import requests
from bs4 import BeautifulSoup

def test_search():
    url = "https://aniwatchtv.to/search?keyword=Re:Zero"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    resp = requests.get(url, headers=headers)
    soup = BeautifulSoup(resp.text, "html.parser")
    
    items = soup.select(".flw-item")
    for item in items:
        title = item.select_one(".film-name a").get_text(strip=True)
        data_id = item.select_one(".film-poster-ahref").get("data-id")
        
        # Check for metadata like year or format in search results
        meta = [i.get_text(strip=True) for i in item.select(".fd-infor .fdi-item")]
        print(f"Title: {title} | ID: {data_id} | Meta: {meta}")

if __name__ == "__main__":
    test_search()
