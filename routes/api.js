import express from 'express';
import pool from "./db.js";
// import * as util from 'util'; // Optional, for complex logging
const router = express.Router();

// GET all words by user's id
router.get('/', async (req, res) => {
  console.log("api.js   / req = " + JSON.stringify(req.user, null, 2));
  console.log("api.js   / req.isAuthenticated() = " + JSON.stringify(req.isAuthenticated()));
  // console.log("api.js  /  req = ", util.inspect(req, { depth: 2 }));
  if (!req.isAuthenticated()) {
    return res.status(500).send('unauthorised user access denied');
  }
  
  try {
    const { user_id } = req.user;
    const result = await pool.query(
      'SELECT vocab_id, word, sentence, created_at FROM vocab_cards WHERE user_id = ($1) ORDER BY created_at DESC;',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new word
router.post('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(500).send('Unauthorised user, access denied');
  }

  try {
    console.log("api.js   / req.user " + JSON.stringify(req.user, null, 2));
    console.log("api.js   / req.body " + JSON.stringify(req.body, null, 2));
    const { user_id } = req.user;
    const { word, sentence } = req.body;
    console.log(`api.js  / post  check... user_id = ${user_id}, word= ${word}, sentence= ${sentence}`);
    const result = await pool.query(
      'INSERT INTO vocab_cards (word, sentence, user_id) VALUES ($1, $2, $3) RETURNING *',
      [word, sentence, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PATCH an existing vocab card
router.patch('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(500).send('Unauthorised user, access denied');
  }

  try {
    const { user_id } = req.user;
    const { vocabId, editedWord, editedSentence } = req.body;
    const result = await pool.query(
      'UPDATE vocab_cards SET word = $1, sentence = $2 WHERE vocab_id = $3 AND user_id = $4 RETURNING *',
      [editedWord, editedSentence, vocabId, user_id]
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
router.delete('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(500).send('Unauthorised user, access denied');
  }

  try {
    const { user_id } = req.user;
    const { vocabId } = req.body;
    await pool.query('DELETE FROM vocab_cards WHERE vocab_id = $1 AND user_id = $2', [vocabId, user_id]);
    res.json({ message: 'Word deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;