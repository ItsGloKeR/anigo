const ANILIST_URL = "https://graphql.anilist.co";

async function testGenres() {
  const query = `{ GenreCollection }`;
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error("Genre Error:", json.errors[0].message);
  } else {
    console.log("Genres fetched:", json.data.GenreCollection.length);
  }
}

testGenres();
