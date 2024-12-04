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
router.get('/literacyHome/vocabGarden/1', async (req, res) => {
  try {
    // const { userId } = req.params;
    const userId = 1;
    const result = await pool.query(
      'SELECT word, sentence, created_at FROM vocab_cards WHERE user_id = ($1) ORDER BY created_at DESC;',
      [userId]
    );
    console.log("api.js line 29: " + results.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new word
router.post('/literacyHome/vocabGarden/words', async (req, res) => {
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
router.delete('/literacyHome/vocabGarden/:id', async (req, res) => {
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