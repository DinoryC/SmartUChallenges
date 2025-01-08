import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';
import pool from '../db.js';
pool.query = jest.fn();
import authRouter from '../auth.js';

const saltRounds = 12;

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    req.login = (user, cb) => cb(null);
    next();
  });

  app.use('/', authRouter);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /register', () => {
  it('should successfully register a new user', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // No existing user
      .mockResolvedValueOnce({ rows: [{ user_id: 1, email: 'new@example.com', username: 'newuser' }] }) 
      .mockResolvedValueOnce({}); // Insert auth_providers

    const fakeHash = 'fakehashedpassword';
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(fakeHash);

    const response = await request(app)
      .post('/register')
      .send({ email: 'new@example.com', userName: 'newuser', password: 'password123' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(pool.query).toHaveBeenCalledTimes(3);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', saltRounds);
  });

  it('should deny registration if email already exists', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] }); // Existing user

    const response = await request(app)
      .post('/register')
      .send({ email: 'existing@example.com', userName: 'existinguser', password: 'password123' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.registerDeny).toBe("Email already exists. Try logging in.");
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
