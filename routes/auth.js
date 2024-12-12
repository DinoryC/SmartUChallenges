import express from 'express';
import bodyParser from "body-parser";
import pool from "./db.js";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
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
      // secure: process.env.NODE_ENV === 'production', // Set to true in production
      // httpOnly: true, // Helps prevent XSS
      // sameSite: 'lax', // Adjust based on your frontend
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
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

router.get('/user/test', async (req, res) => {

  console.log("get: /user/test" + JSON.stringify(req, null, 2));

  if (!req.isAuthenticated()) {
    // return // not authorithed
  }

  try {
    // const { userId } = req.params;
    const userId = req.user_id;
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

router.get("/", (req, res) => {

  console.log("get: /" + JSON.stringify(req, null, 2));

  if (req.isAuthenticated()) {
    res.redirect("/literacyHome/vocabGardenApp/user/test");
  } else {
    res.redirect("/literacyHome/vocabGardenApp/auth");
  }
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/literacyHome/vocabGardenApp/auth");
  });
});

router.get("/current_user", (req, res) => {
  
  console.log("get: /current_user" + JSON.stringify(req, null, 2));

  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user_id: req.user.user_id,
    });
  } else {
    res.json({
      isAuthenticated: false,
      user_id: null,
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/literacyHome/vocabGardenApp/user/test",
    failureRedirect: "/literacyHome/vocabGardenApp/auth",
  })
);


router.post("/register", async (req, res) => {
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

passport.use(
  //Specify the fields (otherwise default username would be "username")
  { usernameField: 'email', passwordField: 'password' },
  new LocalStrategy(async function verify(email, password, done) {
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
          // return done(null, { user_id: user.user_id });
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } else {
        return done(null, false, { message: 'User not found.' });
      }
    } catch (err) {
      console.log(err);
      return done(err);
    }
  })
);

export default router;
