const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const { developers } = req.body;

    const requests = developers.map(async (username) => {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      return {
        name: response.data.name,
        bio: response.data.bio,
      };
    });

    const results = await Promise.all(requests);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

