import express from 'express';
import pool from "./db.js";
const router = express.Router();

// GET all words by user's id
// router.get('/user/test', async (req, res) => {
//   try {
//     // const { userId } = req.params;
//     const userId = 1;
//     const result = await pool.query(
//       'SELECT vocab_id, word, sentence, created_at FROM vocab_cards WHERE user_id = ($1) ORDER BY created_at DESC;',
//       [userId]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// POST a new word
router.post('/user/test', async (req, res) => {
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

// PATCH an existing vocab card
router.patch('/user/test', async (req, res) => {
  try {
    const { vocabId, editedWord, editedSentence, userId } = req.body;
    const result = await pool.query(
      'UPDATE vocab_cards SET word = $1, sentence = $2 WHERE vocab_id = $3 AND user_id = $4 RETURNING *',
      [editedWord, editedSentence, vocabId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vocab card not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a word by vocabId
router.delete('/user/test', async (req, res) => {
  try {
    const { vocabId, userId } = req.body;
    await pool.query('DELETE FROM vocab_cards WHERE vocab_id = $1 AND user_id = $2', [vocabId, userId]);
    res.json({ message: 'Word deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;