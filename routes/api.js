import express from 'express';
import pool from "./db.js";
const router = express.Router();

// GET all words by user's id
// router.get('/literacyHome/vocabGarden/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM vocab WHERE userID = $1 ORDER BY created_at DESC',
//       [userId]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// GET all words by user's id
router.get('/user/test', async (req, res) => {
  try {
    // const { userId } = req.params;
    const userId = 1;
    const result = await pool.query(
      'SELECT word, sentence, created_at FROM vocab_cards WHERE user_id = ($1) ORDER BY created_at DESC;',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/JokeReading", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/Any?type=single");
    console.log("Enter 1");
    console.log(response.data);
    res.render('literacy/literacyJokeReading.ejs', { jokeData: response.data });
  } catch (error) {
    res.render('literacy/literacyJokeReading.ejs', { jokeData: error.response, jokeCategory: "error" });
  }
});

// POST a new word
router.post('/literacyHome/vocabGardenApp/words', async (req, res) => {
  try {
    const { word, definition } = req.body;
    const result = await pool.query(
      'INSERT INTO words (word, definition) VALUES ($1, $2) RETURNING *',
      [word, definition]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a word
router.delete('/literacyHome/vocabGardenApp/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM words WHERE id = $1', [id]);
    res.json({ message: 'Word deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;