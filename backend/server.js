require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Endpoint to fetch items
app.get('/api/items', async (req, res) => {
  const { category, alpha, page } = req.query;
  const OSRS_ITEMS_API = process.env.OSRS_ITEMS_API || 'https://secure.runescape.com/m=itemdb_oldschool/api/catalogue/items.json?';
  const url = `${OSRS_ITEMS_API}category=${category}&alpha=${alpha}&page=${page}`;

  try {
      const response = await axios.get(url);
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
