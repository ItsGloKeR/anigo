const ALL_GENRES = [
  "Action", "Adventure", "Avant Garde", "Boys Love", "Comedy", "Demons", "Drama", "Ecchi", 
  "Fantasy", "Girls Love", "Gourmet", "Harem", "Horror", "Isekai", "Iyashikei", "Josei", 
  "Kids", "Magic", "Mahou Shoujo", "Martial Arts", "Mecha", "Military", "Music", "Mystery", 
  "Parody", "Psychological", "Reverse Harem", "Romance", "School", "Sci-Fi", "Seinen", 
  "Shoujo", "Shounen", "Slice of Life", "Space", "Sports", "Super Power", "Supernatural", 
  "Suspense", "Thriller", "Vampire"
];

const OFFICIAL_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", 
  "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", 
  "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const GENRE_MAP = {
  "Boys Love": "Boys' Love",
  "Girls Love": "Girls' Love",
  "Gourmet": "Food",
  "Harem": "Female Harem",
  "Reverse Harem": "Male Harem",
};

const query = `
  query ($genre_in: [String], $tag_in: [String]) {
    Page(perPage: 1) {
      media(genre_in: $genre_in, tag_in: $tag_in) {
        id
      }
    }
  }
`;

async function testGenres() {
  console.log("Checking genres and tags with MAPPING...");
  for (const genre of ALL_GENRES) {
    const mappedName = GENRE_MAP[genre] || genre;
    const isOfficial = OFFICIAL_GENRES.includes(mappedName);
    const variables = isOfficial ? { genre_in: [mappedName] } : { tag_in: [mappedName] };
    
    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
      });
      const data = await response.json();
      const count = data.data?.Page?.media?.length || 0;
      if (count === 0) {
        console.log(`[STILL FAILED] ${genre} -> Result: ${count}`);
      } else {
         // console.log(`[FIXED] ${genre}`);
      }
    } catch (err) {
      console.log(`[ERROR] ${genre}: ${err.message}`);
    }
  }
  console.log("Verification complete.");
}

testGenres();
