import express from 'express';
import bodyParser from "body-parser";
import pool from "./db.js";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";

const router = express.Router();
const app = express();
const saltRounds = 12;

env.config();
app.use(bodyParser.urlencoded({ extended: true }));

const pgSession = connectPgSimple(session);

app.use(
  session({
    store: new pgSession({
      pool: pool, // Postgres pool
      tableName: 'session' // optional, defaults to 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false, // False to prevent unnecessary session resaves
    saveUninitialized: false, // only save session if something stored
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 4,  // valid for 4 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/literacyHome/vocabGardenApp/auth");
  });
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/literacyHome/vocabGardenApp/");
  } else {
    res.redirect("/literacyHome/vocabGardenApp/auth");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/literacyHome/vocabGardenApp/",
    failureRedirect: "/literacyHome/vocabGardenApp/auth",
  })
);

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

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
      // Hash the password and insert the user
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.sendStatus(500);
        } else {
          console.log("hash = " + hash);
          // Insert into users table
          const insertUserResult = await pool.query(
            "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING user_id",
            [email, username]
          );
          const newUserId = insertUserResult.rows[0].user_id;

          // Insert into auth_providers for local provider
          const result = await pool.query(
            "INSERT INTO auth_providers (user_id, provider, password_hash) VALUES ($1, 'local', $2) RETURNING auth_id",
            [newUserId, hash]
          );
          console.log(result);

          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/literacyHome/vocabGardenApp/");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  "/login",
  passport.authenticate("local", {
    successRedirect: "/literacyHome/vocabGardenApp/",
    failureRedirect: "/literacyHome/vocabGardenApp/auth",
  })
});

passport.use(
  new Strategy(async function verify(username, password, cb) {
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

        bcrypt.compare(loginPassword, storedHashedPassword, (err, match) => {
          if (err) {
            console.log("Log in password err " + err);
            return res.sendStatus(500);
          }

          if (match) {
            // Password is correct
            // Set the session user ID or use Passport's req.login
            req.session.user_id = user.user_id;
            // NEED LOGIC HERE: Rederict to <UserVocabs /> with user_id
            return cb(null, user);
          } else {
            console.log("Incorrect Password");
            return cb(null, false, { message: 'Incorrect password.' });
          }
        });
      } else {
        return cb(null, false, { message: 'User not found.' });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  })
);


export default router;