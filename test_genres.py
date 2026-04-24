import requests

ANIKAI_GENRE_MAP = {
    "Action": "47",
    "Adventure": "1",
    "Avant Garde": "235",
    "Boys Love": "184",
    "Comedy": "7",
    "Demons": "127",
    "Drama": "66",
    "Ecchi": "8",
    "Fantasy": "34",
    "Girls Love": "926",
    "Gourmet": "436",
    "Harem": "196",
    "Horror": "421",
    "Isekai": "77",
    "Iyashikei": "225",
    "Josei": "555",
    "Kids": "35",
    "Magic": "78",
    "Mahou Shoujo": "857",
    "Martial Arts": "92",
    "Mecha": "219",
    "Military": "134",
    "Music": "27",
    "Mystery": "48",
    "Parody": "356",
    "Psychological": "240",
    "Reverse Harem": "798",
    "Romance": "145",
    "School": "9",
    "Sci-Fi": "36",
    "Seinen": "189",
    "Shoujo": "183",
    "Shounen": "37",
    "Slice of Life": "125",
    "Space": "220",
    "Sports": "10",
    "Super Power": "350",
    "Supernatural": "49",
    "Suspense": "322",
    "Thriller": "241",
    "Vampire": "126",
}

ok = []
fail = []

for genre, gid in ANIKAI_GENRE_MAP.items():
    try:
        url = f"http://127.0.0.1:5000/api/anikai/browse/{gid}?page=1&sort=updated_date"
        resp = requests.get(url, timeout=15)
        data = resp.json()
        count = len(data.get("media", []))
        if count > 0:
            ok.append(f"OK  {genre} (ID:{gid}) -> {count} results")
        else:
            fail.append(f"FAIL {genre} (ID:{gid}) -> 0 results")
    except Exception as e:
        fail.append(f"ERR  {genre} (ID:{gid}) -> {e}")

print("=== WORKING GENRES ===")
for line in ok:
    print(line)

print(f"\n=== BROKEN GENRES ({len(fail)}) ===")
for line in fail:
    print(line)

print(f"\nTotal: {len(ok)} OK, {len(fail)} FAIL")
