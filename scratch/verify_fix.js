const ANILIST_URL = "https://graphql.anilist.co";

const BROWSE_QUERY = `
  query ($page: Int, $search: String, $format: MediaFormat, $sort: [MediaSort], $seasonYear: Int, $status: MediaStatus, $genre: String) {
    Page(page: $page, perPage: 30) {
      media(type: ANIME, search: $search, format: $format, sort: $sort, seasonYear: $seasonYear, status: $status, genre: $genre) {
        id
        title { romaji }
        isAdult
      }
    }
  }
`;

async function test() {
  const variables = { page: 1, sort: ["TRENDING_DESC"], genre: null };
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: BROWSE_QUERY, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error("Browse Query Error:", JSON.stringify(json.errors, null, 2));
  } else {
    console.log("Success! Fetched", json.data.Page.media.length, "items with null genre.");
  }
}

test();
