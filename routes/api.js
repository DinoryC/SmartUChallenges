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
  console.log("api.js 'get' router hit");
  try {
    // const { userId } = req.params;
    const userId = 1;
    const result = await pool.query(
      'SELECT vocab_id, word, sentence, created_at FROM vocab_cards WHERE user_id = ($1) ORDER BY created_at DESC;',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new word
router.post('/user/test', async (req, res) => {
  console.log("api.js post router hit");
  console.log(req.body);
  try {
    const { word, sentence, userId } = req.body;
    const result = await pool.query(
      'INSERT INTO vocab_cards (word, sentence, user_id) VALUES ($1, $2, $3) RETURNING *',
      [word, sentence, userId]
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