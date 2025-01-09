var element1RangeFrom;
var element1RangeTo;
var element2RangeFrom;
var element2RangeTo;
var questionOperator;
var totalQuestionsCount;

var currentQuestion;
var question1stNum;
var question2ndNum;

var allQuestions = [];
var allAnswers = [];
var currentQuestion;
var passedQuestions;
var passedQuestionsHtml = "";

var currentUserInputAnswer = "";
var intervalInputUpdater;

pageLoadingPreparation();
startTest();

function pageLoadingPreparation() {
    getParameters();
    prepareAllQuestions();
    PrepareAllAnswers();
    currentQuestion = -1;
    $('#passedQuestions').html(passedQuestionsHtml);

    $('#showAnswerBtn').on('mousedown touchstart', function(event) {
        event.preventDefault();
        $(this).text("Answer is: " + allAnswers[currentQuestion]);
    });

    $('#showAnswerBtn').on('mouseup touchend touchcancel', function(event) {
        event.preventDefault();
        $(this).text("Show Answer");
    });
}

function startTest() {
    nextQuestion();
    addKeyboardEventListener();
    inputValueUpdater(150);
}

function addKeyboardEventListener() {
    document.addEventListener('keydown', function(event) {
        if (event.key >= "0" && event.key <= "9" || event.key === "Backspace" || event.key === "-") {
            inputHandler(event.key);
        } else {
            event.preventDefault();
        }
    });
}

function inputHandler(input) {
    if (input === "Backspace") {
        currentUserInputAnswer = currentUserInputAnswer.slice(0, -1);
        $('#userInputValue').val(currentUserInputAnswer);
    } else {
        currentUserInputAnswer += input;
        if (currentUserInputAnswer.length === allAnswers[currentQuestion].toString().length) {
            if(!checkAnswer()) {
                WrongAnswer();
            } else {
                CorrectAnswer();
                if (currentQuestion === totalQuestionsCount - 1) {
                    ChallengeSuccess();
                    return;
                }
                nextQuestion();
            }
        }
    }
}

function getParameters() {
    element1RangeFrom = parseInt($("#para_element1RangeFrom").text());
    element1RangeTo = parseInt($("#para_element1RangeTo").text());
    element2RangeFrom = parseInt($("#para_element2RangeFrom").text());
    element2RangeTo = parseInt($("#para_element2RangeTo").text());
    questionOperator = $("#para_operator").text().trim();
    totalQuestionsCount = parseInt($("#para_numberOfQuestions").text());
}

function consoleLogParamenter() {
    console.log("element1RangeFrom = " + element1RangeFrom);
    console.log("element1RangeTo = " + element1RangeTo);
    console.log("element2RangeFrom = " + element2RangeFrom);
    console.log("element2RangeTo = " + element2RangeTo);
    console.log("operator = " + questionOperator);
    console.log("numberOfQuestions = " + totalQuestionsCount);
}

function prepareAllQuestions() {
    switch (questionOperator) {
        case '+':
            prepareAsAdditionChallenges();
            break;
        case '-':
            prepareAsSubtractionChallenges();
            break;
        case '×':
            prepareAsMultiplicationChallenges();
            break;
        case '/':
            prepareAsDivisionChallenges();
            break;
        default:
            throw new Error('Invalid operator for test sheet generator');
    }
}

function PrepareAllAnswers() {
    for (var i = 0; i < allQuestions.length; i++) {
        allAnswers.push(calculate(allQuestions[i][0], allQuestions[i][1], questionOperator));
    }
}

// Addend + Addend = Sum or Total
function prepareAsAdditionChallenges() {
    generateRandomTestSheetQuestions(element1RangeFrom, element1RangeTo, element2RangeFrom, element2RangeTo);
}

// Minuend - Subtrahend = Difference
function prepareAsSubtractionChallenges() {
    var subtractionPossibleCombinationCount = generatePossibleCombinationCountForPositiveAnsForSubtractionQs();

    if (subtractionPossibleCombinationCount >= totalQuestionsCount) {
        while (allQuestions.length < totalQuestionsCount) {
            var subtrahend = getRandomInt(element2RangeFrom, element2RangeTo);
            var minuend = getRandomInt(subtrahend, element1RangeTo)
    
            if (!isExistingPair(allQuestions, [minuend, subtrahend])) {
                allQuestions.push([minuend, subtrahend]);
            }
        }
    } else {
        while (allQuestions.length < subtractionPossibleCombinationCount) {
            var i = getRandomNumInc(firstNumfrom, firstNumTo);
            var j = getRandomNumInc(SecondNumFrom, SecondNumTo);
    
            if (!isExistingPair(allQuestions, [i, j])) {
                allQuestions.push([i, j]);
            }
        }

        while (allQuestions.length < totalQuestionsCount) {
            allQuestions.push(allQuestions[getRandomNumInc(0, subtractionPossibleCombinationCount -1)]);
        }
    }
}

function generatePossibleCombinationCountForPositiveAnsForSubtractionQs(){
    var possibleCount = 0;
    for (var subtrahend = element2RangeFrom; subtrahend < element2RangeTo + 1; subtrahend++) {
        possibleCount += (element1RangeTo - subtrahend + 1);
    }

    return possibleCount;
}

// Multiplicand * Multiplier = Product
function prepareAsMultiplicationChallenges() {
    if (element1RangeFrom === element1RangeTo) {
        generateATimesTableWithAHeroNum(element1RangeFrom, element2RangeFrom, element2RangeTo);
    } else {
        generateRandomTestSheetQuestions(element1RangeFrom, element1RangeTo, element2RangeFrom, element2RangeTo);
    }
}

// Divident / Divisor = Quotient...Remainder
function prepareAsDivisionChallenges() {
    if (element1RangeFrom === element1RangeTo) {
        var randomNumArray = generateANonRepeatedRandomNumArray(element2RangeFrom, element2RangeTo);
        for (var i = 0; i < randomNumArray.length; i++) {
            allQuestions.push([randomNumArray[i] * element1RangeFrom, element1RangeFrom]);
        }
    } else {
        generateRandomTestSheetQuestions(element1RangeFrom, element1RangeTo, element2RangeFrom, element2RangeTo);
        for (var i = 0; i < allQuestions.length; i++) {
            allQuestions[i][0] = allQuestions[i][0] * allQuestions[i][1];
        }
    }
}

function generateANonRepeatedRandomNumArray(fromNumInc, toNumInc) {
    arrayToShuffle = [];
    for (var i = fromNumInc; i < toNumInc + 1; i++) {
        arrayToShuffle.push(i);
    }

    for (let i = arrayToShuffle.length - 1; i > 0; i--) {
        // Generate a random index
        let j = Math.floor(Math.random() * (i + 1));
        // Swap elements at i and j
        [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
    }

    return arrayToShuffle;
}

function generateATimesTableWithAHeroNum(firstNumfrom, SecondNumFrom, SecondNumTo) {
    var randomNumArray = generateANonRepeatedRandomNumArray(SecondNumFrom, SecondNumTo);
    for (var i = 0; i < randomNumArray.length; i++) {
        allQuestions.push([firstNumfrom, randomNumArray[i]]);
    }
}

function generateRandomTestSheetQuestions(firstNumfrom, firstNumTo, SecondNumFrom, SecondNumTo) {
    var possibleCombinationCount = getPossibleCombinationCount(firstNumfrom, firstNumTo, SecondNumFrom, SecondNumTo);
    
    if (possibleCombinationCount >= totalQuestionsCount) {
        while (allQuestions.length < totalQuestionsCount) {
            var i = getRandomNumInc(firstNumfrom, firstNumTo);
            var j = getRandomNumInc(SecondNumFrom, SecondNumTo);
    
            if (!isExistingPair(allQuestions, [i, j])) {
                allQuestions.push([i, j]);
            }
        }
    } else {
        while (allQuestions.length < possibleCombinationCount) {
            var i = getRandomNumInc(firstNumfrom, firstNumTo);
            var j = getRandomNumInc(SecondNumFrom, SecondNumTo);
    
            if (!isExistingPair(allQuestions, [i, j])) {
                allQuestions.push([i, j]);
            }
        }

        while (allQuestions.length < totalQuestionsCount) {
            allQuestions.push(allQuestions[getRandomNumInc(0, possibleCombinationCount -1)]);
        }
    }
}

function getPossibleCombinationCount(multiplicantFromInc, multiplicantToInc, multiplierFromInc, multiplierToInc) {
    return ((multiplicantToInc - multiplicantFromInc + 1) * (multiplierToInc - multiplierFromInc + 1));
}

function getRandomNumInc(fromInc, toInc) {
    return fromInc + (Math.floor(Math.random() * (toInc - fromInc + 1)));
}

function isExistingPair(arr, pair) {
    return arr.some(subArr => subArr[0] === pair[0] && subArr[1] === pair[1]);
}

function nextQuestion() {
    currentQuestion++;
    question1stNum = allQuestions[currentQuestion][0];
    question2ndNum = allQuestions[currentQuestion][1];

    var displayOperator = (questionOperator === "/") ? "÷" : questionOperator;

    $("#currentQuestion").text(question1stNum + " " + displayOperator + " " + question2ndNum + " = ?");
    $("#passedQuestions").text(passedQuestions);
    $("#currentQuetionNum").text("Question " + (currentQuestion + 1).toString() + ":");
    $("#QuetionsToGo").text(totalQuestionsCount - currentQuestion + " more to go.");

    currentUserInputAnswer = "";
    $('#userInputValue').val(currentUserInputAnswer);
}

function calculate(a, b, operator) {
    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '×':
            return a * b;
        case '/':
            return a / b;
        default:
            throw new Error('Invalid operator');
    }
}

function getRandomInt(fromInc, toInc) {
    if (toInc === fromInc) {
        return fromInc;
    }

    var ramNum = Math.floor(Math.random() * (toInc - fromInc + 1)) + fromInc;
    return ramNum;
  }

function checkAnswer() {
    return currentUserInputAnswer === allAnswers[currentQuestion].toString();
}

function WrongAnswer () {
    wrongAnswerFx();
    currentUserInputAnswer = "";
    $('#userInputValue').val(currentUserInputAnswer);
}

function CorrectAnswer() {
    correctAnswerEffect();
    var displayOperator = (questionOperator === "/") ? "÷" : questionOperator;

    passedQuestionsHtml += 
    allQuestions[currentQuestion][0] + " " 
    + displayOperator + " " 
    + allQuestions[currentQuestion][1] + " = " 
    + allAnswers[currentQuestion] 
    + " " + '<svg height="20px" viewBox="0 0 117 117" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <desc></desc> <defs></defs> <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"> <g fill-rule="nonzero" id="correct"> <path d="M34.5,55.1 C32.9,53.5 30.3,53.5 28.7,55.1 C27.1,56.7 27.1,59.3 28.7,60.9 L47.6,79.8 C48.4,80.6 49.4,81 50.5,81 C50.6,81 50.6,81 50.7,81 C51.8,80.9 52.9,80.4 53.7,79.5 L101,22.8 C102.4,21.1 102.2,18.5 100.5,17 C98.8,15.6 96.2,15.8 94.7,17.5 L50.2,70.8 L34.5,55.1 Z" fill="#17AB13" id="Shape"></path> <path d="M89.1,9.3 C66.1,-5.1 36.6,-1.7 17.4,17.5 C-5.2,40.1 -5.2,77 17.4,99.6 C28.7,110.9 43.6,116.6 58.4,116.6 C73.2,116.6 88.1,110.9 99.4,99.6 C118.7,80.3 122,50.7 107.5,27.7 C106.3,25.8 103.8,25.2 101.9,26.4 C100,27.6 99.4,30.1 100.6,32 C113.1,51.8 110.2,77.2 93.6,93.8 C74.2,113.2 42.5,113.2 23.1,93.8 C3.7,74.4 3.7,42.7 23.1,23.3 C39.7,6.8 65,3.9 84.8,16.2 C86.7,17.4 89.2,16.8 90.4,14.9 C91.6,13 91,10.5 89.1,9.3 Z" fill="#4A4A4A" id="Shape"></path> </g> </g> </g></svg>'
    + "<br>";
    $('#passedQuestions').html(passedQuestionsHtml);

    currentUserInputAnswer = "";
    $('#userInputValue').val(currentUserInputAnswer);
}

function ChallengeSuccess() {
    challengeSuccessFx();
    $('#currentQuestion').text("Challenge Success! Congratulations!");
    $("#QuetionsToGo").text("All done! Great Job!");
    setTimeout(stopInputValueUpdater, 200);

    $('#showAnswerBtn').text("Try again");
    $('#showAnswerBtn').off('mousedown');
    $('#showAnswerBtn').off('mouseup');
    $('#showAnswerBtn').on('click', function() {
        location.reload();
    });
    $("#userInputValue").hide();
}

function inputValueUpdater(updateInterval) {
    intervalInputUpdater = setInterval(function() {
      $('#userInputValue').val(currentUserInputAnswer);
    }, updateInterval);
}

function stopInputValueUpdater() {
    clearInterval(intervalInputUpdater);
}

function correctAnswerEffect() {
    triggerConfetti(700, 50);

    // potential add sound effect?
}

function wrongAnswerFx() {
    triggerShake();
}

function challengeSuccessFx() {
    triggerConfetti(5000, 150);
    
}

function triggerConfetti(effectDuration, particalCount) {
    var animationEnd = Date.now() + effectDuration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = particalCount * (timeLeft / effectDuration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function triggerShake() {
    $('#testSheetCard').addClass('shake');
    
    setTimeout(() => {
        $('#testSheetCard').removeClass('shake');
    }, 600);
  }