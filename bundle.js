(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function createTable(side){
  var tbody = document.getElementById("matrix");
  tbody.innerHTML = '';
  for (var row = 0; row < side; row++){
    var tr = document.createElement("tr");
    for (var col = 0; col < side; col++){
      tr.innerHTML += `<td id='x${row}x${col}'>
                        <div class='dot'></div>
                      </td>`
    }
    tbody.appendChild(tr);
    fadeInDots();
    // then remove animation class from dots
    setTimeout(function() {
      var dots = document.querySelectorAll('.dot');
      for(let i = 0; i < dots.length; i++) {
        dots[i].style.opacity = '1';
        dots[i].classList.remove('appear');
      }
    }, 2400);
  }
}

function fadeInDots() {
  var dots = document.querySelectorAll('.dot');
  for(let i = 0; i < dots.length; i++) {
    setTimeout(function() {
      dots[i].classList.add('appear');
    }, 100 + Math.random() * 1500);
  }
}

module.exports = createTable;

},{}],2:[function(require,module,exports){
function isLegitEdge(prev, current){
  var thisID = current.id.split("x");
  var thisRow = Number(thisID[1]);
  var thisCol = Number(thisID[2]);
  var activeID = prev.id.split("x");
  var activeRow = Number(activeID[1]);
  var activeCol = Number(activeID[2]);
  if (thisRow==activeRow && thisCol==activeCol-1) return "right";
  if (thisRow==activeRow && thisCol==activeCol+1) return "left";
  if (thisCol==activeCol && thisRow==activeRow-1) return "down";
  if (thisCol==activeCol && thisRow==activeRow+1) return "up";
  return false;
}

module.exports = isLegitEdge;

},{}],3:[function(require,module,exports){
var turn = 0;
var edges = [];
var redScore = 0;
var blueScore = 0;
var SIDES = 8;
var newEdge;



var createTable = require('./createTable.js');
var isLegitEdge = require('./isLegitEdge.js');

function handleClick(e){
  var activeElements = document.querySelectorAll(".active");
  if (activeElements.length > 0){
    var edge = isLegitEdge(activeElements[0], this);
    if ( edge ){
        activeElements[0].classList.toggle("active");
        processEdge(this, edge);
    }
    else{
      activeElements[0].classList.toggle("active");
      if (this.id != activeElements[0].id){
        this.classList.toggle("active");
      }

    }
  }
  else{
    this.classList.toggle("active");
  }
}

function processEdge(element, dir){
  newEdge = document.createElement('div');
  let edgeAlreadyTaken = Array.from(element.querySelectorAll('div'))
    .find(el => el.classList.value.split('-')[0] === dir);
  if (turn % 2 === 0){
    // element.innerHTML += `<div class='${dir}-blue'></div>`;
    if(edgeAlreadyTaken) return turn++;
    newEdge.classList.add(`${dir}-blue`);
    element.appendChild(newEdge);
  }
  else{
    // element.innerHTML += `<div class='${dir}-red'></div>`;
    if(edgeAlreadyTaken) return turn++;
    newEdge.classList.add(`${dir}-red`);
    element.appendChild(newEdge);
  }
  createEdge(element, dir);
  turn++;
}

function createEdge(element, dir){
  //[{r: _, c:_}, {r:_, c:_}]
  var dest = element.id.split("x");
  dest = {r : Number(dest[1]), c : Number(dest[2])};
  var orig;
  if (dir === 'left') orig = {r: dest.r, c: dest.c -1 };
  if (dir === 'right') orig = {r: dest.r, c: dest.c +1 };
  if (dir === 'up') orig = { r: dest.r -1, c: dest.c };
  if (dir === 'down') orig = {r: dest.r +1, c: dest.c };
  edges.push([orig, dest]);
  edges.push([dest, orig]);
  //check for square completion
  if (dir == 'left' || dir =='right') checkUpandDown();
  if (dir == 'up' || dir =='down') checkLeftandRight();
}

function checkUpandDown(){
  var lastEdge = edges.slice(-1)[0];
  var topLeft = {r:lastEdge[0].r-1, c: lastEdge[0].c};
  var topRight = {r:lastEdge[1].r-1, c: lastEdge[1].c};
  var bottomLeft = {r:lastEdge[0].r+1, c: lastEdge[0].c};
  var bottomRight = {r:lastEdge[1].r+1, c: lastEdge[1].c};
  if (topEdgeFound() && bottomEdgeFound()){
    //fill square above and below
    updateScores(2);
  }
  else if (topEdgeFound()){
    //fill square above
    updateScores(1);
  }
  else if (bottomEdgeFound()){
    //fill square below
    updateScores(1);
  }
  function topEdgeFound(){
    return findEdge(lastEdge[0], topLeft) &&
         findEdge(lastEdge[1], topRight) &&
         findEdge(topLeft, topRight);
  }
  function bottomEdgeFound(){
    return findEdge(lastEdge[0], bottomLeft) &&
        findEdge(lastEdge[1], bottomRight) &&
        findEdge(bottomLeft, bottomRight);
  }
}
function checkLeftandRight(){
  var lastEdge = edges.slice(-1)[0];
  var topLeft = {r:lastEdge[0].r, c: lastEdge[0].c-1};
  var topRight = {r:lastEdge[0].r, c: lastEdge[0].c+1};
  var bottomLeft = {r:lastEdge[1].r, c: lastEdge[1].c-1};
  var bottomRight = {r:lastEdge[1].r, c: lastEdge[1].c+1};
  if (leftSideFound() && rightSideFound() ){
    //fill both squares
    updateScores(2);
  }
  else if (leftSideFound() ){
    //fill square above
    updateScores(1);
  }
  else if (rightSideFound()){
    //fill square below
    updateScores(1);
  }
  function leftSideFound(){
    return findEdge(lastEdge[0], topLeft) &&
         findEdge(lastEdge[1], bottomLeft) &&
         findEdge(topLeft, bottomLeft);
  }
  function rightSideFound(){
    return findEdge(lastEdge[0], topRight) &&
        findEdge(lastEdge[1], bottomRight) &&
        findEdge(topRight, bottomRight)
  }
}

function updateScores(inc){
  if (turn-- % 2 === 0) {
    blueScore+=inc;
    document.querySelector('.bluescore').classList.add('animate');
    document.querySelector('.bluescore').addEventListener('animationend', function() {
        this.classList.remove('animate');
    });
  }
  else {
    redScore+=inc;
    document.querySelector('.redscore').classList.add('animate');
    document.querySelector('.redscore').addEventListener('animationend', function() {
        this.classList.remove('animate');
    });
  }
  console.log("turn: "+turn);
  document.getElementById('bluescore').innerHTML = blueScore;
  document.getElementById('redscore').innerHTML = redScore;
  if (edges.length === 2*2*SIDES*(SIDES-1)){
    if (redScore > blueScore) redWins();
    else if (redScore < blueScore) blueWins();
    else itsATie();
  }
}

var title = document.querySelector('.title');
var playAgain = document.querySelector('.play-again');

function redWins(){
  title.innerHTML = 'Red Wins!';
  title.style.color = 'red';
  title.style.fontSize = '3rem';
  playAgain.style.display = 'block';
}

function blueWins(){
  title.innerHTML = 'Blue Wins!';
  title.style.color = 'blue';
  title.style.fontSize = '3rem';
  playAgain.style.display = 'block';
}

function itsATie(){
  title.innerHTML = "It's a Tie!";
  title.style.fontSize = '3rem';
  playAgain.style.display = 'block';
}

function resetGame() {
  window.location.reload();
}

function findEdge(orig, dest){
  for (var i = 0; i < edges.length; i++){
    if (edges[i][0].r === orig.r && edges[i][0].c === orig.c
        && edges[i][1].r === dest.r && edges[i][1].c === dest.c)
        return true;
  }
  return false;
}

window.onload = function(){
  createTable(SIDES);
  document.querySelectorAll("#matrix td").forEach(function(e,i){
    e.onclick = handleClick;
  });
  document.querySelector('.play-again').addEventListener('click', resetGame);
  document.querySelector('.reset').addEventListener('click', resetGame);
}

},{"./createTable.js":1,"./isLegitEdge.js":2}]},{},[3]);
