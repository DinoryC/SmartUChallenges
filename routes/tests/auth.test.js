// routes/tests/auth.test.js

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



// __tests__/auth.test.js
// import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
// import request from "supertest";
// import express from "express";
// import bodyParser from "body-parser";
// import bcrypt from "bcrypt";
// jest.mock('../db.js', () => {
//     return {
//       __esModule: true,        // This flag is required for ESM default exports
//       default: {
//         query: jest.fn()       // Create a Jest mock function for pool.query
//       }
//     };
//   });
// import authRouter from "../auth";  // adjust the path as needed
// import pool from "../db";          // adjust the path as needed

// // Mock the database pool
// jest.mock("../db.js");

// describe("Register API", () => {
//   let app;

//   beforeAll(() => {
//     // Initialize an Express app for testing
//     app = express();

//     // Use JSON body parsing middleware
//     app.use(bodyParser.json());

//     // Add a dummy req.login middleware to avoid Passport-related issues
//     app.use((req, res, next) => {
//       req.login = (user, callback) => callback(null);
//       next();
//     });

//     // Mount the auth router under the /auth path
//     app.use("/auth", authRouter);
//   });

//   beforeEach(() => {
//     // Clear mocks before each test
//     jest.clearAllMocks();
//   });

//   it("should register a new user successfully", async () => {
//     // Arrange: Set up the sequence of mocked DB responses
//     pool.query
//       // First query: Check if user exists returns no rows
//       .mockResolvedValueOnce({ rows: [] })
//       // Second query: Insert new user returns the new user record
//       .mockResolvedValueOnce({
//         rows: [{ user_id: 1, email: "test@example.com", username: "testuser" }]
//       })
//       // Third query: Insert auth provider; no need for specific return value
//       .mockResolvedValueOnce({});

//     // Act: Send a POST request to the register endpoint
//     const response = await request(app)
//       .post("/auth/register")
//       .send({
//         email: "test@example.com",
//         userName: "testuser",
//         password: "password123"
//       });

//     // Assert: Verify the response and that the DB queries were called correctly
//     expect(response.body).toEqual({ success: true });

//     expect(pool.query).toHaveBeenCalledWith(
//       "SELECT user_id FROM users WHERE email = $1",
//       ["test@example.com"]
//     );

//     expect(pool.query).toHaveBeenCalledWith(
//       "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *",
//       ["test@example.com", "testuser"]
//     );
//   });

//   it("should deny registration if email already exists", async () => {
//     // Arrange: Simulate existing user found
//     pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] });

//     // Act: Send a POST request with an existing email
//     const response = await request(app)
//       .post("/auth/register")
//       .send({
//         email: "existing@example.com",
//         userName: "testuser",
//         password: "password123"
//       });

//     // Assert: Verify the response indicates a registration denial
//     expect(response.body).toEqual({
//       registerDeny: "Email already exists. Try logging in."
//     });
//   });
// });


