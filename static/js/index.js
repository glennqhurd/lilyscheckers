var srcCol = 0;
var srcRow = 0;
var currentColor = "black";
var currentCheckerId = null;
// occupiedArray stores an 8x8 array that represents each board and whether or not it has a checker piece, each index is based off of Math.floor((y - 7) / 50) and Math.floor((x - 7) / 50)
var occupiedArray = new Array(8);
for (var i = 0; i < 8; i++) {
  occupiedArray[i] = [];
}
var checkerArray = new Array(48);
var clickedCheckerId = null;
document.getElementById("setButton").onclick = setUpBoard;
document.getElementById("resetButton").onclick = resetBoard;
document.getElementById("promptButton").onclick = getComputersMove;
document.getElementById("promptButton").disabled = true;
document.getElementById("checkerboard").onclick = boardClick;
document.getElementById("redCBox").onclick = toggleMoveButton;
document.getElementById("blackCBox").onclick = toggleMoveButton;
//document.getElementById("checkerboard").ondrop = drop;
//document.getElementById("checkerboard").ondragover=allowDrop;

function toggleMoveButton() {
  if(document.getElementById("redCBox").checked && currentColor == "red") {
    document.getElementById("promptButton").disabled = false;
  }
  else if(document.getElementById("blackCBox").checked && currentColor == "black") {
    document.getElementById("promptButton").disabled = false;
  }
  else {
    document.getElementById("promptButton").disabled = true;
  }
}

function clearSpaces() {
  var canvas = document.getElementById("checkerboard");
  var context2D = canvas.getContext("2d");

  for (var boardRow = 0; boardRow < 8; boardRow++) {
    for (var boardCol = 0; boardCol < 8; boardCol++) {
      // coordinates of the top-left corner
	  var x = boardCol * 50;
	  var y = boardRow * 50;
      if ((boardRow + boardCol) % 2 == 1) {
	    context2D.fillStyle = "SeaGreen";
	    context2D.fillRect(x, y, 50, 50);
	  }
    }
  }

  context2D.fillStyle = "Gray";
}

function highlightSpaces(checkerId) {
  var canvas = document.getElementById("checkerboard");
  var context2D = canvas.getContext("2d");

  for (var boardRow = 0; boardRow < 8; boardRow++) {
    for (var boardCol = 0; boardCol < 8; boardCol++) {
      // coordinates of the top-left corner
	  var x = boardCol * 50;
	  var y = boardRow * 50;
      if ((boardRow + boardCol) % 2 == 1) {
	    context2D.fillStyle = "SeaGreen";
	    context2D.fillRect(x, y, 50, 50);
	  }
    }
  }

  context2D.fillStyle = "Gray";

  if(isLegalMove(srcRow - 1, srcCol - 1, checkerId, currentColor)) {
    context2D.fillRect((srcCol - 1) * 50, (srcRow - 1) * 50, 50, 50);
  }
  else if(isLegalMove(srcRow - 2, srcCol - 2, checkerId, currentColor)) {
    context2D.fillRect((srcCol - 2) * 50, (srcRow - 2) * 50, 50, 50);
  }
  if(isLegalMove(srcRow - 1, srcCol + 1, checkerId, currentColor)) {
    context2D.fillRect((srcCol + 1) * 50, (srcRow - 1) * 50, 50, 50);
  }
  else if(isLegalMove(srcRow - 2, srcCol + 2, checkerId, currentColor)) {
    context2D.fillRect((srcCol + 2) * 50, (srcRow - 2) * 50, 50, 50);
  }
  if(isLegalMove(srcRow + 1, srcCol - 1, checkerId, currentColor)) {
    context2D.fillRect((srcCol - 1) * 50, (srcRow + 1) * 50, 50, 50);
  }
  else if(isLegalMove(srcRow + 2, srcCol - 2, checkerId, currentColor)) {
    context2D.fillRect((srcCol - 2) * 50, (srcRow + 2) * 50, 50, 50);
  }
  if(isLegalMove(srcRow + 1, srcCol + 1, checkerId, currentColor)) {
    context2D.fillRect((srcCol + 1) * 50, (srcRow + 1) * 50, 50, 50);
  }
  else if(isLegalMove(srcRow + 2, srcCol + 2, checkerId, currentColor)) {
    context2D.fillRect((srcCol + 2) * 50, (srcRow + 2) * 50, 50, 50);
  }
}

function getComputersMove() {
  var boardString = document.getElementById("boardInput").value;
  if (boardString && !checkForWinner()) {
    var xhttp = new XMLHttpRequest();
    document.getElementById("forcedJump").innerHTML = "Computer's turn.";
    xhttp.onreadystatechange = function() {
      document.getElementById("promptButton").disabled = true;
      if (this.readyState == 4 && this.status == 200) {
        console.log("entered if");
        document.getElementById("boardInput").value = this.responseText;
        setUpBoard();
        toggleMoveButton();
        //document.getElementById("promptButton").disabled = false;
        clearJumpClasses();

        document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
        if ((currentColor == "black") && (document.getElementById("blackCBox").checked == true)) {
          getComputersMove();
        }
        else if ((currentColor == "red") && (document.getElementById("redCBox").checked == true)) {
          getComputersMove();
        }
        else {
          if(jumpExists(currentColor).length > 0) {
            document.getElementById("forcedJump").innerHTML = currentColor + " has at least one jump available.";
          }
          else {
            document.getElementById("forcedJump").innerHTML = "No forced jumps.";
          }
        }
        var winner = checkForWinner();
      }
    };
    xhttp.open("GET", "checkers/" + boardString, true);
    //xhttp.open("GET", "http://www.hurd-sullivan.com/checkers/black/" + boardString, true);
    xhttp.send();
  }
}

function populateCheckersArray() {
  var blackCount = 1;
  var redCount = 1;
  var blackKingCount = 1;
  var redKingCount = 1;
  for(var i = 0; i < checkerArray.length; i++) {
    if (i < 12) {
      checkerArray[i] = createChecker(("black" + blackCount), "black");
      blackCount++;
    }
    else if (i < 24) {
      checkerArray[i] = createChecker(("red" + redCount), "red");
      redCount++;
    }
    else if (i < 36) {
      checkerArray[i] = createChecker(("bking" + blackKingCount), "bking");
      blackKingCount++;
      checkerArray[i].style.display = "none";
    }
    else {
      checkerArray[i] = createChecker(("rking" + redKingCount), "rking");
      redKingCount++;
      checkerArray[i].style.display = "none";
    }
    checkerArray[i].onclick = checkerClick;
  }
}

function setUpBoard() {
  var checkerIndex = 0;
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
  for(var i = checkerIndex; i < 48; i++) {
    checkerArray[i].style.display = "none";
  }
  var boardString = document.getElementById("boardInput").value;
  loadBoard(boardString);
  var winner = checkForWinner();
  if (boardString[0] == "b") {
    currentColor = "black";
  }
  else {
    currentColor = "red";
  }
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
  console.log(occupiedArray);
  console.log(checkerArray);
}

function resetBoard() {
  var checkerIndex = 0;
  currentColor = "black";
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
  for(var i = checkerIndex; i < 48; i++) {
    checkerArray[i].style.display = "none";
    if(checkerArray[i].classList.contains("jumpAvailable")) {
      checkerArray[i].classList.remove("jumpAvailable");
    }
  }
  var boardString = "b:bbbbbbbbbbbb--------rrrrrrrrrrrr";
  document.getElementById("boardInput").value = boardString;
  loadBoard(boardString);
  document.getElementById("blackCBox").checked == false;
  document.getElementById("redCBox").checked == false;
  document.getElementById("forcedJump").innerHTML = "No forced jumps.";
  document.getElementById("promptButton").disabled = true;
}

function getBoard() {
  var boardString = "";

  if (currentColor == "black") {
    boardString += "b:";
  }
  else {
    boardString += "r:";
  }

  for(var i = 0; i < 64; i++) {
    var floorRow = Math.floor(i/8);
    if (((floorRow % 2 == 0) && (i % 2 == 1)) || ((floorRow % 2 == 1) && (i % 2 == 0))) {
      if (occupiedArray[floorRow][i % 8] == null) {
          boardString += "-";
      }
      else if (occupiedArray[floorRow][i % 8].classList.contains("red")) {
        if (occupiedArray[floorRow][i % 8].classList.contains("king")) {
          boardString += "R";
        }
        else {
          boardString += "r";
        }
      }
      else {
        if (occupiedArray[floorRow][i % 8].classList.contains("king")) {
          boardString += "B";
        }
        else {
          boardString += "b";
        }
      }
    }
  }
  console.log(boardString);
  return boardString;
}

function loadBoard(boardString) {
  if (boardString.length != 34) {
    return false;
  }

  if(((boardString.charAt(0) != "b") || (boardString.charAt(0) != "r")) && (boardString.charAt(1) != ":")) {
    return false;
  }

  for (var i = 2; i < boardString.length; i++) {
    if ((boardString.charAt(i) != "b") && (boardString.charAt(i) != "r") && (boardString.charAt(i) != "B") && (boardString.charAt(i) != "R") && (boardString.charAt(i) != "-")) {
      return false;
    }
  }
  var blackCount = 1;
  var redCount = 1;
  var blackKingCount = 1;
  var redKingCount = 1;
  hideAll();
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      occupiedArray[i][j] = null;
    }
  }

  if (boardString.charAt(0) == "b") {
    currentColor = "black";
  }
  else {
    currentColor = "red";
  }

  for (var i = 2; i < boardString.length; i++) {
    var floorRow = Math.floor((i - 2)/4);
    var floorCol = ((i - 2) % 4);

    if (boardString.charAt(i) == "b") {
      var checkerId = "black" + blackCount;
      blackCount++;
    }
    else if (boardString.charAt(i) == "r") {
      var checkerId = "red" + redCount;
      redCount++;
    }
    else if (boardString.charAt(i) == "B") {
      var checkerId = "bking" + blackKingCount;
      blackKingCount++;
    }
    else if (boardString.charAt(i) == "R") {
      var checkerId = "rking" + redKingCount;
      redKingCount++;
    }
    else {
      var checkerId = null;
    }
    if ((floorRow % 2 == 0) && (checkerId != null)) {
      occupiedArray[floorRow][floorCol * 2 + 1] = document.getElementById(checkerId);
      placeInitialChecker(floorRow, floorCol, checkerId, 50);
      document.getElementById(checkerId).style.display = "initial";
    }
    else if ((floorRow % 2 == 1) && (checkerId != null)) {
      occupiedArray[floorRow][floorCol * 2] = document.getElementById(checkerId);
      placeInitialChecker(floorRow, floorCol, checkerId, 0);
      document.getElementById(checkerId).style.display = "initial";
    }
  }
  toggleMoveButton();
  return true;
}

function hideAll() {
  for (i = 0; i < checkerArray.length; i++) {
    checkerArray[i].style.display = "none";
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
  populateCheckersArray();
  setUpBoard();
  var temp = getBoard();
};

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  var checkerId = event.target.id;
  event.dataTransfer.setData("Text", checkerId);

  srcCol = Math.floor((event.pageX - 7 - document.getElementById(checkerId).parentElement.offsetLeft) / 50);
  srcRow = Math.floor((event.pageY - 7 - document.getElementById(checkerId).parentElement.offsetTop) / 50);

  if(canMove(srcRow, srcCol)) {
    document.getElementById(checkerId).setAttribute("draggable", true);
  }
  else {
    document.getElementById(checkerId).setAttribute("draggable", false);
  }

  highlightSpaces(event.target.id);
}

function drop(event) {
  clearSpaces();
  var checkerId = event.dataTransfer.getData("Text");
  var destRow = Math.floor((event.pageY - 7 - document.getElementById(checkerId).parentElement.offsetTop) / 50);
  var destCol = Math.floor((event.pageX - 7 - document.getElementById(checkerId).parentElement.offsetLeft) / 50);
  if (isLegalMove(destRow, destCol, checkerId, currentColor)) {
    event.preventDefault();
    if (Math.abs(destRow - srcRow) == 1) {
      makeSimpleMove(destRow, destCol, checkerId);
    }
    else if (Math.abs(destRow - srcRow) == 2) {
      makeJumpMove(destRow, destCol, checkerId, currentColor);
    }
    if (((destRow == 7) || (destRow == 0)) && (!isAKing(checkerId))) {
      kingAPiece(destRow, destCol, checkerId);
    }
    var winner = checkForWinner();
    document.getElementById("boardInput").value = getBoard();
    if (findIfChecked()) {
      getComputersMove();
    }
  }

  clickedCheckerId = null;
}

function checkerClick(event) {
  clickedCheckerId = event.target.id;
  srcCol = Math.floor((event.pageX - document.getElementById(clickedCheckerId).parentElement.offsetLeft) / 50);
  srcRow = Math.floor((event.pageY - document.getElementById(clickedCheckerId).parentElement.offsetTop) / 50);

  highlightSpaces(clickedCheckerId);
}

function boardClick(event) {
  clearSpaces();
  var destCol = Math.floor((event.pageX - document.getElementById(clickedCheckerId).parentElement.offsetLeft) / 50);
  var destRow = Math.floor((event.pageY - document.getElementById(clickedCheckerId).parentElement.offsetTop) / 50);
  if ((clickedCheckerId != null) && isLegalMove(destRow, destCol, clickedCheckerId, currentColor)) {
    event.preventDefault();
    if (Math.abs(destRow - srcRow) == 1) {
      makeSimpleMove(destRow, destCol, clickedCheckerId);
    }
    else if (Math.abs(destRow - srcRow) == 2) {
      makeJumpMove(destRow, destCol, clickedCheckerId, currentColor);
    }
    if (((destRow == 7) || (destRow == 0)) && (!isAKing(clickedCheckerId))) {
      kingAPiece(destRow, destCol, clickedCheckerId);
    }
    var winner = checkForWinner();
    document.getElementById("boardInput").value = getBoard();
    if (findIfChecked()) {
      getComputersMove();
    }
  }

  clickedCheckerId = null;
}

function createChecker(id, color) {
  var image = document.createElement("IMG");
  image.id = id;
  if (color == "red") {
    image.src = "images/red_checker.png";
    image.alt = "Red";
    image.classList.add("red", "checker");
  }
  else if (color == "black"){
    image.src = "images/black_checker.png";
    image.alt = "Black";
    image.classList.add("black", "checker");
  }
  else if (color == "rking") {
    image.src = "images/red_king.png";
    image.alt = "RedKing";
    image.classList.add("red", "king", "checker");
  }
  else if (color == "bking") {
    image.src = "images/black_king.png";
    image.alt = "BlackKing";
    image.classList.add("black", "king", "checker");
  }
  document.getElementById("boardset").appendChild(image);
  image.addEventListener("dragstart", drag);
  image.style.position = "absolute";
  return image;
}

function kingAPiece(row, col, checkerId) {
  if (!document.getElementById(checkerId).classList.contains("king")) {
    var index = findCheckerIndex(checkerId);
    document.getElementById(checkerId).style.display = "none";
    occupiedArray[row][col] = checkerArray[index + 24];
    occupiedArray[row][col].style.display = "initial";
    placeChecker(row, col, occupiedArray[row][col].id);
  }
}

function isLegalMove(row, col, checkerId, color) {
  var jumpList = jumpExists(color);
  // Check to see if the source checker being moved is the correct color
  if (hasOppositeChecker(srcRow, srcCol, color)) {
    return false;
  }
  // Check to see if there's currently a winner already (For use in the click event)
  if (checkForWinner()) {
    return false;
  }
  // If there was a previous jump this turn and another jump is available only
  // the jumping piece can continue moving
  if (jumpList.length > 0) {
    if (!jumpList.includes(checkerId)) {
      return false;
    }
  }
  if (!((row % 2 == 0) && (col % 2 == 1)) && !((row % 2 == 1) && (col % 2 == 0))) {
    return false;
  }
  if (!cellIsVacant(row, col)) {
    return false;
  }
  if (Math.abs(srcRow - row) == 1) {
    if (jumpList.length > 0) {
      return false;
    }
    if (!canMove(srcRow, srcCol) && (Math.abs(srcRow - row) == 1)) {
      return false;
    }
    if (currentColor == "black" && ((srcRow - row) > 0) && !isAKing(checkerId)) {
      return false;
    }
    if (currentColor == "red" && ((srcRow - row) < 0) && !isAKing(checkerId)) {
      return false;
    }
  }
  if (!canJump(srcRow, srcCol) && (Math.abs(srcRow - row) == 2)) {
    return false;
  }
  if (canJump(srcRow, srcCol) && !hasOppositeChecker((row + (srcRow - row)/2), (col + (srcCol - col)/2), currentColor)) {
    return false;
  }
  return true;
}

function canMove(row, col) {
  if (!hasOppositeChecker(row, col, currentColor)) {
    if (isAKing(occupiedArray[row][col].id)) {
      if (!cellIsVacant(row + 1, col + 1) && !cellIsVacant(row + 1, col - 1) && !cellIsVacant(row - 1, col + 1) && !cellIsVacant(row - 1, col - 1)) {
        return false;
      }
    }
    else if (occupiedArray[row][col].classList.contains("black")) {
      if (!cellIsVacant(row + 1, col - 1) && !cellIsVacant(row + 1, col + 1)) {
        return false;
      }
    }
    else if (occupiedArray[row][col].classList.contains("red")) {
      if (!cellIsVacant(row - 1, col - 1) && !cellIsVacant(row - 1, col + 1)) {
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
  placeChecker(destRow, destCol, checkerId, 0);
  occupiedArray[destRow][destCol] = occupiedArray[srcRow][srcCol];
  occupiedArray[srcRow][srcCol] = null;
  if (document.getElementById(checkerId).classList.contains("black")) {
    currentColor = "red";
  }
  else {
    currentColor = "black";
  }
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
  if(jumpExists(currentColor).length > 0) {
    document.getElementById("forcedJump").innerHTML = currentColor + " has at least one jump available.";
  }
  else {
    document.getElementById("forcedJump").innerHTML = "No forced jumps.";
  }
  toggleMoveButton();
}

function makeJumpMove(destRow, destCol, checkerId, color) {
  placeChecker(destRow, destCol, checkerId, 0);
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
    clearJumpClasses();
  }
  if(jumpExists(currentColor).length > 0) {
    document.getElementById("forcedJump").innerHTML = currentColor + " has at least one jump available.";
  }
  else {
    document.getElementById("forcedJump").innerHTML = "No forced jumps.";
  }
  toggleMoveButton();
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
            occupiedArray[i][j].classList.add("jumpAvailable");
          }
          else if (currentCheckerId == occupiedArray[i][j].id) {
            jumpList.push(occupiedArray[i][j].id);
            occupiedArray[i][j].classList.add("jumpAvailable");
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
    document.getElementById("currentPlayer").innerHTML = "Red wins!";
    return true;
  }
  else if (redCount == 0)
  {
    document.getElementById("currentPlayer").innerHTML = "Black wins!";
    return true;
  }
  return false;
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

function placeInitialChecker(row, col, checkerId, boardOffset) {
  document.getElementById(checkerId).style.top = (row * 50) + 7 + "px";
  document.getElementById(checkerId).style.left = (col * 100 + 7 + boardOffset) + "px";
}

function placeChecker(row, col, checkerId) {
  document.getElementById(checkerId).style.top = (row * 50 + 7) + "px";
  document.getElementById(checkerId).style.left = (col * 50 + 7) + "px";
}

function findCheckerIndex(checkerId) {
  for(var i = 0; i < checkerArray.length; i++) {
    if(checkerArray[i].id === checkerId) {
      return i;
    }
  }
  return -1;
}

function findIfChecked() {
  if ((currentColor == "black") && (document.getElementById("blackCBox").checked == true)) {
    return true;
  }
  else if ((currentColor == "red") && (document.getElementById("redCBox").checked == true)) {
    return true;
  }
  return false;
}

function clearJumpClasses() {
  for(var i = 0; i < checkerArray.length; i++) {
    if(checkerArray[i].classList.contains("jumpAvailable")) {
      checkerArray[i].classList.remove("jumpAvailable");
    }
  }
}