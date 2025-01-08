import { describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import pool from '../db.js';
import apiRouter from '../api.js';

let app;
let testUser;

// Set up the Express app with mocked authentication
beforeAll(async () => {
    // Insert a test user into the database
    const userResult = await pool.query(
        'INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *',
        ['testuser@example.com', 'testuser']
    );
    testUser = userResult.rows[0];

    app = express();
    app.use(express.json());

    // Middleware to simulate authentication
    app.use((req, res, next) => {
        req.isAuthenticated = () => true;
        req.user = { user_id: testUser.user_id };
        next();
    });

    // Mount the API router at /api
    app.use('/api', apiRouter);
});

// Clear vocab_cards table for the test user before each test
beforeEach(async () => {
    await pool.query('DELETE FROM vocab_cards WHERE user_id = $1', [testUser.user_id]);
});

// Clean up: remove test user and close DB connection
afterAll(async () => {
    await pool.query('DELETE FROM users WHERE user_id = $1', [testUser.user_id]);
    await pool.end();
});

describe('API Endpoints', () => {
    describe('GET /api', () => {
        it('should return all words for the authenticated user', async () => {
            // Insert test vocab_cards for the user
            const insertResult = await pool.query(
                'INSERT INTO vocab_cards (word, sentence, user_id) VALUES ($1, $2, $3) RETURNING *',
                ['hello', 'Hello world', testUser.user_id]
            );
            const insertedCard = insertResult.rows[0];

            const response = await request(app).get('/api');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);

            // Check that the inserted card is in the response
            const card = response.body.find(c => c.vocab_id === insertedCard.vocab_id);
            expect(card).toBeDefined();
            expect(card.word).toBe('hello');
            expect(card.sentence).toBe('Hello world');
        });
    });

    describe('POST /api', () => {
        it('should create a new word', async () => {
            const newWord = { word: 'test', sentence: 'This is a test sentence' };
            const response = await request(app)
                .post('/api')
                .send(newWord);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('vocab_id');
            expect(response.body.word).toBe(newWord.word);
            expect(response.body.sentence).toBe(newWord.sentence);

            // Verify insertion in DB
            const dbResult = await pool.query(
                'SELECT * FROM vocab_cards WHERE vocab_id = $1',
                [response.body.vocab_id]
            );
            expect(dbResult.rows.length).toBe(1);
            expect(dbResult.rows[0].word).toBe(newWord.word);
        });
    });

    describe('PATCH /api', () => {
        it('should update an existing vocab card', async () => {
            // Insert a vocab_card to update
            const insertResult = await pool.query(
                'INSERT INTO vocab_cards (word, sentence, user_id) VALUES ($1, $2, $3) RETURNING *',
                ['oldWord', 'Old sentence', testUser.user_id]
            );
            const card = insertResult.rows[0];

            const updatedData = {
                vocabId: card.vocab_id,
                editedWord: 'newWord',
                editedSentence: 'New sentence'
            };

            const response = await request(app)
                .patch('/api')
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.word).toBe(updatedData.editedWord);
            expect(response.body.sentence).toBe(updatedData.editedSentence);

            // Verify update in DB
            const dbResult = await pool.query(
                'SELECT * FROM vocab_cards WHERE vocab_id = $1',
                [card.vocab_id]
            );
            expect(dbResult.rows[0].word).toBe(updatedData.editedWord);
        });

        it('should return 404 if vocab card not found', async () => {
            const response = await request(app)
                .patch('/api')
                .send({
                    vocabId: 999999,
                    editedWord: 'doesNotExist',
                    editedSentence: 'doesNotExist'
                });
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Vocab card not found');
        });
    });

    describe('DELETE /api', () => {
        it('should delete a word by vocabId', async () => {
            // Insert a vocab_card to delete
            const insertResult = await pool.query(
                'INSERT INTO vocab_cards (word, sentence, user_id) VALUES ($1, $2, $3) RETURNING *',
                ['todelete', 'To be deleted', testUser.user_id]
            );
            const card = insertResult.rows[0];

            const response = await request(app)
                .delete('/api')
                .send({ vocabId: card.vocab_id });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Word deleted');

            // Verify deletion in DB
            const dbResult = await pool.query(
                'SELECT * FROM vocab_cards WHERE vocab_id = $1',
                [card.vocab_id]
            );
            expect(dbResult.rows.length).toBe(0);
        });
    });
});
