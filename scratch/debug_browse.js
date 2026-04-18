const ANILIST_URL = "https://graphql.anilist.co";
const query = `
  query ($page: Int, $genre: [String]) {
    Page(page: $page, perPage: 30) {
      media(type: ANIME, genre_in: $genre) {
        id
        title { romaji }
      }
    }
  }
`;

async function test(genreVal) {
  const variables = { page: 1, genre: genreVal };
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.log(`Error with genre=${JSON.stringify(genreVal)}:`, json.errors[0].message);
  } else {
    console.log(`Success with genre=${JSON.stringify(genreVal)}: Fetched ${json.data.Page.media.length} items.`);
  }
}

async function run() {
  await test(null);
  await test(["Action"]);
}

run();
