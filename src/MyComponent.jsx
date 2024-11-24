import React from "react";

var greatingText;
var greetingStyle = { color:"Purple"};

getGreetingByTime();
getGreetingStyleByTime();


const MyComponent = () => (
  <div>
     <h1>My Favourite Foods</h1>
     <p>Your lucky number is {Math.floor(Math.random() * 10)}</p>
     <p style = {greetingStyle}> {greatingText} </p>
   </div>
);

function getGreetingByTime() {
  var timeNow = new Date();
  if (timeNow.getHours() >= 19) {
    greatingText =  "Good Noght!"
  } else if (timeNow.getHours() >= 12) {
    greatingText = "Good Afternoon!"
  } else {
    greatingText = "Good Morning!"
  }
}

function getGreetingStyleByTime() {
  if (greatingText === "Good Noght!") {
    greetingStyle.color = "orange"
  } else if (greatingText === "Good Afternoon!") {
    greetingStyle.color = "green"
  } else {
    greetingStyle.color = "red"
  } 
}

export default MyComponent;