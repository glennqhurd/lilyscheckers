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
var savedBoard = "";
var turnCounter = 1;
var hasMoved = false;
var select = document.getElementById("gameNumbers");
var move_dict = {
  "B8" : 1,
  "D8" : 2,
  "F8" : 3,
  "H8" : 4,
  "A7" : 5,
  "C7" : 6,
  "E7" : 7,
  "G7" : 8,
  "B6" : 9,
  "D6" : 10,
  "F6" : 11,
  "H6" : 12,
  "A5" : 13,
  "C5" : 14,
  "E5" : 15,
  "G5" : 16,
  "B4" : 17,
  "D4" : 18,
  "F4" : 19,
  "H4" : 20,
  "A3" : 21,
  "C3" : 22,
  "E3" : 23,
  "G3" : 24,
  "B2" : 25,
  "D2" : 26,
  "F2" : 27,
  "H2" : 28,
  "A1" : 29,
  "C1" : 30,
  "E1" : 31,
  "G1" : 32
}
select.options[select.options.length] = new Option('Numbers', null);
document.getElementById("setButton").onclick = setUpBoard;
document.getElementById("resetButton").onclick = resetBoard;
document.getElementById("promptButton").onclick = getComputersMove;
document.getElementById("promptButton").disabled = true;
document.getElementById("checkerboard").onclick = boardClick;
document.getElementById("redCBox").onclick = toggleMoveButton;
document.getElementById("blackCBox").onclick = toggleMoveButton;
document.getElementById("sendButton").onclick = sendCheckersEmail;
document.getElementById("matchByNumberButton").onclick = loadGameFromEmail;
document.getElementById("matchByNumberButton").disabled = true;
document.getElementById("findNumbersButton").onclick = findGameNumbers;
document.getElementById("findNumbersButton").disabled = true;
document.getElementById("sendButton").disabled = true;
document.getElementById("emailCBox").onclick = toggleEmailMode;
//document.getElementById("checkerboard").ondrop = drop;
//document.getElementById("checkerboard").ondragover=allowDrop;

function toggleEmailMode() {
  if (document.getElementById("emailCBox").checked) {
    document.getElementById("setButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
    document.getElementById("promptButton").disabled = true;
    document.getElementById("redCBox").disabled = true;
    document.getElementById("blackCBox").disabled = true;
    document.getElementById("sendButton").disabled = true;
    document.getElementById("matchByNumberButton").disabled = true;
    document.getElementById("findNumbersButton").disabled = false;
  }
  else {
    document.getElementById("setButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    document.getElementById("promptButton").disabled = false;
    document.getElementById("redCBox").disabled = false;
    document.getElementById("blackCBox").disabled = false;
    document.getElementById("sendButton").disabled = true;
    document.getElementById("matchByNumberButton").disabled = true;
    document.getElementById("findNumbersButton").disabled = true;
  }
}

/**
 * function that disables/enables the promptButton object based on
 * whether a computer player is selected that matches the current color
 */
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

  if (document.getElementById("emailCBox").checked && !hasMoved) {
    document.getElementById("sendButton").disabled = false;
    hasMoved = true;
  }
  else {
    document.getElementById("sendButton").disabled = true;
  }
}

/**
 * recolors the spaces on the board to their default color
 */
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

/**
 * changes the color of specific spaces based on what moves are valid for the
 * checker represented by checkerId
 */
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

/**
 * when called requests the Python AI in flask to generate a move based on the
 * current player.  Will wait until the program is done thinking then make changes
 */
function getComputersMove() {
  var boardString = combineIntoURL();
  if (boardString && !checkForWinner() && validDifficulty()) {
    var xhttp = new XMLHttpRequest();
    document.getElementById("forcedJump").innerHTML = "Computer's turn.";
    xhttp.onreadystatechange = function() {
      document.getElementById("promptButton").disabled = true;
      if (this.readyState == 4 && this.status == 200) {
        console.log("entered if");
        var previousBoard = getBoard();
        document.getElementById("boardInput").value = this.responseText;
        setUpBoard();
        moveString(previousBoard, getBoard(), "computer");
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
    xhttp.open("GET", boardString, true);
    xhttp.send();
  }
}

function validDifficulty() {
  if((document.getElementById('difficultySetting').value >= 1) && (document.getElementById('difficultySetting').value <= 10)) {
    return true;
  }
  else {
    return false;
  }
}

function combineIntoURL() {
  var boardString = getBoard();
  var difficulty = document.getElementById('difficultySetting').value;
  var player = boardString[0];
  var board = boardString.slice(2);
  console.log('player=' + player + '&board=' + board + '&difficulty=' + difficulty)
  return 'checkers?player=' + player + '&board=' + board + '&difficulty=' + difficulty;
}

/**
 * When called sends an email to pbmserv@gamerz.net to update the current game
 */
function sendCheckersEmail() {
  if (checkSendInfo()) {
    var xhttp = new XMLHttpRequest();
    document.getElementById("sendButton").disabled = true;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("emailErrorLog").innerHTML = "Message sent successfully.";
        document.getElementById("sendButton").disabled = false;
      }
    };
    var e = document.getElementById("gameNumbers");
    var gameNumber = parseInt(e.options[e.selectedIndex].text);
    var user = document.getElementById("userName").value;
    var password = document.getElementById("emailPassword").value;
    var move = document.getElementById("moveRecord").innerHTML;

    xhttp.open("GET", "send_email?board_number=" + gameNumber + "&user=" + user + "&password=" + password + "&move=" + move, true);
    xhttp.send();
  }
}

function loadGameFromEmail() {
  var e = document.getElementById("gameNumbers");
  var gameNumber = parseInt(e.options[e.selectedIndex].text);
  if (Number.isInteger(gameNumber)) {
    var xhttp = new XMLHttpRequest();
    document.getElementById("matchByNumberButton").disabled = true;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("boardInput").value = this.responseText;
        setBoard(this.responseText);
        document.getElementById("emailErrorLog").innerHTML = this.responseText;
        document.getElementById("matchByNumberButton").disabled = false;
        hasMoved = false;
      }
    };

    xhttp.open("GET", "retrieve_board_string/" + gameNumber, true);
    xhttp.send();
  }
  else {
    document.getElementById("emailErrorLog").innerHTML = "Game number selected needs to be an int."
  }
}

function checkSendInfo() {
  if (document.getElementById("userName").value == "") {
    document.getElementById("emailErrorLog").innerHTML = "Invalid user name.";
    return false;
  }
  if (document.getElementById("emailPassword").value == "") {
    document.getElementById("emailErrorLog").innerHTML = "Invalid email password.";
    return false;
  }
  /*if (document.getElementById("makeMove").value == "") {
    document.getElementById("emailErrorLog").innerHTML = "Invalid move.";
    return false;
  }*/
  return true;
}

function findGameNumbers() {
  if (document.getElementById("userName").value != "") {
    var xhttp = new XMLHttpRequest();
    document.getElementById("findNumbersButton").disabled = true;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("emailErrorLog").innerHTML = "Game numbers loaded.";
        document.getElementById("findNumbersButton").disabled = false;
        var gameDict = JSON.parse(this.responseText);
        while (select.length > 0) {
            select.remove(select.length-1);
        }
        if (gameDict != 0) {
            for(key in gameDict) {
              select.options[select.options.length] = new Option(gameDict[key], gameDict[key]);
            }
            document.getElementById("matchByNumberButton").disabled = false;
            document.getElementById("sendButton").disabled = true;
        }
        else {
            select.options[0] = new Option('Error', 'Error');
        }
      }
    };

    var user = document.getElementById("userName").value;

    xhttp.open("GET", "read_numbers/" + user, true);
    xhttp.send();
  }
}

/**
 * Called at the start of the program to initialize the lists of checker objects
 * including both regular and king checkers.
 */
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

/**
 * Function that is called when the button setButton gets pressed.  Sets checker
 * visibility to hidden for all checkers then uses setBoard to arrange the board
 * so that it matches the string in the entry field.
 */
function setUpBoard() {
  var checkerIndex = 0;
  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;
  for(var i = checkerIndex; i < 48; i++) {
    checkerArray[i].style.display = "none";
    if(checkerArray[i].classList.contains("jumpAvailable")) {
      checkerArray[i].classList.remove("jumpAvailable");
    }
  }
  var boardString = document.getElementById("boardInput").value;
  setBoard(boardString);
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

/**
 * Like setUpBoard() but is used to return the board to the state it is at when
 * the page is refreshed.
 */
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
  setBoard(boardString);
  document.getElementById("boardInput").value = boardString;
  document.getElementById("blackCBox").checked = false;
  document.getElementById("redCBox").checked = false;
  document.getElementById("forcedJump").innerHTML = "No forced jumps.";
  document.getElementById("promptButton").disabled = true;
  turnCounter = 1;
  while(document.getElementById("gameRecord").rows.length > 1) {
    document.getElementById("gameRecord").deleteRow(-1);
  }
}

function clearBoard() {
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
  //document.getElementById("blackCBox").checked = false;
  //document.getElementById("redCBox").checked = false;
  document.getElementById("forcedJump").innerHTML = "No forced jumps.";
  document.getElementById("promptButton").disabled = true;
  //turnCounter = 1;
  /*while(document.getElementById("gameRecord").rows.length > 1) {
    document.getElementById("gameRecord").deleteRow(-1);
  }*/
}

/**
 * Returns a 34 character string representing the current board.  b represents
 * black checkers, r represents red checkers, and a capital letter represents a
 * king of that color.  - represents an empty space and the letter in index 0 is
 * current player's color.
 */
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

/**
 * Arranges the board based on the boardString passed to it in the function.  See
 * getBoard() for translation of letters/symbols into board positions.
 */
function setBoard(boardString) {
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

  clearBoard();

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

  document.getElementById("currentPlayer").innerHTML = "Current player: " + currentColor;

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
  clearSpaces();
  var jumpList = jumpExists(currentColor);
  return true;
}

/**
 * Goes through the list of checkers and sets all checkers to hidden
 */
function hideAll() {
  for (i = 0; i < checkerArray.length; i++) {
    checkerArray[i].style.display = "none";
  }
}

/**
 * Determines what the page does when first loaded or refreshed.  This includes
 * setting up the board and creating the checkers pieces.
 */
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

/**
 * Allows the checker images to be dragged and dropped.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Function called when the checker image is initially dragged and moved.  It
 * determines the starting point from which it was dragged and stores the data
 * for later use by other functions.
 */
function drag(event) {
  var checkerId = event.target.id;
  event.dataTransfer.setData("Text", checkerId);

  srcCol = Math.floor((event.pageX - 7 - document.getElementById(checkerId).parentElement.offsetLeft) / 50);
  srcRow = Math.floor((event.pageY - 7 - document.getElementById(checkerId).parentElement.offsetTop) / 50);

  /*if(canMove(srcRow, srcCol)) {
    document.getElementById(checkerId).setAttribute("draggable", true);
  }
  else {
    document.getElementById(checkerId).setAttribute("draggable", false);
  }*/

  highlightSpaces(event.target.id);
}

/**
 * Function called when the image gets dropped onto the canvas board.  The end
 * destination is recorded then isLegalMove gets call to determine if the drop
 * was a legal move according to the checkers rules.  If it was the program
 * determines whether the move was one or two spaces away and uses move functions
 * to move the checker in the system.
 */
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
    var previousBoard = document.getElementById("boardInput").value;
    document.getElementById("boardInput").value = getBoard();
    if (findIfChecked()) {
      getComputersMove();
    }
  }

  clickedCheckerId = null;
}

/**
 * Like drag except done by clicking the checker.  It records where the checker
 * was clicked for later use by move functions.
 */
function checkerClick(event) {
  clickedCheckerId = event.target.id;
  srcCol = Math.floor((event.pageX - document.getElementById(clickedCheckerId).parentElement.offsetLeft) / 50);
  srcRow = Math.floor((event.pageY - document.getElementById(clickedCheckerId).parentElement.offsetTop) / 50);

  highlightSpaces(clickedCheckerId);
}

/**
 * Similar to drop except activated by clicking the board after clicking a checker.
 * Also records the spot clicked and calls functions to determine the move made.
 */
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
    var previousBoard = document.getElementById("boardInput").value;
    document.getElementById("boardInput").value = getBoard();
    //topLeftToRight(previousBoard, document.getElementById("boardInput").value);
    if (findIfChecked()) {
      getComputersMove();
    }
  }

  clickedCheckerId = null;
}

/**
 * When called creates a checker object that has an image, an id, and src, alt,
 * and classList elements based on the color
 */
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

/**
 * Function that takes a checkerId, finds the king checker that is exactly 24
 * spaces into the checker list, and places that king checker where the regular
 * checker is.  Then it makes the regular checker hidden and the king checker
 * hidden.
 */
function kingAPiece(row, col, checkerId) {
  if (!document.getElementById(checkerId).classList.contains("king")) {
    var index = findCheckerIndex(checkerId);
    document.getElementById(checkerId).style.display = "none";
    occupiedArray[row][col] = checkerArray[index + 24];
    occupiedArray[row][col].style.display = "initial";
    placeChecker(row, col, occupiedArray[row][col].id);
  }
}

/**
 * Function that makes checks for specific conditions that would make a given move
 * illegal.  If it does not pass any of the if statements it is a legal move.
 */
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

/**
 * Function that checks to see if a proposed move is possible by checking if the
 * row and column at that area of the board are occupied.  An occupied space
 * cannot be moved to.
 */
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

/**
 * Like canMove except for jump moves.  There's a different function because a
 * jump has to have an empty square for the destination as well as an occupied
 * square with a checker of the opposite color.
 */
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

/**
 * Function that makes a simple move (one space away) by changing the board and
 * the underlying lists that keep track of occupied spaces on the board.
 */
function makeSimpleMove(destRow, destCol, checkerId) {
  boardString = getBoard();
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
  moveString(boardString, getBoard(), "Player");
  toggleMoveButton();
}

/**
 * Function that makes a jump move (two spaces away) by changing the board and
 * the underlying lists that keep track of occupied spaces on the board.
 */
function makeJumpMove(destRow, destCol, checkerId, color) {
  placeChecker(destRow, destCol, checkerId, 0);
  if(currentCheckerId == null) {
    savedBoard = getBoard();
  }
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
    moveString(savedBoard, getBoard(), "Player");
  }
  if(jumpExists(currentColor).length > 0) {
    document.getElementById("forcedJump").innerHTML = currentColor + " has at least one jump available.";
  }
  else {
    document.getElementById("forcedJump").innerHTML = "No forced jumps.";
  }
  toggleMoveButton();
}

/**
 * Function that checks spaces around the space defined by row and column to see
 * if there is an opposite color checker nearby.
 */
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

/**
 * Function that checks each checker on the board to determine if a possible
 * jump move exists for the current player and if so returns a list of checkers
 * that have to jump on that turn.
 */
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

/**
 * Function that checks to see if a player has won and then changes the labels
 * on the site to show the winner.  Returns false if there was no winner.
 */
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

/**
 * Function that checks to see if the square chosen by row and column has the
 * opposite color of the parameter color.
 */
function hasOppositeChecker(row, col, color) {
  if ((row > 7) || (row < 0) || (col > 7) || (col < 0) || (occupiedArray[row][col] == null) || (occupiedArray[row][col].classList.contains(color))) {
    return false;
  }
  return true;
}

/**
 * Function that checks to see if a specific square is empty
 */
function cellIsVacant(row, col) {
  if (row > 7 || row < 0 || col > 7 || col < 0) {
    return false;
  }
  else if (occupiedArray[row][col] == null) {
    return true;
  }
  return false;
}

/**
 * Function to see if a row or column is out of bounds of the board, where less
 * than 0 or greater than 7 are invalid rows and columns.
 */
function outOfBounds(row, col) {
  if ((row < 0) || (row > 7)) {
    return true;
  }
  else if ((col < 0) || (col > 7)) {
    return true;
  }
  return false;
}

/**
 * Function that returns true/false depending on if a checker contains the class
 * "king" in its classList
 */
function isAKing(checkerId) {
  return document.getElementById(checkerId).classList.contains("king");
}

/**
 * Places the checker during the initial placement at the start of the program.
 * boardOffset is used because the sides of the webpage vary based on the browser
 * used.
 */
function placeInitialChecker(row, col, checkerId, boardOffset) {
  document.getElementById(checkerId).style.top = (row * 50) + 7 + "px";
  document.getElementById(checkerId).style.left = (col * 100 + 7 + boardOffset) + "px";
}

/**
 * Function that places a checker during the course of the program after the
 * initial placement of pieces.
 */
function placeChecker(row, col, checkerId) {
  document.getElementById(checkerId).style.top = (row * 50 + 7) + "px";
  document.getElementById(checkerId).style.left = (col * 50 + 7) + "px";
}

/**
 * Function that finds the checker's index in the checker array by looping
 * through the list and comparing the id's
 */
function findCheckerIndex(checkerId) {
  for(var i = 0; i < checkerArray.length; i++) {
    if(checkerArray[i].id === checkerId) {
      return i;
    }
  }
  return -1;
}

/**
 * Function that determines if the current player's color is also checked as a
 * computer player using the checkboxes on the page. Returns true if they match.
 */
function findIfChecked() {
  if ((currentColor == "black") && (document.getElementById("blackCBox").checked == true)) {
    return true;
  }
  else if ((currentColor == "red") && (document.getElementById("redCBox").checked == true)) {
    return true;
  }
  return false;
}

/**
 * Removes the tag "jumpAvailable" from the classList of every checker.  This
 * tag gets applied when jumpExists is called.  Removing it refreshes the classList
 * for the next turn.
 */
function clearJumpClasses() {
  for(var i = 0; i < checkerArray.length; i++) {
    if(checkerArray[i].classList.contains("jumpAvailable")) {
      checkerArray[i].classList.remove("jumpAvailable");
    }
  }
}

/**
 * Function that determines move numbers made in the format of move1 - move2 in
 * the case of a single move or single jump.  Multiple jumps would have format
 * like move1 - move2 - move3.  findJumpMove is used in cases of jumps including
 * double and triple jumps.
 */
function moveString(source, destination, player) {
  var position = "";
  var currentPlayer = source[0];
  var moveNumber1 = null;
  var moveNumber2 = null;
  for(var j = 2; j < 35; j++) {
    // savedBoards[i] is the source board, savedBoards[i + 1] is the destination board
    if(source[j] != destination[j]) {
      testPosition = findJumpMove(source, destination, j, position);
      if((testPosition.length > 0) && (source[j].toLowerCase() == currentPlayer)) {
        document.getElementById("moveRecord").innerHTML = testPosition;
        appendMoves(document.getElementById("moveRecord").innerHTML, player);
        return;
      }
      else if((source[j].toLowerCase() == currentPlayer) && (destination[j] == "-")){
        moveNumber1 = j - 1;
      }
      else if((destination[j].toLowerCase() == source[0]) && (source[j] == "-")) {
        moveNumber2 = j - 1;
      }
    }
  }
  document.getElementById("moveRecord").innerHTML = moveNumber1 + "-" + moveNumber2;
  appendMoves(document.getElementById("moveRecord").innerHTML, player);
}

/**
 * Function that finds the move numbers of a jump move being made that uses
 * recursive code to calculate multiple jumps in one turn and return a move string
 * that represents it.
 */
function findJumpMove(source, destination, index, position) {
  // index between 2 - 34 but subtract 2 for math calculations
  var topLeftOffset = ((Math.floor((index - 2) / 4) + 1) % 2) + 4;
  var topRightOffset = ((Math.floor((index - 2) / 4) + 1) % 2) + 3;
  var bottomLeftOffset = (Math.floor((index - 2) / 4) % 2) + 3;
  var bottomRightOffset = (Math.floor(((index - 2) / 4)) % 2) + 4;
  var betweenBoard = source;

  // Find if there is a jump from top left to bottom right
  if((destination[index] == "-") && (destination[index + topLeftOffset] == "-")  && ((source[index + topLeftOffset] != source[0]) && (source[index + topLeftOffset] != "-"))) {
    // These checks are in place because there is no valid jump from top left to bottom right
    // from squares on the right edge of the board and squares on the bottom two rows (between 25 and 32)
    if(!(((index - 1) % 4) == 0) && ((index - 1) < 25)) {
      if(position.length == 0) {
        position += (index - 1) + "-" + (index + 8);
      }
      else {
        position += "-" + (index + 8);
      }
      betweenBoard = changeBoardElement(source, index + topLeftOffset, "-");
      position = findJumpMove(betweenBoard, destination, index + 9, position);
      return position;
    }
  }
  // Find if there is a jump move from top right to bottom left
  else if((destination[index] == "-") && (destination[index + topRightOffset] == "-") && ((source[index + topRightOffset] != source[0]) && (source[index + topRightOffset] != "-"))) {
    // These checks are in place because there is no valid jump from top right to bottom left
    // from squares on the left edge of the board and squares on the bottom two rows
    if(!(((index - 1) % 4) == 1) && ((index - 1) < 25)) {
      if(position.length == 0) {
        position += (index - 1) + "-" + (index + 6);
      }
      else {
        position += "-" + (index + 6);
      }
      betweenBoard = changeBoardElement(source, index + topRightOffset, "-");
      position = findJumpMove(betweenBoard, destination, index + 7, position);
      return position;
    }
  }
  // Find if there is a jump move from bottom left to top right
  else if((destination[index] == "-") && (destination[index - bottomLeftOffset] == "-")  && ((source[index - bottomLeftOffset] != source[0]) && (source[index - bottomLeftOffset] != "-"))) {
    // These checks are in place because there is no valid jump from bottom left to top right from squares at the top of the board
    // and all of the squares on the right side of the board as well
    if(!(((index - 1) % 4) == 0) && ((index - 1) > 8)) {
      if(position.length == 0) {
        position += (index - 1) + "-" + (index - 8);
      }
      else {
        position += "-" + (index - 8);
      }
      betweenBoard = changeBoardElement(source, index - bottomLeftOffset, "-");
      position = findJumpMove(betweenBoard, destination, index - 7, position);
      return position;
    }
  }
  // Find if there is a jump move from bottom right to top left
  else if((destination[index] == "-") && (destination[index - bottomRightOffset] == "-")  && ((source[index - bottomRightOffset] != source[0]) && (source[index - bottomRightOffset] != "-"))) {
    // These checks are in place because there is no valid jump from bottom right to top left from squares at the top of the board
    // and all of the squares on the left side of the board
    if(!(((index - 1) % 4) == 1) && ((index - 1) > 8)) {
      if(position.length == 0) {
        position += (index - 1) + "-" + (index - 10);
      }
      else {
        position += "-" + (index - 10);
      }
      betweenBoard = changeBoardElement(source, index - bottomRightOffset, "-");
      position = findJumpMove(betweenBoard, destination, index - 9, position);
      return position;
    }
  }
  document.getElementById("moveRecord").innerHTML = "No move made.";
  return position;
}

/**
 * Function that splits a string, changes a value, then reassembles the string
 * and returns the result
 */
function changeBoardElement(boardString, index, value) {
  var splitBoard = boardString.split("");
  splitBoard[index] = value;
  return splitBoard.join("");
}

/**
 * Function that changes gameRecordText by adding more text to it based on moves
 * made
 */
function appendMoves(movementString, player) {
  var table = document.getElementById("gameRecord");
  var row = table.insertRow(-1);
  var turnCell = row.insertCell(0);
  var playerCell = row.insertCell(1);
  var boardCell = row.insertCell(2);
  var moveCell = row.insertCell(3);

  turnCell.innerHTML = turnCounter;
  turnCounter = turnCounter + 1;
  playerCell.innerHTML = player;
  boardCell.innerHTML = getBoard();
  moveCell.innerHTML = movementString;
}