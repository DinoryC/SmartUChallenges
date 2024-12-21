import express from 'express';
import pool from "./db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

const router = express.Router();
const saltRounds = 12;

router.get("/getUser", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("auth.js,  /getUser  hit   -- isAuthenticated = true! ")
    res.json({
      isAuthenticated: true,
      user: req.user
    });
  } else {
    console.log("auth.js,  /getUser  hit   -- isAuthenticated = false! ")
    res.json({
      isAuthenticated: false,
      user: null,
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/literacyHome/vocabGardenApp/auth");
  });
});

router.get("/google", 
  passport.authenticate("google", {
  scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/",
  passport.authenticate("google", { 
    successRedirect: "/literacyHome/vocabGardenApp/user",
    failureRedirect: "/literacyHome/vocabGardenApp/auth",
  })
);

router.post(
  "/login", 
  (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error("Authentication Error:", err);
      return res.json({ success: false, message: 'Internal Server Error' });
    }

    if (!user) {
      // Authentication failed
      return res.json({ success: false, message: info.message || 'Invalid email or password' });
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login Error:", err);
        return res.json({ success: false, message: 'Internal Server Error' });
      }

      // Successful authentication
      console.log("auth.js router.post   /login ");
      return res.json({ success: true });
    });
  })(req, res, next);
});

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
      return res.json({ registerDeny: "Email already exists. Try logging in." })
    } else {
      const hash = await bcrypt.hash(password, saltRounds);

      const newRegisteredUser = await pool.query(
        "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *",
        [email, userName]
      );

      const newUser = newRegisteredUser.rows[0]

      await pool.query(
        "INSERT INTO auth_providers (user_id, provider, password_hash) VALUES ($1, 'local', $2)",
        [newUser.user_id, hash]
      );

      req.login(newUser, (err) => {
        console.log(err);
        res.json({ success: true });
      });
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
          console.log("passport local check -- password is valid!");
          return done(null, user);
        } else {
          console.log("passport local check -- password is NOT valid!");
          return done(null, false, { message: 'Invalid email or password.' });
        }
      } else {
        console.log("passport local check -- User not found.");
        return done(null, false, { message: 'Invalid email or password.' });
      }
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }
));

passport.use("google", 
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://smartuchallenges.live/literacyHome/vb/auth/auth/google",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo", 
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1",
        [profile.email]
      )
      if (result.rows.length === 0) {
        const username = profile.email.split('@')[0];
        console.log("getting username = " + username);
        const newGoogleSignUpUser = await pool.query("INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *",
          [profile.email, username]
        )

        const newUser = newGoogleSignUpUser.rows[0]

        await pool.query(
          "INSERT INTO auth_providers (user_id, provider, password_hash) VALUES ($1, 'Google', $2)",
          [newUser.user_id, 'Google']
        );

        done(null, newUser);
      } else {
        // Already an existing user
        done(null, result.rows[0]);
      }
    } catch(err) {
      done(err);
    }
  }
))

passport.serializeUser((user, done) => {
  console.log("auth.js passport.serializeUser: user = ");
  console.log(JSON.stringify(user, null, 2));
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  console.log("auth.js passport.deserializeUser: id = " + id);

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