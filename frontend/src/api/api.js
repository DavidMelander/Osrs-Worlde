import axios from 'axios';

const letterPageCounts = {
  a: 25, b: 25, c: 17, d: 20, e: 11, f: 8, g: 18,
  h: 5, i: 10, j: 4, k: 4, l: 7, m: 26, n: 3,
  o: 9, p: 13, q: 1, r: 26, s: 45, t: 24, u: 5,
  v: 5, w: 11, x: 1, y: 3, z: 5,
};

const getRandomLetter = () => String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z

const fetchItems = async (alpha, page) => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/items`, {
    params: {
      category: 1,
      alpha,
      page
    }
  });
};

const generateHint = (word, description) => {
  return description.toLowerCase().replace(new RegExp(word.toLowerCase(), 'gi'), '*****');
};

export const fetchOSRSWords = async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const alpha = getRandomLetter();
      const totalPages = letterPageCounts[alpha];
      
      if (!totalPages) continue; // Retry if no pages are defined for the letter

      const page = Math.floor(Math.random() * totalPages) + 1;

      const response = await fetchItems(alpha, page);

      console.log('API response:', response.data); // Log response

      const words = response.data.items;

      if (!words || words.length === 0) continue; // Retry if no words are fetched

      // Filter and clean the words and hints
      const fetchedWords = words
        .filter(item => {
          const cleanName = item.name.split('(')[0].trim();
          return cleanName.length <= 10;
        })
        .map(item => {
          const cleanName = item.name.split('(')[0].trim();
          const hint = generateHint(cleanName, item.description);

          return {
            word: cleanName,
            hint: hint
          };
        });

      if (fetchedWords.length === 0) continue; // Retry if no valid words after filtering

      // Return a random word from the fetched list
      const randomWord = fetchedWords[Math.floor(Math.random() * fetchedWords.length)];
      return randomWord;
    } catch (error) {
      console.error(`Error fetching OSRS words on attempt ${attempt + 1}:`, error);
      continue; // Retry on error
    }
  }

  console.error('Failed to fetch a valid word after multiple attempts.');
  return { word: 'osrs', hint: 'Default hint' };
};
