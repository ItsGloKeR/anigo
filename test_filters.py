import requests
from bs4 import BeautifulSoup

soup = BeautifulSoup(requests.get('https://anikai.to/browser', headers={'User-Agent': 'Mozilla/5.0'}).text, 'html.parser')
for inp in soup.select('input[type="radio"], input[type="checkbox"]'):
    name = inp.get('name')
    val = inp.get('value', '')
    text = inp.parent.get_text(strip=True) if inp.parent else ''
    if name != 'genre[]':
        print(f"{name} = {val} ({text})")
