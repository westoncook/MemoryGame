const gameContainer = document.getElementById("game");
const btn = document.querySelector('button');
const turnCounter = document.querySelector('#turn');
const message = document.querySelector('h2');
const hScore = document.querySelector('#high-score');

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "black",
  "yellow",
  "grey",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "black",
  "yellow",
  "grey"
];

let first;
let second;
let firstId;
let secondId;
let turn = 0;
let timer;
let highScore;

if(localStorage.highScore){
  highScore = parseInt(localStorage.highScore);
  document.querySelector('#high-score').innerText = highScore;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}



// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let i = 0; i < colorArray.length; i++) {
    let id = 0
    const newDiv = document.createElement("div");
    newDiv.classList.add(colorArray[i]);
    newDiv.id = i;
    newDiv.style.backgroundColor = 'rgb(56,237,183)'
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}


function handleCardClick(e) {
  if(matchClick(e) || timer){
    return
  }
  
  click = clicked(e)
  if(!first){
    first = click.card;
    firstId = click.id
  } else {
    second = click.card;
    secondId = click.id
    if(firstId === secondId){
      return
    }
    let won = compare();
    
    if(won){
      winMessage();
    }
    }
}


function clicked(e){
  let card = e.target;
  card.style.backgroundColor = card.className;
  return {
    'card': card.className,
    'id': card.id
  }
}


function compare(){
  let cards = gameContainer.querySelectorAll("div")
  if (first !== second){
    timer = true;
    writeMessage('No Match', true);
    setTimeout(()=>{
      flipCard(first);
      flipCard(second);
      housekeeping();
    }, 1000)
  }
  else if (first === second){
    for(let card of cards){
      if(card.className === second){
        card.className = 'match';
        // card.removeEventListener("click", handleCardClick)
      }
    } 
    writeMessage("Match", true)
    housekeeping();
    return winCheck();
  }
}


function flipCard(color){
  let cards = gameContainer.querySelectorAll("div")
  for (let card of cards){
    if(card.className === color){
      card.style.backgroundColor = 'rgb(56,237,183)';
    }
  }
}


function housekeeping(){
  turn += 1
  turnCounter.innerText = turn;
  clearCards()
  timer = false;
}


function clearCards(){
  first = ""
  second = ""
  firstId = ""
  secondId = ""
}


function matchClick(e){
  if (e.target.className === 'match'){
    return true;
  }
  else{
    return false;
  }
}


function winCheck(){
  let cards = gameContainer.querySelectorAll("div");
  for (let card  of cards){
    if(card.className !== 'match'){
      return false;
    }
  } 
  return true;
}


function writeMessage(text, timeout){
  message.innerText = text;
  message.style.color = 'black';
  if (timeout){
    setTimeout(()=>{
      message.style.color = 'lightcoral';
    }, 1000)
  }
}


function winMessage(){
  let high = highScoreCheck()
  if (high){
    message.innerText = `New High Score! ${turn} Turns!`;
    message.style.color = 'black';
    hScore.innerText = turn;
  } else {
    message.innerText = `You Won in ${turn} Turns`;
    message.style.color = 'black';
  }
}


function highScoreCheck(){
  if(!highScore){
    localStorage.setItem('highScore', turn)
    return true
  } else if (turn < highScore) {
    localStorage.setItem('highScore', turn)
    return true
  }
}


function newGame(){
  let cards = document.querySelectorAll('div > div');
  for (let card of cards){
    card.remove();
  }
  turn = 0;
  turnCounter.innerText = turn;
  first = "";
  second = "";
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}

btn.addEventListener('click', newGame)

