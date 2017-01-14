var dragCol = 0;
var dragRow = 0;
var currentColor = "red";
// occupiedArray stores an 8x8 array that represents each board and whether or not it has a checker piece, each index is based off of Math.floor((y - 15) / 50) and Math.floor((x - 15) / 50)
var occupiedArray = new Array(8);
for (var i = 0; i < 8; i++) {
  occupiedArray[i] = []
}

for (var i = 0; i < 4; i++) {
  occupiedArray[0][i * 2 + 1] = createChecker(("red" + i), "red", "15px", ((i % 4) * 100 + 65) + "px");
}

for (var i = 4; i < 8; i++) {
  occupiedArray[1][(i - 4) * 2] = createChecker(("red" + i), "red", "65px", ((i % 4) * 100 + 15) + "px");;
}

for (var i = 8; i < 12; i++) {
  occupiedArray[2][(i - 8) * 2 + 1] = createChecker(("red" + i), "red", "115px", ((i % 4) * 100 + 65) + "px");;
}

for (var i = 0; i < 4; i++) {
  occupiedArray[3][i * 2] = null;
}

for (var i = 0; i < 4; i++) {
  occupiedArray[4][i * 2 + 1] = null;
}

for (var i = 12; i < 16; i++) {
  occupiedArray[5][(i - 12) * 2] = createChecker(("black" + i), "black", "265px", ((i % 4) * 100 + 15) + "px");
}

for (var i = 16; i < 20; i++) {
  occupiedArray[6][(i - 16) * 2 + 1] = createChecker(("black" + i), "black", "315px", ((i % 4) * 100 + 65) + "px");
}

for (var i = 20; i < 24; i++) {
  occupiedArray[7][(i - 20) * 2] = createChecker(("black" + i), "black", "365px", ((i % 4) * 100 + 15) + "px");
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
  dragCol = Math.floor((event.clientX - 15) / 50);
  dragRow = Math.floor((event.clientY - 15) / 50);
  var checkerObject = document.getElementById(event.target.id);
  currentColor = checkerObject.className.split(" ")[0];
}

function drop(event) {
  var checkerId = event.dataTransfer.getData("Text");
  var x = event.clientX;
  var y = event.clientY;
  if (isLegalMove(x, y)) {
    event.preventDefault();
    moveCheckerToSquare(x, y, checkerId);
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

function kingAPiece(checkerId) {
  if (!document.getElementById(checkerId).classList.contains("king")) {
    if (document.getElementById(checkerId).classList.contains("red")) {
      document.getElementById(checkerId).src = "images/red_king.png";
    } else {
      document.getElementById(checkerId).src = "images/black_king.png";
    }
    document.getElementById(checkerId).classList.add("king");
  }
}

function isLegalMove(x, y, checkerId) {
  var floorRow = Math.floor((y - 15) / 50);
  var floorCol = Math.floor((x - 15) / 50);
  if (!((Math.floor(y / 50) % 2 == 0) && (Math.floor(x / 50) % 2 == 1)) && !(Math.floor(y / 50) % 2 == 1) && (Math.floor(x / 50) % 2 == 0)) {
    return false;
  }
  if (occupiedArray[floorRow][floorCol] != null) {
    return false;
  }
  if (!((Math.abs(dragCol - floorCol) == 1) && (Math.abs(dragRow - floorRow) == 1)) && !((Math.abs(dragCol - floorCol) == 2) && (Math.abs(dragRow - floorRow) == 2))) {
    return false;
  }
  if (!(isAKing(checkerId))) {
    if ((((dragRow - floorRow) == -1) || ((dragRow - floorRow) == -2)) && (currentColor == "red")) {
      return true;
    }
    else if ((((dragRow - floorRow) == 1) || ((dragRow - floorRow) == 2)) && (currentColor == "black")) {
      return true;
    }
    else {
      return false;
    }
  }
  return true;
}

function moveCheckerToSquare(col, row, checkerId) {
  var floorRow = Math.floor((row - 15) / 50);
  var floorCol = Math.floor((col - 15) / 50);
  if ((isAKing(document.getElementById(checkerId))) && (Math.abs((dragCol - floorCol/2) == 1))) {
    document.getElementById(checkerId).style.top = (Math.floor((row - 15) / 50) * 50 + 15) + "px";
    document.getElementById(checkerId).style.left = (Math.floor((col - 15) / 50) * 50 + 15) + "px";
    occupiedArray[floorRow][floorCol] = occupiedArray[dragY][dragX];
    occupiedArray[dragRow][dragCol] = null;
  }
  else if (((dragY - floorY) == -1) && (currentColor == "red")) {
    document.getElementById(checkerId).style.top = (Math.floor((row - 15) / 50) * 50 + 15) + "px";
    document.getElementById(checkerId).style.left = (Math.floor((col - 15) / 50) * 50 + 15) + "px";
    occupiedArray[floorRow][floorCol] = occupiedArray[dragRow][dragCol];
    occupiedArray[dragRow][dragCol] = null;
  }
  else if (((dragY - floorY) == 1) && (currentColor == "black")) {
    document.getElementById(checkerId).style.top = (Math.floor((row - 15) / 50) * 50 + 15) + "px";
    document.getElementById(checkerId).style.left = (Math.floor((col - 15) / 50) * 50 + 15) + "px";
    occupiedArray[floorRow][floorCol] = occupiedArray[dragRow][dragCol];
    occupiedArray[dragRow][dragCol] = null;
  }
  else if (Math.abs((dragCol - floorCol)/2) == 1) {
    if (((dragRow - floorRow) == -2) && (currentColor == "red")) {
      if (((floorCol - dragCol) == 2) && (occupiedArray[floorRow - 1][floorCol - 1].classList.contains("black"))) {
        document.getElementById(checkerId).style.top = (Math.floor((row - 15) / 50) * 50 + 15) + "px";
        document.getElementById(checkerId).style.left = (Math.floor((col - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorRow][floorCol] = occupiedArray[dragRow][dragCol];
        occupiedArray[dragRow][dragCol] = null;
        occupiedArray[floorRow - 1][floorCol - 1].parentNode.removeChild(occupiedArray[floorRow - 1][floorCol - 1]);
        occupiedArray[floorRow - 1][floorCol - 1] = null;
      }
      else if (((floorCol - dragCol) == -2) && (occupiedArray[floorRow - 1][floorCol + 1].classList.contains("black"))) {
        document.getElementById(checkerId).style.top = (Math.floor((row - 15) / 50) * 50 + 15) + "px";
        document.getElementById(checkerId).style.left = (Math.floor((col - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorRow][floorCol] = occupiedArray[dragRow][dragCol];
        occupiedArray[dragRow][dragCol] = null;
        occupiedArray[floorRow - 1][floorCol + 1].parentNode.removeChild(occupiedArray[floorRow - 1][floorCol + 1]);
        occupiedArray[floorRow - 1][floorCol + 1] = null;
      }
    }
    else if (((dragRow - floorRow) == 2) && (currentColor == "black")) {
      if (((floorCol - dragCol) == 2) && occupiedArray[floorRow + 1][floorCol - 1].classList.contains("red")) {
        document.getElementById(checkerId).style.top = (Math.floor((row - 15) / 50) * 50 + 15) + "px";
        document.getElementById(checkerId).style.left = (Math.floor((col - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorRow][floorCol] = occupiedArray[dragRow][dragCol];
        occupiedArray[floorRow + 1][floorCol - 1].parentNode.removeChild(occupiedArray[floorRow - 1][floorCol + 1]);
        occupiedArray[dragRow][dragCol] = null;
        occupiedArray[floorRow + 1][floorCol - 1] = null;
      }
      else if (((floorCol - dragCol) == -2) && occupiedArray[floorRow + 1][floorCol + 1].classList.contains("red")) {
        document.getElementById(checkerId).style.top = (Math.floor((row - 15) / 50) * 50 + 15) + "px";
        document.getElementById(checkerId).style.left = (Math.floor((col - 15) / 50) * 50 + 15) + "px";
        occupiedArray[floorRow][floorCol] = occupiedArray[dragRow][dragCol];
        occupiedArray[floorRow + 1][floorCol + 1].parentNode.removeChild(occupiedArray[floorRow - 1][floorCol + 1]);
        occupiedArray[dragRow][dragCol] = null;
        occupiedArray[floorRow + 1][floorCol + 1] = null;
      }
    }
  }
  if (((floorY == 7) || (floorY == 0)) && (!isAKing(document.getElementById(checker)))) {
      kingAPiece(checkerId);
  }
}

function isAKing(checkerId) {
  if (document.getElementById(checkerId).classList.contains("king")) {
    return true;
  }
  else {
    return false;
  }
}