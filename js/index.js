var dragX = 0;
var dragY = 0;
var checkerArray = new Array();
// occupiedArray stores an 8x8 array that represents each board and whether or not it has a checker piece, each index is based off of Math.floor((y - 15) / 50) and Math.floor((x - 15) / 50)
var occupiedArray = new Array(8);
for (var i = 0; i < 8; i++) {
  occupiedArray[i] = []
}

for (var i = 0; i < 4; i++) {
  checkerArray[i] = createChecker(("red" + i), "red", "15px", ((i % 4) * 100 + 65) + "px");
  occupiedArray[0][i * 2 + 1] = true;
}

for (var i = 4; i < 8; i++) {
  checkerArray[i] = createChecker(("red" + i), "red", "65px", ((i % 4) * 100 + 15) + "px"); 
  occupiedArray[1][(i - 4) * 2] = true;
}

for (var i = 8; i < 12; i++) {
  checkerArray[i] = createChecker(("red" + i), "red", "115px", ((i % 4) * 100 + 65) + "px");
  occupiedArray[2][(i - 8) * 2 + 1] = true;
}

for (var i = 0; i < 4; i++) {
  occupiedArray[3][i * 2] = false;
}

for (var i = 0; i < 4; i++) {
  occupiedArray[4][i * 2 + 1] = false;
}

for (var i = 12; i < 16; i++) {
  checkerArray[i] = createChecker(("black" + i), "black", "265px", ((i % 4) * 100 + 15) + "px");
  occupiedArray[5][(i - 12) * 2] = true;
}

for (var i = 16; i < 20; i++) {
  checkerArray[i] = createChecker(("black" + i), "black", "315px", ((i % 4) * 100 + 65) + "px"); 
occupiedArray[6][(i - 16) * 2 + 1] = true;
}

for (var i = 20; i < 24; i++) {
  checkerArray[i] = createChecker(("black" + i), "black", "365px", ((i % 4) * 100 + 15) + "px");
  occupiedArray[7][(i - 20) * 2] = true;
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
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("Text");
  var x = event.clientX;
  var y = event.clientY;
  console.log("Value of x: " + x);
  console.log("Value of y: " + x);
  if ((Math.floor(y / 50) % 2 == 0) && (Math.floor(x / 50) % 2 == 1)) {
    if (occupiedArray[Math.floor((y - 15) / 50)][Math.floor((x - 15) / 50)] == false) {
      document.getElementById(data).style.top = (Math.floor(y / 50) * 50 + 15) + "px";
      document.getElementById(data).style.left = (Math.floor(x / 50) * 50 + 15) + "px";
      occupiedArray[dragY][dragX] = false;
      occupiedArray[((y - 15) / 50)][((x - 15) / 50)] = true;
    }
  }
  else if (occupiedArray[Math.floor((y - 15) / 50)][Math.floor((x - 15) / 50)] == false) {
    if ((Math.floor(y / 50) % 2 == 1) && (Math.floor(x / 50) % 2 == 0)) {
      document.getElementById(data).style.top = (Math.floor(y / 50) * 50 + 15) + "px";
      document.getElementById(data).style.left = (Math.floor(x / 50) * 50 + 15) + "px";
      occupiedArray[dragY][dragX] = false;
      occupiedArray[((y - 15) / 50)][((x - 15) / 50)] = true;
    }
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
    image.src = "http://i349.photobucket.com/albums/q391/Glenn_Q_Hurd/black_checker_zps5jhvmfod.png";
    image.alt = "Black";
  }
  else if (color == "red"){
    image.src = "http://i349.photobucket.com/albums/q391/Glenn_Q_Hurd/red_checker_zpsogdbhfbj.png";
    image.alt = "Red";
  }
  document.getElementById("boardset").appendChild(image);
  image.addEventListener("dragstart", drag);
  image.style.position = "absolute";
  image.style.top = tposition;
  image.style.left = lposition;
  return image;
}