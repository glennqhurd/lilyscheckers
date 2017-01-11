var dragX = 0;
var dragY = 0;
var currentColor = "red";
var isAKing = false;
var checkerArray = new Array();
// occupiedArray stores an 8x8 array that represents each board and whether or not it has a checker piece, each index is based off of Math.floor((y - 15) / 50) and Math.floor((x - 15) / 50)
var occupiedArray = new Array(8);
for (var i = 0; i < 8; i++) {
  occupiedArray[i] = []
}

for (var i = 0; i < 4; i++) {
  checkerArray[i] = createChecker(("red" + i), "red", "15px", ((i % 4) * 100 + 65) + "px");
  occupiedArray[0][i * 2 + 1] = checkerArray[i];
}

for (var i = 4; i < 8; i++) {
  checkerArray[i] = createChecker(("red" + i), "red", "65px", ((i % 4) * 100 + 15) + "px");
  occupiedArray[1][(i - 4) * 2] = checkerArray[i];
}

for (var i = 8; i < 12; i++) {
  checkerArray[i] = createChecker(("red" + i), "red", "115px", ((i % 4) * 100 + 65) + "px");
  occupiedArray[2][(i - 8) * 2 + 1] = checkerArray[i];
}

for (var i = 0; i < 4; i++) {
  occupiedArray[3][i * 2] = "none";
}

for (var i = 0; i < 4; i++) {
  occupiedArray[4][i * 2 + 1] = "none";
}

for (var i = 12; i < 16; i++) {
  checkerArray[i] = createChecker(("black" + i), "black", "265px", ((i % 4) * 100 + 15) + "px");
  occupiedArray[5][(i - 12) * 2] = checkerArray[i];
}

for (var i = 16; i < 20; i++) {
  checkerArray[i] = createChecker(("black" + i), "black", "315px", ((i % 4) * 100 + 65) + "px");
occupiedArray[6][(i - 16) * 2 + 1] = checkerArray[i];
}

for (var i = 20; i < 24; i++) {
  checkerArray[i] = createChecker(("black" + i), "black", "365px", ((i % 4) * 100 + 15) + "px");
  occupiedArray[7][(i - 20) * 2] = checkerArray[i];
}

window.onload = function() {
	var canvas = document.getElementById("checkerboard");
	var context2D = canvas.getContext("2d");
  var count = 0;
	for (var row = 0; row < 8; row++) {
		for (var col = 0; col < 8; col++) {
			// coordinates of the top-left corner
			var x = col * 50;
			var y = row * 50;

			if ((row + col) % 2 == 0) {
					context2D.fillStyle = "Khaki";
      }	else {
					context2D.fillStyle = "SeaGreen";
			}
			context2D.fillRect(x, y, 50, 50);
		}
	}
};

function test(event) {
  alert(event.x)
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("Text", event.target.id);
  dragX = Math.floor((event.clientX - 15) / 50);
  dragY = Math.floor((event.clientY - 15) / 50);
  var checkerObject = document.getElementById(event.target.id);
  currentColor = checkerObject.className.split(" ")[0];
  if (checkerObject.classList.contains("king")) {
      isAKing = true;
  }
  else {
      isAKing = false;
  }
  console.log(currentColor);
}

function drop(event) {
  var data = event.dataTransfer.getData("Text");
  var x = event.clientX;
  var y = event.clientY;
  console.log("Value of x: " + x);
  console.log("Value of y: " + y);
  if (isLegalMove(x, y)) {
    event.preventDefault();
    makeMove(x, y, data);
  }
}

//To center image in square add 5 to x and y after multiplying row and column index by 50 each (starting at 0)
function drawChecker(id, context2D, x, y){
  var element = document.getElementById(id);
  context2D.drawImage(element, x, y);
}

function createChecker(id, color, tposition, lposition) {
  var image = document.createElement("IMG");
  image.id = id;
  if (color == "black") {
    image.src = "images/black_checker.png";
    image.alt = "Black";
    image.className = "black";
  }
  else if (color == "red"){
    image.src = "images/red_checker.png";
    image.alt = "Red";
    image.className = "red";
  }
  document.getElementById("boardset").appendChild(image);
  image.addEventListener("dragstart", drag);
  image.style.position = "absolute";
  image.style.top = tposition;
  image.style.left = lposition;
  return image;
}

function kingAPiece(data) {
  if (!document.getElementById(data).classList.contains("king")) {
    if (document.getElementById(data).classList.contains("red")) {
      document.getElementById(data).src = "images/red_king.png";
    } else {
      document.getElementById(data).src = "images/black_king.png";
    }
    document.getElementById(data).classList.add("king");
  }
}

function isLegalMove(x, y) {
  var floorY = Math.floor((y - 15) / 50);
  var floorX = Math.floor((x - 15) / 50);
  if (!((Math.floor(y / 50) % 2 == 0) && (Math.floor(x / 50) % 2 == 1)) && !(Math.floor(y / 50) % 2 == 1) && (Math.floor(x / 50) % 2 == 0)) {
    console.log("false because wrong panel");
    return false;
  }
  if (occupiedArray[floorY][floorX] != "none") {
    console.log("false because occupied");
    return false;
  }
  if (!((Math.abs(dragX - floorX) == 1) && (Math.abs(dragY - floorY) == 1)) && !((Math.abs(dragX - floorX) == 2) && (Math.abs(dragY - floorY) == 2))) {
    console.log("false because placed too far");
    return false;
  }
  if (isAKing == false) {
    if ((((dragY - floorY) == -1) && (currentColor == "red")) || (((dragY - floorY) == -2) && (currentColor == "red")) ) {
      return true;
    }
    else if ((((dragY - floorY) == 1) && (currentColor == "black")) || (((dragY - floorY) == 2) && (currentColor == "black"))) {
      return true;
    }
    else {
      console.log("false because piece cannot move backward");
      return false;
    }
  }
  return true;
}

function makeMove(x, y, data) {
  var floorY = Math.floor((y - 15) / 50);
  var floorX = Math.floor((x - 15) / 50);
  if (isAKing == true) {
    document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
    document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
    occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
    occupiedArray[dragY][dragX] = "none";
  }
  else if (((dragY - floorY) == -1) && (currentColor == "red")) {
    document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
    document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
    occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
    occupiedArray[dragY][dragX] = "none";
  }
  else if (((dragY - floorY) == 1) && (currentColor == "black")) {
    document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
    document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
    occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
    occupiedArray[dragY][dragX] = "none";
  }
  else if (((dragX - floorX) == -2) || ((dragX - floorX) == 2)) {
    console.log("Current color is: " + currentColor);
    console.log("Y displacement is: " + (dragY - floorY));
    console.log("floorY is: " + floorY);
    if (((dragY - floorY) == -2) && (currentColor == "red")) {
      console.log("occupiedArray left: " + (occupiedArray[floorY - 1][floorX - 1]));
      console.log("occupiedArray right: " + (occupiedArray[floorY - 1][floorX + 1]));
      if (occupiedArray[floorY - 1][floorX - 1].classList.contains("black")) {
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
      else if (occupiedArray[floorY - 1][floorX + 1].classList.contains("black")) {
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
    }
    else if (((dragY - floorY) == 2) && (currentColor == "black")) {
      if (occupiedArray[floorY + 1][floorX - 1].classList.contains("red")) {
        console.log("Entered part 1");
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
      else if (occupiedArray[floorY + 1][floorX + 1].classList.contains("red")) {
        console.log("Entered part 2");
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
    }
    else if ((dragY - floorY == 2) && (currentColor == "red")) {
      if (occupiedArray[floorY + 1][floorX - 1].classList("black")) {
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
      else if (occupiedArray[floorY + 1][floorX + 1].classList("black")) {
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
    }
    else if ((dragY - floorY == -2) && (currentColor == "black")) {
      if (occupiedArray[floorY + 1][floorX - 1].classList.contains("red")) {
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
      else if (occupiedArray[floorY + 1][floorX + 1].classList.contains("red")) {
        document.getElementById(data).style.top = (Math.floor((y - 15) / 50) * 50 + 15) + "px";
        document.getElementById(data).style.left = (Math.floor((x - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorY][floorX] = occupiedArray[dragY][dragX];
        occupiedArray[dragY][dragX] = "none";
      }
    }
  }
  console.log("Reached this point");
  if (((floorY == 7) || (floorY == 0)) && (isAKing == false)) {
      kingAPiece(data);
  }
}