const ANILIST_URL = "https://graphql.anilist.co";
const query = `
  query ($page: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: 20) {
      media(type: ANIME, sort: $sort) {
        id
        title { romaji }
        isAdult
        favourites
      }
    }
  }
`;
const variables = { page: 1, sort: ["TRENDING_DESC"] };

fetch(ANILIST_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables }),
})
  .then(res => res.json())
  .then(json => {
    if (json.errors) {
      console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
    } else {
      console.log("Success! Fetched", json.data.Page.media.length, "items.");
      console.log("First item:", JSON.stringify(json.data.Page.media[0], null, 2));
    }
  })
  .catch(err => console.error("Fetch Error:", err));
