import express from 'express';
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';

import homepageRoutes from './routes/homepage.js';
import numeracyHomeRoutes from './routes/numeracyHome.js';
import literacyHomeRoutes from './routes/literacyHome.js';
import apiRoutes from "./routes/api.js";
import authRoutes from "./routes/auth.js";

const PORT = process.env.PORT || 10000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use('/', homepageRoutes);
app.use('/numeracyHome', numeracyHomeRoutes);
app.use('/literacyHome', literacyHomeRoutes);
app.use('/literacyHome/vocabGardenApp', apiRoutes);
app.use('/literacyHome/vocabGardenApp/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
