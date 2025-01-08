import { jest, describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';
import passport from 'passport';
import pool from '../db.js';
import authRouter from '../auth.js';

const saltRounds = 12;
let app;

beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock req.login for Passport simulation
    app.use((req, res, next) => {
        req.login = (user, cb) => cb(null);
        next();
    });

    app.use('/', authRouter);
});

beforeEach(async () => {
    // Clear tables to ensure a clean state for each test
    await pool.query('DELETE FROM auth_providers');
    await pool.query('DELETE FROM users');

    jest.clearAllMocks();
});

afterEach(() => {
    jest.restoreAllMocks();
})

afterAll(async () => {
    // Close the database pool after all tests complete
    await pool.end();
});

describe('POST /register', () => {
    it('should successfully register a new user', async () => {
        // Spy on bcrypt.hash to control its output for predictable testing
        const fakeHash = 'fakehashedpassword';
        jest.spyOn(bcrypt, 'hash').mockResolvedValue(fakeHash);

        const response = await request(app)
            .post('/register')
            .send({ email: 'new@example.com', userName: 'newuser', password: 'password123' })
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });

        // Verify user creation in the database
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', ['new@example.com']);
        expect(checkUser.rows.length).toBe(1);
        const user = checkUser.rows[0];
        expect(user.username).toBe('newuser');

        // Verify auth_providers entry with the hashed password
        const checkProvider = await pool.query('SELECT * FROM auth_providers WHERE user_id = $1', [user.user_id]);
        expect(checkProvider.rows.length).toBe(1);
        expect(checkProvider.rows[0].password_hash).toBe(fakeHash);

        expect(bcrypt.hash).toHaveBeenCalledWith('password123', saltRounds);
    });

    it('should deny registration if email already exists', async () => {
        // Setup: Insert a user with existing email into the test database
        const fakeHash = 'fakehash';
        jest.spyOn(bcrypt, 'hash').mockResolvedValue(fakeHash);

        const newUser = await pool.query(
            'INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *',
            ['existing@example.com', 'existinguser']
        );
        await pool.query(
            'INSERT INTO auth_providers (user_id, provider, password_hash) VALUES ($1, $2, $3)',
            [newUser.rows[0].user_id, 'local', fakeHash]
        );

        const response = await request(app)
            .post('/register')
            .send({ email: 'existing@example.com', userName: 'existinguser', password: 'password123' })
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.registerDeny).toBe("Email already exists. Try logging in.");
    });
});

describe('Passport LocalStrategy', () => {
    it('should authenticate valid credentials', (done) => {
        const email = 'localtest@example.com';
        const password = 'password123';
        const username = 'localtestuser';

        // Insert user into DB with hashed password
        bcrypt.hash(password, saltRounds).then(hashed => {
            pool.query(
                "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *",
                [email, username]
            )
                .then(result => {
                    const newUser = result.rows[0];
                    return pool.query(
                        "INSERT INTO auth_providers (user_id, provider, password_hash) VALUES ($1, 'local', $2)",
                        [newUser.user_id, hashed]
                    ).then(() => newUser);
                })
                .then(newUser => {
                    const localStrategy = passport._strategy('local');
                    localStrategy._verify(email, password, (err, user, info) => {
                        try {
                            expect(err).toBeNull();
                            expect(user).toBeDefined();
                            expect(user.user_id).toBe(newUser.user_id);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                })
                .catch(done);
        });
    });

    it('should fail authentication with invalid password', (done) => {
        const email = 'localtest2@example.com';
        const password = 'password123';
        const wrongPassword = 'wrongpass';
        const username = 'localtestuser2';

        bcrypt.hash(password, saltRounds).then(hashed => {
            pool.query(
                "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *",
                [email, username]
            )
                .then(result => {
                    const newUser = result.rows[0];
                    return pool.query(
                        "INSERT INTO auth_providers (user_id, provider, password_hash) VALUES ($1, 'local', $2)",
                        [newUser.user_id, hashed]
                    );
                })
                .then(() => {
                    const localStrategy = passport._strategy('local');
                    localStrategy._verify(email, wrongPassword, (err, user, info) => {
                        try {
                            expect(err).toBeNull();
                            expect(user).toBe(false);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                })
                .catch(done);
        });
    });
});


describe('Passport deserializeUser', () => {
    it('should return user if exists', (done) => {
        const email = 'deserialize@example.com';
        const username = 'deserializeuser';

        // Insert user into DB
        pool.query(
            'INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *',
            [email, username]
        )
            .then(result => {
                const user = result.rows[0];

                passport.deserializeUser(user.user_id, (err, deserializedUser) => {
                    try {
                        expect(err).toBeNull();
                        expect(deserializedUser).toBeDefined();
                        expect(deserializedUser.email).toBe(email);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            })
            .catch(done);
    });

    it('should return false if user does not exist', (done) => {
        passport.deserializeUser(9999, (err, deserializedUser) => {
            try {
                expect(err).toBeNull();
                expect(deserializedUser).toBe(false);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});


describe('Passport GoogleStrategy', () => {
    it('should create a new user if one does not exist', (done) => {
        const googleStrategy = passport._strategy('google');
        const fakeProfile = { email: 'googleuser@example.com' };

        googleStrategy._verify('accessToken', 'refreshToken', fakeProfile, (err, user) => {
            try {
                expect(err).toBeNull();
                expect(user).toBeDefined();

                // Verify new user was inserted in DB
                pool.query('SELECT * FROM users WHERE email = $1', [fakeProfile.email])
                    .then(result => {
                        expect(result.rows.length).toBe(1);
                        expect(result.rows[0].email).toBe(fakeProfile.email);
                        done();
                    })
                    .catch(done);
            } catch (e) {
                done(e);
            }
        });
    });

    it('should return existing user if user already exists', (done) => {
        const email = 'existinggoogle@example.com';
        const username = 'existinggoogle';

        // Insert user into DB
        pool.query(
            "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *",
            [email, username]
        )
            .then(result => {
                const existingUser = result.rows[0];
                const googleStrategy = passport._strategy('google');
                const fakeProfile = { email };

                googleStrategy._verify('accessToken', 'refreshToken', fakeProfile, (err, user) => {
                    try {
                        expect(err).toBeNull();
                        expect(user).toBeDefined();
                        expect(user.user_id).toBe(existingUser.user_id);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            })
            .catch(done);
    });
});