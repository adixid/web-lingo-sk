let myRound = 1;
let myScore = 0;

let myWord;
let myAttempts;
let counter;
let gameOver;

const myIds = [["js-11", "js-12", "js-13", "js-14"],
              ["js-21", "js-22", "js-23", "js-24"],
              ["js-31", "js-32", "js-33", "js-34"],
              ["js-41", "js-42", "js-43", "js-44"],
              ["js-51", "js-52", "js-53", "js-54"]];
const revealIds = ["js-61", "js-62", "js-63", "js-64"];

const borderMarkerColour = "red";
const correctPosition = 'green';
const wrongPosition = 'orange';


function newGame() {
 
  //myRound = JSON.parse(localStorage.getItem('round'));
  //myScore = JSON.parse(localStorage.getItem('hiscore'));
  
  myWord = [];
  myAttempts = 0;
  counter = 0;
  gameOver = false;

  findWord();
  showFirstLetter();
  
  // hide these in new round
  document.getElementById("result-information").style.visibility = 'hidden';
  document.getElementById("result").style.visibility = 'hidden';
  document.getElementById("footer").style.visibility = 'hidden';

  // play area boxes need to be reset as well
  for (let j=0; j<5; j++) {
    for (let i=0; i<4; i++) {
      document.getElementById(myIds[j][i]).style.backgroundColor = '#0D0D33';
      document.getElementById(myIds[j][i]).style.borderColor = "gray";
      document.getElementById(myIds[j][i]).innerHTML = "";
    }
  }
    
  document.getElementById("js-round").innerHTML = myRound;
  document.getElementById("js-score").innerHTML = myScore;
  
  showFirstLetter();
}

function findWord() { // computer finds his secret word
  let randomNumber = Math.floor(Math.random() * words.length);
  computerWord = words[randomNumber];
  computerWord2 = computerWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  console.log(computerWord);
  console.log(computerWord2);
}

function showFirstLetter() {
  document.getElementById(myIds[myAttempts][0]).innerHTML = computerWord[0];
  document.getElementById(myIds[myAttempts][0]).style.color = "darkgray";
  document.getElementById(myIds[myAttempts][0]).style.backgroundColor = correctPosition;
  document.getElementById(myIds[myAttempts][0]).style.borderColor = borderMarkerColour;
}

// type in letters and display them
document.addEventListener("keydown", myLetter);

function myLetter(event) {  
  if (gameOver === true) {
    if (event.code === "Space") {  // start a new round
    newGame();
    }
  }
  
  if (event.code === "Backspace") { // correct already entered letters
    if (counter > 0) {
      counter -= 1;
      
      if (myWord[counter] === computerWord[counter]) {
        document.getElementById(myIds[myAttempts][counter+1]).style.borderColor = "gray";
        document.getElementById(myIds[myAttempts][counter]).innerHTML = computerWord[counter];
        document.getElementById(myIds[myAttempts][counter]).style.color = "darkgray";
        document.getElementById(myIds[myAttempts][counter]).style.borderColor = borderMarkerColour;
        myWord.pop();
      } 
      else {
        document.getElementById(myIds[myAttempts][counter]).textContent = "";
        document.getElementById(myIds[myAttempts][counter+1]).style.borderColor = "gray";
        document.getElementById(myIds[myAttempts][counter]).style.borderColor = borderMarkerColour;
        myWord.pop();
      }
    }
  }
  // only accept letters
  if ((/^[a-zA-Z]$/.test(event.key)) && (gameOver === false)) {
    if ((counter < 4) && (myAttempts < 5))  {
    let newLetter = document.getElementById(myIds[myAttempts][counter]); // where are we adding letter
    newLetter.textContent = event.key;  // letter pressed
    document.getElementById(myIds[myAttempts][counter]).style.color = "white"; // font colour
    document.getElementById(myIds[myAttempts][counter]).style.borderColor = "gray";
    if (counter < 3) {
      document.getElementById(myIds[myAttempts][counter+1]).style.borderColor = borderMarkerColour;
    }
    myWord.push(event.key);  // add letter to myword
    counter += 1;
    if (counter === 4) {
      roundEvaluate();
    }
    }
  }
}

function roundEvaluate() {
  // first check if we won the game
  if (myWord.join("") === computerWord2) { 
      document.getElementById("result").style.visibility = 'visible';
      for (let i=0; i<4; i++) {
        document.getElementById(revealIds[i]).innerHTML = computerWord[i];
        document.getElementById(myIds[myAttempts][i]).style.backgroundColor = correctPosition;
      }
      document.getElementById("result-information").style.visibility = 'visible';
      document.getElementById("result-information").style.backgroundColor = 'green';
      document.getElementById("result-information").style.color = 'white';
      document.getElementById('result-information').innerHTML = 'Gratulujem, vyhrali ste!';
      document.getElementById("footer").style.visibility = 'visible';
      resultInfo();
    
      myScore += 1;
      document.getElementById("js-score").innerHTML = myScore;
      //localStorage.setItem('hiscore', JSON.stringify(myScore)); // browser remembers the new score

      myRound += 1;
      //localStorage.setItem('round', JSON.stringify(myRound));
      gameOver = true;
      
      // otherwise check all matching letters and mark them
    } else {
        for (let i=0; i<4; i++) {
          if (myWord[i] ===  computerWord2[i]) {
            document.getElementById(myIds[myAttempts][i]).style.backgroundColor = correctPosition;
            if (myAttempts < 4) {
              document.getElementById(myIds[myAttempts+1][i]).style.backgroundColor = correctPosition;
              document.getElementById(myIds[myAttempts+1][i]).innerHTML = computerWord[i];
              document.getElementById(myIds[myAttempts+1][i]).style.color = "darkgray";
            }
          } else if (computerWord2.includes(myWord[i])) {  // mark correct letter in wrong position
              document.getElementById(myIds[myAttempts][i]).style.backgroundColor = wrongPosition;
              } else if (!computerWord.includes(myWord[i])) {
                  document.getElementById(myIds[myAttempts][i]).style.backgroundColor = '#0D0D33';
                }
          }

          if (myAttempts >= 4) { // reveal correct word
            document.getElementById("result").style.visibility = 'visible';
            for (let i=0; i<4; i++) {
              document.getElementById(revealIds[i]).innerHTML = computerWord[i];
            }
            document.getElementById("result-information").style.visibility = 'visible';
            document.getElementById("result-information").style.backgroundColor = 'red';
            document.getElementById("result-information").style.color = 'white';
            document.getElementById('result-information').innerHTML = 'Nepodarilo sa Vám nájsť hľadané slovo. Skúste to znova.';

            resultInfo();
            myRound += 1;
            //localStorage.setItem('round', JSON.stringify(myRound));

            gameOver = true;
          }
      }

  // reset counters for next attempt
  myWord = [];
  myAttempts++;
  counter = 0;
}

function resultInfo() {
  document.getElementById("footer").style.visibility = 'visible';
  document.getElementById("result-information").style.visibility = 'visible';
}

newGame();