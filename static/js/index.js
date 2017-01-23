var srcCol = 0;
var srcRow = 0;
var currentColor = "black";
var currentId = null;
// occupiedArray stores an 8x8 array that represents each board and whether or not it has a checker piece, each index is based off of Math.floor((y - 15) / 50) and Math.floor((x - 15) / 50)
var occupiedArray = new Array(8);
for (var i = 0; i < 8; i++) {
  occupiedArray[i] = []
}

function setUpBoard () {
  var redCount = 1;
  var blackCount = 1;
  for(var i = 0; i < 64; i++) {
    var floorIndex = Math.floor(i/8);
    if (floorIndex < 3) {
      if ((floorIndex % 2 == 0) && (i % 2 == 1)) {
        occupiedArray[floorIndex][i % 8] = createChecker(("red" + redCount), "red", ((floorIndex * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 65) + "px");
        redCount++;
      }
      else if ((floorIndex % 2 == 1) && (i % 2 == 0)){
        occupiedArray[floorIndex][i % 8] = createChecker(("red" + redCount), "red", ((floorIndex * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 15) + "px");
        redCount++;
      }
      else {
        occupiedArray[floorIndex][i % 8] = null;
      }
    }
    else if (floorIndex > 4) {
      if ((floorIndex % 2 == 0) && (i % 2 == 1)) {
        occupiedArray[floorIndex][i % 8] = createChecker(("black" + blackCount), "black", ((floorIndex * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 65) + "px");
        blackCount++;
      }
      else if ((floorIndex % 2 == 1) && (i % 2 == 0)){
        occupiedArray[floorIndex][i % 8] = createChecker(("black" + blackCount), "black", ((floorIndex * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 15) + "px");
        blackCount++;
      }
      else {
        occupiedArray[floorIndex][i % 8] = null;
      }
    }
    else {
      occupiedArray[floorIndex][i % 8] = null;
    }
  }
  console.log(occupiedArray);
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
  if (isLegalMove(destRow, destCol, checkerId, currentColor)) {
    event.preventDefault();
    if (Math.abs(destRow - srcRow) == 1) {
      makeSimpleMove(destRow, destCol, checkerId);
    }
    else if (Math.abs(destRow - srcRow) == 2) {
      makeJumpMove(destRow, destCol, checkerId, currentColor);
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

function isLegalMove(row, col, checkerId, color) {
  var floorRow = Math.floor((row - 15) / 50);
  var floorCol = Math.floor((col - 15) / 50);
  var jumpList = jumpExists(color);
  if ((currentId != null) && (checkerId != currentId)) {
    return false;
  }
  if (!((row % 2 == 0) && (col % 2 == 1)) && !(row % 2 == 1) && (col % 2 == 0)) {
    return false;
  }
  if (!cellIsVacant(row, col)) {
    return false;
  }
  if (!((Math.abs(srcCol - col) == 1) && (Math.abs(srcRow - row) == 1)) && !((Math.abs(srcCol - col) == 2) && (Math.abs(srcRow - row) == 2))) {
    return false;
  }
  if (((Math.abs(srcCol - col) == 2) && (Math.abs(srcRow - row) == 2))) {
    if (occupiedArray[row + (srcRow - row)/2][col + (srcCol - col)/2] == null) {
        return false;
    }
  }
  // Check to see if the source checker being moved is the correct color
  if (hasChecker(srcRow, srcCol, color) == null) {
    return false;
  }
  if (jumpList.length > 0) {
    for (var i = 0; i < jumpList.length; i++) {
      if (!jumpList.includes(checkerId)) {
        return false;
      }
    }
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
  var winner = checkForWinner();
  if (winner != null) {
    document.getElementById("currentPlayer").innerHTML = winner + " wins!";
  }
}

function makeJumpMove(destRow, destCol, checkerId, color) {
  document.getElementById(checkerId).style.top = (destRow * 50 + 15) + "px";
  document.getElementById(checkerId).style.left = (destCol * 50 + 15) + "px";
  var jumpedId = occupiedArray[destRow + (srcRow - destRow)/2][destCol + (srcCol - destCol)/2].id;
  document.getElementById(jumpedId).style.display = "none";
  occupiedArray[destRow][destCol] = occupiedArray[srcRow][srcCol];
  occupiedArray[destRow + (srcRow - destRow)/2][destCol + (srcCol - destCol)/2] = null;
  occupiedArray[srcRow][srcCol] = null;
  if (currentId == null) {
    currentId = checkerId;
  }
  var jumpList = jumpExists(color);
  if (jumpList.length == 0) {
    if (document.getElementById(checkerId).classList.contains("red")) {
      currentColor = "black";
    }
    else {
      currentColor = "red";
    }
    document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
    currentId = null;
  }
  var winner = checkForWinner();
  if (winner != null) {
    document.getElementById("currentPlayer").innerHTML = winner + " wins!";
  }
}

function checkAdjacent(row, col, checkerId, color) {
  if ((currentId != null) && (checkerId != currentId)) {
    return false;
  }
  if (outOfBounds(row, col)) {
    return false;
  }
  if (isAKing(checkerId)) {
    if ((!cellIsVacant(row + 1, col + 1)) && (cellIsVacant(row + 2, col + 2))) {
      var adjacentId = occupiedArray[row + 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
    }
    else if ((!cellIsVacant(row + 1, col - 1)) && (cellIsVacant(row + 2, col - 2))) {
      var adjacentId = occupiedArray[row + 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
    }
    else if ((!cellIsVacant(row - 1, col - 1)) && (cellIsVacant(row - 2, col - 2))) {
      var adjacentId = occupiedArray[row - 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
    }
    else if ((!cellIsVacant(row -1, col + 1)) && (cellIsVacant(row - 2, col + 2))) {
      var adjacentId = occupiedArray[row - 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
    }
  }
  else if (document.getElementById(checkerId).classList.contains("red")) {
    if ((!cellIsVacant(row + 1, col - 1)) && (cellIsVacant(row + 2, col - 2))) {
      var adjacentId = occupiedArray[row + 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("black")) {
        return true;
      }
    }
    else if ((!cellIsVacant(row + 1, col + 1)) && (cellIsVacant(row + 2, col + 2))) {
      var adjacentId = occupiedArray[row + 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("black")) {
        return true;
      }
    }
  }
  else if (document.getElementById(checkerId).classList.contains("black")) {
    if ((!cellIsVacant(row - 1, col + 1)) && (cellIsVacant(row - 2, col + 2))) {
      var adjacentId = occupiedArray[row - 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("red")) {
        return true;
      }
    }
    else if ((!cellIsVacant(row - 1, col - 1)) && (cellIsVacant(row - 2, col - 2))) {
      var adjacentId = occupiedArray[row - 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("red")) {
        return true;
      }
    }
  }
  return false;
}

function jumpExists(color) {
  var count = 0;
  var jumpList = [];
  for (var i = 0; i < occupiedArray.length; i++) {
    for (var j = 0; j < occupiedArray[i].length; j++) {
      if (!cellIsVacant(i, j)) {
        if (checkAdjacent(i, j, occupiedArray[i][j].id, color) && (occupiedArray[i][j].classList.contains(color))) {
          if (currentId == null) {
            jumpList.push(occupiedArray[i][j].id);
          }
          else if (currentId == occupiedArray[i][j].id) {
            jumpList.push(occupiedArray[i][j].id);
          }
        }
      }
    }
  }
  return jumpList;
}

function checkForWinner() {
  var redCount = 0;
  var blackCount = 0;
  for (var i = 0; i < occupiedArray.length; i++) {
    for (var j = 0; j < occupiedArray[i].length; j++) {
      if (!cellIsVacant(i, j)) {
        if (occupiedArray[i][j].classList.contains("red")) {
          redCount++;
        }
        else if (occupiedArray[i][j].classList.contains("black")) {
          blackCount++;
        }
      }
    }
  }
  if (redCount == 0) {
    return "Black";
  }
  else if (blackCount == 0)
  {
    return "Red";
  }
  else {
    return null;
  }
}

function hasChecker(row, col, color) {
  if ((row > 7) || (row < 0) || (col > 7) || (col < 0) || (occupiedArray[row][col] == null) || (!occupiedArray[row][col].classList.contains(color))) {
    return null;
  }
  return occupiedArray[row][col];
}

function cellIsVacant(row, col) {
  if (row > 7 || row < 0 || col > 7 || col < 0) {
    return false;
  }
  else if (occupiedArray[row][col] == null) {
    return true;
  }
  return false;
}

function outOfBounds(row, col) {
  if (((row - 2) < 0) || ((row + 2) > 7)) {
    return false;
  }
  else if (((col - 2) < 0) || ((col + 2) > 7)) {
    return false;
  }
  return true;
}

function isAKing(checkerId) {
  return document.getElementById(checkerId).classList.contains("king");
}