import requests
from bs4 import BeautifulSoup

resp = requests.get('https://anikai.to/browser', headers={'User-Agent': 'Mozilla/5.0'})
soup = BeautifulSoup(resp.text, 'html.parser')

# Find all genre checkboxes
for inp in soup.find_all('input', attrs={'name': 'genre[]'}):
    parent = inp.parent
    text = parent.get_text(strip=True) if parent else ''
    if 'school' in text.lower():
        print(f"Found: '{text}' -> ID: {inp.get('value')}")

# Also try finding by looking at the broader structure
print("\n--- All genres containing 'school' ---")
for el in soup.find_all(text=lambda t: t and 'school' in t.lower()):
    parent = el.parent
    if parent:
        inp = parent.find('input')
        if inp:
            print(f"Text: '{el.strip()}' -> Input value: {inp.get('value')}")
        else:
            # Check siblings
            prev = parent.find_previous_sibling('input') or parent.find('input')
            print(f"Text: '{el.strip()}' -> Parent: {parent.name}, Input: {prev}")
