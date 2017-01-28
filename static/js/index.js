var srcCol = 0;
var srcRow = 0;
var currentColor = "black";
var currentCheckerId = null;
// occupiedArray stores an 8x8 array that represents each board and whether or not it has a checker piece, each index is based off of Math.floor((y - 15) / 50) and Math.floor((x - 15) / 50)
var occupiedArray = new Array(8);

function setUpBoard () {
  var blackCount = 1;
  var redCount = 1;
  for (var i = 0; i < 8; i++) {
    occupiedArray[i] = [];
  }
  for(var i = 0; i < 64; i++) {
    var floorRow = Math.floor(i/8);
    if (floorRow < 3) {
      if ((floorRow % 2 == 0) && (i % 2 == 1)) {
        occupiedArray[floorRow][i % 8] = createChecker(("black" + blackCount), "black", ((floorRow * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 65) + "px");
        blackCount++;
      }
      else if ((floorRow % 2 == 1) && (i % 2 == 0)){
        occupiedArray[floorRow][i % 8] = createChecker(("black" + blackCount), "black", ((floorRow * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 15) + "px");
        blackCount++;
      }
      else {
        occupiedArray[floorRow][i % 8] = null;
      }
    }
    else if (floorRow > 4) {
      if ((floorRow % 2 == 0) && (i % 2 == 1)) {
        occupiedArray[floorRow][i % 8] = createChecker(("red" + redCount), "red", ((floorRow * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 65) + "px");
        redCount++;
      }
      else if ((floorRow % 2 == 1) && (i % 2 == 0)){
        occupiedArray[floorRow][i % 8] = createChecker(("red" + redCount), "red", ((floorRow * 50) + 15) + "px", (Math.floor((i % 8)/2) * 100 + 15) + "px");
        redCount++;
      }
      else {
        occupiedArray[floorRow][i % 8] = null;
      }
    }
    else {
      occupiedArray[floorRow][i % 8] = null;
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
  if (color == "red") {
    image.src = "images/red_checker.png";
    image.alt = "Red";
    image.className = "red";
  }
  else if (color == "black"){
    image.src = "images/black_checker.png";
    image.alt = "Black";
    image.className = "black";
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
    if (document.getElementById(checkerId).classList.contains("black")) {
      document.getElementById(checkerId).src = "images/black_king.png";
    } else {
      document.getElementById(checkerId).src = "images/red_king.png";
    }
    document.getElementById(checkerId).classList.add("king");
  }
}

function isLegalMove(row, col, checkerId, color) {
  var jumpList = jumpExists(color);
  // Check to see if the source checker being moved is the correct color
  if (hasOppositeChecker(srcRow, srcCol, color)) {
    return false;
  }
  // If there was a previous jump this turn and another jump is available only
  // the jumping piece can continue moving
  if (!((row % 2 == 0) && (col % 2 == 1)) && !(row % 2 == 1) && (col % 2 == 0)) {
    return false;
  }
  if (!cellIsVacant(row, col)) {
    return false;
  }
  if ((currentCheckerId != null) && (checkerId != currentCheckerId)) {
    return false;
  }
  if (!((Math.abs(srcCol - col) == 1) && (Math.abs(srcRow - row) == 1)) && !((Math.abs(srcCol - col) == 2) && (Math.abs(srcRow - row) == 2))) {
    return false;
  }
  if (canJump(srcRow, srcCol)) {
    if (occupiedArray[row + (srcRow - row)/2][col + (srcCol - col)/2] == null) {
        return false;
    }
  }
  if (jumpList.length > 0) {
    for (var i = 0; i < jumpList.length; i++) {
      if (!jumpList.includes(checkerId)) {
        return false;
      }
    }
  }
  if (!(isAKing(checkerId))) {
    if ((((srcRow - row) == -1) || ((srcRow - row) == -2)) && (document.getElementById(checkerId).classList.contains("black"))) {
      return true;
    }
    else if ((((srcRow - row) == 1) || ((srcRow - row) == 2)) && (document.getElementById(checkerId).classList.contains("red"))) {
      return true;
    }
    else {
      return false;
    }
  }
  return true;
}

function canMove(row, col) {
  if (!hasOppositeChecker(row, col, currentColor)) {
    if (isAKing(occupiedArray[row][col].id)) {
      if (!cellIsVacant(row + 1, col + 1)) {
        return false;
      }
      if (!cellIsVacant(row + 1, col - 1)) {
        return false;
      }
      if (!cellIsVacant(row - 1, col + 1)) {
        return false;
      }
      if (!cellIsVacant(row - 1, col - 1)) {
        return false;
      }
    }
    else if (occupiedArray[row][col].classList.contains("black")) {
      if (!cellIsVacant(row - 1, col - 1)) {
        return false;
      }
      if (!cellIsVacant(row - 1, col + 1)) {
        return false;
      }
    }
    else if (occupiedArray[row][col].classList.contains("red")) {
      if (!cellIsVacant(row + 1, col - 1)) {
        return false;
      }
      if (!cellIsVacant(row + 1, col + 1)) {
        return false;
      }
    }
    return true;
  }
}

function canJump(row, col) {
  // true if cell is occupied, if a king check if in one of four directions the next checker is the opposite color and the next cell after that is empty...
  if (isAKing(occupiedArray[row][col].id)) {
    if (cellIsVacant(row + 2, col + 2) && (hasOppositeChecker(row + 1, col + 1, currentColor))) {
      return true;
    }
    if (cellIsVacant(row + 2, col - 2) && (hasOppositeChecker(row + 1, col - 1, currentColor))) {
      return true;
    }
    if (cellIsVacant(row - 2, col + 2) && (hasOppositeChecker(row - 1, col + 1, currentColor))) {
      return true;
    }
    if (cellIsVacant(row - 2, col - 2) && (hasOppositeChecker(row - 1, col - 1, currentColor))) {
      return true;
    }
  }
  else if (occupiedArray[row][col].classList.contains("red")) {
    if (cellIsVacant(row - 2, col + 2) && (hasOppositeChecker(row - 1, col + 1, currentColor))) {
      return true;
    }
    if (cellIsVacant(row - 2, col - 2) && (hasOppositeChecker(row - 1, col - 1, currentColor))) {
      return true;
    }
  }
  else if (occupiedArray[row][col].classList.contains("black")) {
    if (cellIsVacant(row + 2, col + 2) && (hasOppositeChecker(row + 1, col + 1, currentColor))) {
      return true;
    }
    if (cellIsVacant(row + 2, col - 2) && (hasOppositeChecker(row + 1, col - 1, currentColor))) {
      return true;
    }
  }
  return false;
}

function makeSimpleMove(destRow, destCol, checkerId) {
  placeChecker(destRow, destCol, checkerId);
  occupiedArray[destRow][destCol] = occupiedArray[srcRow][srcCol];
  occupiedArray[srcRow][srcCol] = null;
  if (document.getElementById(checkerId).classList.contains("black")) {
    currentColor = "red";
  }
  else {
    currentColor = "black";
  }
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
  var winner = checkForWinner();
  if (winner != null) {
    document.getElementById("currentPlayer").innerHTML = winner + " wins!";
  }
}

function makeJumpMove(destRow, destCol, checkerId, color) {
  placeChecker(destRow, destCol, checkerId);
  var jumpedId = occupiedArray[destRow + (srcRow - destRow)/2][destCol + (srcCol - destCol)/2].id;
  document.getElementById(jumpedId).style.display = "none";
  occupiedArray[destRow][destCol] = occupiedArray[srcRow][srcCol];
  occupiedArray[destRow + (srcRow - destRow)/2][destCol + (srcCol - destCol)/2] = null;
  occupiedArray[srcRow][srcCol] = null;
  if (currentCheckerId == null) {
    currentCheckerId = checkerId;
  }
  var jumpList = jumpExists(color);
  if (jumpList.length == 0) {
    if (document.getElementById(checkerId).classList.contains("black")) {
      currentColor = "red";
    }
    else {
      currentColor = "black";
    }
    document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
    currentCheckerId = null;
  }
  var winner = checkForWinner();
  if (winner != null) {
    document.getElementById("currentPlayer").innerHTML = winner + " wins!";
  }
}

function checkAdjacent(row, col, checkerId, color) {
  if ((currentCheckerId != null) && (checkerId != currentCheckerId)) {
    return false;
  }
  if (isAKing(checkerId)) {
    if (!outOfBounds(row + 2, col + 2) && (!cellIsVacant(row + 1, col + 1)) && (cellIsVacant(row + 2, col + 2))) {
      var adjacentId = occupiedArray[row + 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
    }
    if (!outOfBounds(row + 2, col - 2) && (!cellIsVacant(row + 1, col - 1)) && (cellIsVacant(row + 2, col - 2))) {
      var adjacentId = occupiedArray[row + 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
    }
    if (!outOfBounds(row - 2, col - 2) && (!cellIsVacant(row - 1, col - 1)) && (cellIsVacant(row - 2, col - 2))) {
      var adjacentId = occupiedArray[row - 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
    }
    if (!outOfBounds(row - 2, col + 2) && (!cellIsVacant(row - 1, col + 1)) && (cellIsVacant(row - 2, col + 2))) {
      var adjacentId = occupiedArray[row - 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("black") && (color == "red")) {
        return true;
      }
      else if (document.getElementById(adjacentId).classList.contains("red") && (color == "black")) {
        return true;
      }
    }
  }
  if (document.getElementById(checkerId).classList.contains("black")) {
    if (!outOfBounds(row + 2, col - 2) && (!cellIsVacant(row + 1, col - 1)) && (cellIsVacant(row + 2, col - 2))) {
      var adjacentId = occupiedArray[row + 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("red")) {
        return true;
      }
    }
    if (!outOfBounds(row + 2, col + 2) && (!cellIsVacant(row + 1, col + 1)) && (cellIsVacant(row + 2, col + 2))) {
      var adjacentId = occupiedArray[row + 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("red")) {
        return true;
      }
    }
  }
  if (document.getElementById(checkerId).classList.contains("red")) {
    if (!outOfBounds(row - 2, col + 2) && (!cellIsVacant(row - 1, col + 1)) && (cellIsVacant(row - 2, col + 2))) {
      var adjacentId = occupiedArray[row - 1][col + 1].id;
      if (document.getElementById(adjacentId).classList.contains("black")) {
        return true;
      }
    }
    if (!outOfBounds(row - 2, col - 2) && (!cellIsVacant(row - 1, col - 1)) && (cellIsVacant(row - 2, col - 2))) {
      var adjacentId = occupiedArray[row - 1][col - 1].id;
      if (document.getElementById(adjacentId).classList.contains("black")) {
        return true;
      }
    }
  }
  return false;
}

function jumpExists(color) {
  var jumpList = [];
  for (var i = 0; i < occupiedArray.length; i++) {
    for (var j = 0; j < occupiedArray[i].length; j++) {
      if (!cellIsVacant(i, j)) {
        if (checkAdjacent(i, j, occupiedArray[i][j].id, color) && (occupiedArray[i][j].classList.contains(color))) {
          if (currentCheckerId == null) {
            jumpList.push(occupiedArray[i][j].id);
          }
          else if (currentCheckerId == occupiedArray[i][j].id) {
            jumpList.push(occupiedArray[i][j].id);
          }
        }
      }
    }
  }
  return jumpList;
}

function checkForWinner() {
  var blackCount = 0;
  var redCount = 0;
  for (var i = 0; i < occupiedArray.length; i++) {
    for (var j = 0; j < occupiedArray[i].length; j++) {
      if (!cellIsVacant(i, j)) {
        if (occupiedArray[i][j].classList.contains("black")) {
          blackCount++;
        }
        else if (occupiedArray[i][j].classList.contains("red")) {
          redCount++;
        }
      }
    }
  }
  if (blackCount == 0) {
    return "Red";
  }
  else if (redCount == 0)
  {
    return "Black";
  }
  else {
    return null;
  }
}

function hasOppositeChecker(row, col, color) {
  if ((row > 7) || (row < 0) || (col > 7) || (col < 0) || (occupiedArray[row][col] == null) || (occupiedArray[row][col].classList.contains(color))) {
    return false;
  }
  return true;
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
  if ((row < 0) || (row > 7)) {
    return true;
  }
  else if ((col < 0) || (col > 7)) {
    return true;
  }
  return false;
}

function isAKing(checkerId) {
  return document.getElementById(checkerId).classList.contains("king");
}

function placeChecker(row, col, checkerId) {
  document.getElementById(checkerId).style.top = (row * 50 + 15) + "px";
  document.getElementById(checkerId).style.left = (col * 50 + 15) + "px";
}
