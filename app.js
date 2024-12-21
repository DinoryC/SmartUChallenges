import express from 'express';
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import pool from "./routes/db.js";
import env from "dotenv";

import homepageRoutes from './routes/homepage.js';
import numeracyHomeRoutes from './routes/numeracyHome.js';
import literacyHomeRoutes from './routes/literacyHome.js';
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js"

env.config();

const PORT = process.env.PORT || 10000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

const pgSession = connectPgSimple(session);

app.use(
  session({
    store: new pgSession({
      pool: pool, // Postgres pool
      tableName: 'session' 
    }),
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14,  // valid for 14 days
    },
    secure: process.env.NODE_ENV === 'production',
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', homepageRoutes);
app.use('/numeracyHome', numeracyHomeRoutes);
app.use('/literacyHome', literacyHomeRoutes);
app.use('/literacyHome/vb/auth', authRoutes);
app.use('/literacyHome/vb/user', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
