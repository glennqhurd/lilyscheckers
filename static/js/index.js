var srcCol = 0;
var srcRow = 0;
var currentColor = "black";
// occupiedArray stores an 8x8 array that represents each board and whether or not it has a checker piece, each index is based off of Math.floor((y - 15) / 50) and Math.floor((x - 15) / 50)
var occupiedArray = new Array(8);
for (var i = 0; i < 8; i++) {
  occupiedArray[i] = []
}

function setUpBoard () {
  for(var i = 0; i < 24; i++) {
    var floorIndex = Math.floor(i/4);
    if (floorIndex < 3) {
      if (floorIndex % 2 == 0) {
        occupiedArray[floorIndex][(i % 4) * 2 + 1] = createChecker(("red" + i), "red", ((floorIndex * 50) + 15) + "px", ((i % 4) * 100 + 65) + "px");
      }
      else {
        occupiedArray[floorIndex][(i % 4) * 2] = createChecker(("red" + i), "red", ((floorIndex * 50) + 15) + "px", ((i % 4) * 100 + 15) + "px");
      }
    }
    else {
      if (floorIndex % 2 == 1) {
          occupiedArray[floorIndex + 2][(i % 4) * 2] = createChecker(("black" + i), "black", ((floorIndex * 50) + 115) + "px", ((i % 4) * 100 + 15) + "px");
      }
      else {
          occupiedArray[floorIndex + 2][(i % 4) * 2 + 1] = createChecker(("black" + i), "black", ((floorIndex * 50) + 115) + "px", ((i % 4) * 100 + 65) + "px");
      }
    }
  }

  for (var i = 0; i < 4; i++) {
    occupiedArray[3][i * 2] = null;
  }

  for (var i = 0; i < 4; i++) {
    occupiedArray[4][i * 2 + 1] = null;
  }
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
      }
      else {
	    context2D.fillStyle = "SeaGreen";
	  }
	  context2D.fillRect(x, y, 50, 50);
    }
  }
  setUpBoard();
};

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("Text", event.target.id);
  srcCol = Math.floor((event.clientX - 15) / 50);
  srcRow = Math.floor((event.clientY - 15) / 50);
  var checkerObject = document.getElementById(event.target.id);
}

function drop(event) {
  var checkerId = event.dataTransfer.getData("Text");
  var destRow = Math.floor((event.clientY - 15) / 50);
  var destCol = Math.floor((event.clientX - 15) / 50);
  if (isLegalMove(destRow, destCol, checkerId)) {
    event.preventDefault();
    if (Math.abs(destRow - srcRow) == 1) {
      makeSimpleMove(destRow, destCol, checkerId);
    }
    else if (Math.abs(destRow - srcRow) == 2) {
      makeJumpMove(destRow, destCol, checkerId);
    }
    if (((destRow == 7) || (destRow == 0)) && (!isAKing(checkerId))) {
      kingAPiece(checkerId);
    }
  }
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

function isLegalMove(row, col, checkerId) {
  var floorRow = Math.floor((row - 15) / 50);
  var floorCol = Math.floor((col - 15) / 50);
  if (!((row % 2 == 0) && (col % 2 == 1)) && !(row % 2 == 1) && (col % 2 == 0)) {
    return false;
  }
  if (occupiedArray[row][col] != null) {
    return false;
  }
  if (!((Math.abs(srcCol - col) == 1) && (Math.abs(srcRow - row) == 1)) && !((Math.abs(srcCol - col) == 2) && (Math.abs(srcRow - row) == 2))) {
    return false;
  }
  if (((Math.abs(srcCol - col) == 2) && (Math.abs(srcRow - row) == 2))) {
      console.log("row: " + (row + (srcRow - row)/2));
      console.log("col: " + (col + (srcCol - col)/2));
    if (occupiedArray[row + (srcRow - row)/2][col + (srcCol - col)/2] == null) {
        return false;
    }
  }
  if (!document.getElementById(checkerId).classList.contains(currentColor)) {
    return false;
  }
  if (!(isAKing(checkerId))) {
    if ((((srcRow - row) == -1) || ((srcRow - row) == -2)) && (document.getElementById(checkerId).classList.contains("red"))) {
      return true;
    }
    else if ((((srcRow - row) == 1) || ((srcRow - row) == 2)) && (document.getElementById(checkerId).classList.contains("black"))) {
      return true;
    }
    else {
      return false;
    }
  }
  return true;
}

function makeSimpleMove(destRow, destCol, checkerId) {
  document.getElementById(checkerId).style.top = (destRow * 50 + 15) + "px";
  document.getElementById(checkerId).style.left = (destCol * 50 + 15) + "px";
  occupiedArray[destRow][destCol] = occupiedArray[srcRow][srcCol];
  occupiedArray[srcRow][srcCol] = null;
  if (document.getElementById(checkerId).classList.contains("red")) {
    currentColor = "black";
  }
  else {
    currentColor = "red";
  }
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
}

function makeJumpMove(destRow, destCol, checkerId) {
  document.getElementById(checkerId).style.top = (destRow * 50 + 15) + "px";
  document.getElementById(checkerId).style.left = (destCol * 50 + 15) + "px";
  var jumpedId = occupiedArray[destRow + (srcRow - destRow)/2][destCol + (srcCol - destCol)/2].id;
  document.getElementById(jumpedId).style.display = "none";
  occupiedArray[destRow][destCol] = occupiedArray[srcRow][srcCol];
  occupiedArray[destRow + (srcRow - destRow)/2][destCol + (srcCol - destCol)/2] = null;
  occupiedArray[srcRow][srcCol] = null;
  if (document.getElementById(checkerId).classList.contains("red")) {
    currentColor = "black";
  }
  else {
    currentColor = "red";
  }
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
}

function isAKing(checkerId) {
  return document.getElementById(checkerId).classList.contains("king");
}