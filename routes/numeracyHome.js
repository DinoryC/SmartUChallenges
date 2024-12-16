import express from 'express';
import bodyParser from "body-parser";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('numeracy/numeracyHome.ejs');
});

router.get("/addition", (req, res) => {
    res.render('numeracy/TestRangeChosingPage.ejs', {challengeOptions: additionTestOptions});
});

router.get("/subtraction", (req, res) => {
    res.render('numeracy/TestRangeChosingPage.ejs', {challengeOptions: subtractionTestOptions});
});

router.get("/multiplication", (req, res) => {
    res.render('numeracy/TestRangeChosingPage.ejs', {challengeOptions: multiplicationTestOptions});
});

router.get("/division", (req, res) => {
    res.render('numeracy/TestRangeChosingPage.ejs', {challengeOptions: devisionTestOptions});
});

router.post("/submitTestRange", (req, res) => {
    var parameters = findParameters(req.body);

    res.render('numeracy/numerayTestPage.ejs', {testParameters: parameters});
})

export default router;

function findParameters(reqBody) {
    if (!reqBody.chosenTable || !reqBody.operatorInUse) {
        throw new Error('req.body does not include all necessary properties to generate test sheet');
    }

    switch (reqBody.operatorInUse) {
        case '+':
            var chosenTableIndex = additionTestOptions.findIndex((t) => t.displayName === reqBody.chosenTable);
            return additionTestOptions[chosenTableIndex];
        case '-':
            var chosenTableIndex = subtractionTestOptions.findIndex((t) => t.displayName === reqBody.chosenTable);
            return subtractionTestOptions[chosenTableIndex];
        case '×':
            var chosenTableIndex = multiplicationTestOptions.findIndex((t) => t.displayName === reqBody.chosenTable);
            return multiplicationTestOptions[chosenTableIndex];
        case '/':
            var chosenTableIndex = devisionTestOptions.findIndex((t) => t.displayName === reqBody.chosenTable);
            return devisionTestOptions[chosenTableIndex];
        default:
            throw new Error('Invalid operator passed in, unable to generate test sheet');
    }
}

function numeracyTestObjects(displayName, htmlId, element1RangeFrom, element1RangeTo, element2RangeFrom, element2RangeTo, operator, numberOfQuestions) {
    this.displayName = displayName;
    this.htmlId = htmlId;
    this.element1RangeFrom = element1RangeFrom;
    this.element1RangeTo = element1RangeTo,
    this.element2RangeFrom = element2RangeFrom,
    this.element2RangeTo = element2RangeTo;
    this.operator = operator;
    this.numberOfQuestions = numberOfQuestions;
}

const additionTestOptions = [
    new numeracyTestObjects("1 digit + 1 digit", "1d1d", 1, 9, 1, 9, "+", 9),
    new numeracyTestObjects("1 digit + 2 digits", "1d2d", 1, 9, 10, 99, "+", 9),
    new numeracyTestObjects("2 digits + 1 digit", "2d1d", 10, 99, 1, 9, "+", 9),
    new numeracyTestObjects("2 digits + 2 digits", "2d2d", 10, 99, 10, 99, "+", 9),
    new numeracyTestObjects("random 1 or 2 digits", "any1or2d", 1, 99, 1, 99, "+", 9),
];

const subtractionTestOptions = [
    new numeracyTestObjects("1 digit - 1 digit", "1d1d", 1, 9, 1, 9, "-", 9),
    new numeracyTestObjects("2 digits - 1 digit", "2d1d", 10, 99, 1, 9, "-", 9),
    new numeracyTestObjects("2 digits - 2 digits", "2d2d", 10, 99, 10, 99, "-", 9),
    new numeracyTestObjects("random 1 or 2 digits", "any1or2d", 1, 99, 1, 99, "-", 9),
];

const multiplicationTestOptions = [
    new numeracyTestObjects("2 Times Table", "2times", 2, 2, 1, 9, "×", 9),
    new numeracyTestObjects("3 Times Table", "3times", 3, 3, 1, 9, "×", 9),
    new numeracyTestObjects("4 Times Table", "4times", 4, 4, 1, 9, "×", 9),
    new numeracyTestObjects("5 Times Table", "5times", 5, 5, 1, 9, "×", 9),
    new numeracyTestObjects("6 Times Table", "6times", 6, 6, 1, 9, "×", 9),
    new numeracyTestObjects("7 Times Table", "7times", 7, 7, 1, 9, "×", 9),
    new numeracyTestObjects("8 Times Table", "8times", 8, 8, 1, 9, "×", 9),
    new numeracyTestObjects("9 Times Table", "9times", 9, 9, 1, 9, "×", 9),
    new numeracyTestObjects("Table 9 x 9", "99times", 2, 9, 1, 9, "×", 15),
    new numeracyTestObjects("Table 12 x 12", "1212times", 2, 12, 1, 12, "×", 15),
];

const devisionTestOptions = [
    new numeracyTestObjects("Division by 2", "d2", 2, 2, 1, 9, "/", 9),
    new numeracyTestObjects("Division by 3", "d3", 3, 3, 1, 9, "/", 9),
    new numeracyTestObjects("Division by 4", "d4", 4, 4, 1, 9, "/", 9),
    new numeracyTestObjects("Division by 5", "d5", 5, 5, 1, 9, "/", 9),
    new numeracyTestObjects("Division by 6", "d6", 6, 6, 1, 9, "/", 9),
    new numeracyTestObjects("Division by 7", "d7", 7, 7, 1, 9, "/", 9),
    new numeracyTestObjects("Division by 8", "d8", 8, 8, 1, 9, "/", 9),
    new numeracyTestObjects("Division by 9", "d9", 9, 9, 1, 9, "/", 9),
    new numeracyTestObjects("Division by random 2 ~ 9", "d29", 2, 9, 1, 9, "/", 12),
    new numeracyTestObjects("Division by random 1 ~ 12", "d112", 1, 12, 1, 12, "/", 12),
];