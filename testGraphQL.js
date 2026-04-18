// Using native fetch in Node 20+
const DETAILS_QUERY = `
fragment MediaFields on Media {
  id
  idMal
  title { romaji english native }
  coverImage { large }
  episodes
  format
  startDate { year month day }
}
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    ...MediaFields
    relations {
      edges {
        relationType
        node {
          ...MediaFields
          relations {
            edges {
              relationType
              node {
                ...MediaFields
                relations {
                  edges {
                    relationType
                    node {
                      ...MediaFields
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

async function test(id) {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: DETAILS_QUERY, variables: { id } }),
    });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
}

test(16498);
