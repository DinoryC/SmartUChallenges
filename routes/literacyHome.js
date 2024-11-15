import express from 'express';
import axios from "axios";
import bodyParser from "body-parser";

const router = express.Router();
const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('literacy/literacyHome.ejs');
});

// router.get("/JokeReading", (req, res) => {
//     res.render('literacy/literacyJokeReading.ejs');
// });

router.get("/JokeReading", async (req, res) => {
    try {
      const response = await axios.get(API_URL + "/Any?type=single");
      console.log("Enter 1");
      console.log(response.data);
      res.render('literacy/literacyJokeReading.ejs', { jokeData: response.data });
    } catch (error) {
      res.render('literacy/literacyJokeReading.ejs', { jokeData: error.response, jokeCategory: "error" });
    }
  });

router.post("/getCustomJoke", async (req, res) => {
  if (!hasAnyCustomisedFilters(req.body)) {
    res.redirect('literacy/literacyJokeReading.ejs');
  } else {
    try {
      const response = await axios.get(API_URL + customURLGenerator(req.body));
      console.log(response.data);
      res.render('literacy/literacyJokeReading.ejs', { jokeData: response.data });
    } catch (error) {
      res.render('literacy/literacyJokeReading.ejs', { jokeData: error.response, jokeCategory: "error" });
    }
  }
});




router.get("/AddNewWord", (req, res) => {
    res.render('literacy/literacyAddNewWord.ejs');
});

function hasAnyCustomisedFilters(reqBodyContent) {
    if (
      Object.hasOwn(reqBodyContent, 'categories') === false &&
      Object.hasOwn(reqBodyContent, 'blacklist') === false &&
      reqBodyContent.idRangeFrom == 0 &&
      reqBodyContent.idRangeTo == 1367 
    ) {
      return false;
    } else {
      return true;
    }
  }
  
  function customURLGenerator(chosenFilters) {
    let catgoriesPart = "";
    let blacklistFlagsPart = "";
    let idRange = "";
  
    if (Object.hasOwn(chosenFilters, 'categories')){
      let categories = combineStrings(chosenFilters.categories);
      catgoriesPart = categories + "?";
    } else {
      catgoriesPart = "Any?";
    };
  
    if (Object.hasOwn(chosenFilters, 'blacklist')){
      let blackList = combineStrings(chosenFilters.blacklist);
      blacklistFlagsPart = "blacklistFlags=" + blackList + "&";
    }
  
    if (chosenFilters.idRangeFrom != 0 || chosenFilters.idRangeTo != 1367) {
      idRange = "&idRange=" + chosenFilters.idRangeFrom + "-" +  chosenFilters.idRangeTo;
    }
  
    let endPoint = "/" + catgoriesPart + blacklistFlagsPart + "type=single" + idRange;
    console.log(API_URL + endPoint);
  
    return endPoint;
  }
  
  function combineStrings(input) {
    if (Array.isArray(input)) {
      return input.join(',');
    } else if (typeof input === 'string') {
      return input;
    } else {
      throw new Error("Input must be a string or an array of strings");
    }
  }

export default router;