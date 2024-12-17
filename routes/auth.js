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
  passport.authenticate('local', { failureRedirect: "/literacyHome/vocabGardenApp/auth" }),
  async (req, res) => {
    console.log("auth.js router.post   /login ");
    res.json({ success: true });
  }
);

router.post("/register", async (req, res) => {
  console.log("auth.js router.post   /register ");
  console.log("auth.js router.post   /register   req.body = " + JSON.stringify(req.body, null, 2));
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
      const newRegisteredUser = await pool.query(
        "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *",
        [email, userName]
      );

      const newUser = newRegisteredUser.rows[0]

      // Insert into auth_providers for local provider
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
    console.log("auth.js passport.use try valify... ");
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
          return done(null, false, { message: 'Incorrect password.' });
        }
      } else {
        console.log("passport local check -- User not found.");
        return done(null, false, { message: 'User not found.' });
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
    callbackURL: "http://localhost:10000/literacyHome/vb/auth/auth/google",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo", 
  }, async (accessToken, refreshToken, profile, done) => {
    console.log("google passport profile: ");
    console.log("google passport profile: " + JSON.stringify(profile, null, 2));

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