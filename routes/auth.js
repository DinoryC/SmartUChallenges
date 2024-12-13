import express from 'express';
import bodyParser from "body-parser";
import pool from "./db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const router = express.Router();
const saltRounds = 12;

router.get('/user', async (req, res) => {

  console.log("get: /user   req = " + JSON.stringify(req, null, 2));
  console.log("get: /user   req.user = " + JSON.stringify(req.user, null, 2));
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/auth");
  }

  try {
    const { user_id: userId } = req.user.user_id;

    // Optionally, you can also ensure the requested user matches the logged-in user
    if (req.user && req.user.user_id !== parseInt(userId, 10)) {
      return res.status(403).send('Access Denied');
    }

    const result = await pool.query(
      'SELECT vocab_id, word, sentence, created_at FROM vocab_cards WHERE user_id = $1 ORDER BY created_at DESC;',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/literacyHome/vocabGardenApp/auth");
  });
});

router.post(
  "/auth/login",
  passport.authenticate('local', { failureRedirect: "/literacyHome/vocabGardenApp/auth" }),
  (req, res) => {
    console.log("auth.js router.post/ login/ ")
    res.redirect("/literacyHome/vocabGardenApp/user");
  }
);

router.post("/auth/register", async (req, res) => {
  const { email, userName, password } = req.body;

  try {
    // Check if user already exists
    const checkResult = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      // User already exists
      res.send("Email already exists. Try logging in.");
      return res.redirect("/literacyHome/vocabGardenApp/auth");
    } else {
      // Add new user to database
      const hash = await bcrypt.hash(password, saltRounds);
      console.log("hash = " + hash);

      // Insert into users table
      const insertUserResult = await pool.query(
        "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING user_id",
        [email, userName]
      );
      const newUserId = insertUserResult.rows[0].user_id;

      // Insert into auth_providers for local provider
      await pool.query(
        "INSERT INTO auth_providers (user_id, provider, password_hash) VALUES ($1, 'local', $2)",
        [newUserId, hash]
      );

      // Retrieve the newly created user
      const newUser = { user_id: newUserId, email, username };

      // Log in the user
      // req.login(newUser, (err) => {
      //   if (err) {
      //     console.error("Error logging in user:", err);
      //     return res.sendStatus(500);
      //   }
      //   console.log("User registered and logged in successfully");
      //   res.redirect("/literacyHome/vocabGardenApp/");
      // })
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async function (email, password, done) {
    try {
      const result = await pool.query(
        `SELECT a.password_hash, u.user_id
         FROM users u
         JOIN auth_providers a ON u.user_id = a.user_id
         WHERE u.email = $1 AND a.provider = 'local'`,
        [email]
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password_hash;
        const isValid = await bcrypt.compare(password, storedHashedPassword);

        if (isValid) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } else {
        return done(null, false, { message: 'User not found.' });
      }
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log("auth.js passport.serializeUser: user = ");
  console.log(JSON.stringify(user, null, 2));
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  console.log("auth.js passport.serializeUser: id = " + id);

  try {
    const result = await pool.query("SELECT user_id, email, username FROM users WHERE user_id = $1", [id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

export default router;