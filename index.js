$(document).ready(function() {

	function fromVirtualGridToHtmlGrid(virtualGrid) {
		for(var x = 0; x < virtualGrid.length; x++) {
			for(var y = 0; y < virtualGrid[x].length; y++) {
				var val = virtualGrid[x][y];
				var classToAdd;
				switch(val) {
					case 0: classToAdd = ""; break;
					case 1: classToAdd = "head"; break;
					case 2: classToAdd = "body"; break;
					case 3: classToAdd = "bonus"; break;
				}
				//console.log("x = " + x + " && y = " + y); 
				var caseToSet = $("#" + x + "-" + y);
				caseToSet.removeClass().addClass("case");
				caseToSet.addClass(classToAdd);
			}
		}
	}

	function createHtmlGrid(htmlGrid, height, width) {
		for(var x = 0; x < height; x++) {
			var cases = "";
			for(var y = 0; y < width; y++) {
				cases += '<div id="' + x + "-" + y + '" class="case"></div>';
			}
			htmlGrid.append('<div class="line">' + cases + '</div>');
		}
	}

	function createYXObject(xToSet, yToSet) {
		var obj = {}
		obj.x = xToSet;
		obj.y = yToSet;
		return obj;
	}

	function setVirtualGrid(height, width) {
		var grid = new Array();
		for(var x = 0; x < height; x++) {
			grid[x] = new Array();
			for(var y = 0; y < width; y++) {
				grid[x][y] = 0;
			}
		}
		return grid;
	}

	function getBonus(grid, height, width) {
		var x = getRandom(height - 1);
		var y = getRandom(width - 1);
		while(grid[x][y] != 0) {
			x = getRandom(height - 1);
			y = getRandom(width - 1);
		}
		return createYXObject(x, y);
	}

	function getRandom(max) {
	  return Math.floor(Math.random() * Math.floor(max));
	}

	var gridWidth = 20;
	var gridHeight = 20;

	

	var TOP = "top";
	var BOTTOM = "bottom";
	var LEFT = "left";
	var RIGHT = "right";

	var over = false;

	var htmlGrid = $("#grid");
	createHtmlGrid(htmlGrid, gridHeight, gridWidth);
	var virtualGrid = setVirtualGrid(gridHeight, gridWidth);

	var snakeBody = new Array();
	var snakeHead = createYXObject(gridHeight / 2, gridWidth / 2);
	var lastPosition = snakeHead;

	var bonus = getBonus(virtualGrid, gridHeight, gridWidth);
	var score = 0;
	var htmlScore = $("#score");

	var direction = TOP;

	var interval;



	function snakeToGrid() {
		var eat = 0;
		if(snakeHead. x < 0 || snakeHead.x >= gridHeight || snakeHead.y < 0 || snakeHead.y >= gridWidth) {
			return 2;
		}
		virtualGrid = setVirtualGrid(gridHeight, gridWidth);
		virtualGrid[bonus.x][bonus.y] = 3;
		if(virtualGrid[snakeHead.x][snakeHead.y] == 3) {
			eat = 1;
		}
		for(var i = 0; i < snakeBody.length; i++) {
			virtualGrid[snakeBody[i].x][snakeBody[i].y] = 2;
		}
		if(virtualGrid[snakeHead.x][snakeHead.y] == 2) {
			eat = 2;
		}
		virtualGrid[snakeHead.x][snakeHead.y] = 1;
		

		return eat;
	}

	function increaseScore() {
		score += 100;

		htmlScore.text("score: " + score);
	}

	function moveSnake() {
		if(snakeBody.length == 0) {
			lastPosition = createYXObject(snakeHead.x, snakeHead.y);
		} else {
			lastPosition = createYXObject(snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y);
		}
		
			
		if(snakeBody.length > 0) {
			for(var i = snakeBody.length - 1; i > 0; i--) {
				snakeBody[i].x = snakeBody[i - 1].x;
				snakeBody[i].y = snakeBody[i - 1].y;
			}
			snakeBody[0].x = snakeHead.x;
			snakeBody[0].y = snakeHead.y;
		}
		

		if(direction == TOP) 
			snakeHead.x--;
		if(direction == BOTTOM)
			snakeHead.x++;
		if(direction == LEFT) 
			snakeHead.y--;
		if(direction == RIGHT)
			snakeHead.y++;

		return snakeToGrid();
	}

	function createNewBonus() {
		bonus = getBonus(virtualGrid, gridHeight, gridWidth);
		virtualGrid[bonus.x][bonus.y] = 3;
	}

	function increaseSnake() {
		newSnakePiece = lastPosition;
		snakeBody.push(newSnakePiece);
	}

	$(document).keydown(function(e){
	   switch (e.which){
	     case 37: // fleche gauche
	       direction = LEFT; break;
	     case 38: // fleche haut
	       direction = TOP; break; 
	     case 39: // fleche droite
	       direction = RIGHT; break;
	     case 40: // fleche bas
	       direction = BOTTOM; break;
	   }
	});

	function printVirtualGrid() {
		for(var x = 0; x < gridHeight; x++) {
			var lineToPrint = "";
			for(var y = 0; y < gridWidth; y++) {
				lineToPrint += virtualGrid[x][y] + "-";
			}
			console.log(x + "| -" + lineToPrint);
		}
		console.log("");
		console.log("---------------------------");
		console.log("");
	}

	function play() {
		interval = setInterval(function() {
			if(over) {
				clearInterval(interval);
			}
			else {
				var eat = moveSnake();
				if(eat == 1) {
					increaseScore();
					increaseSnake();
					createNewBonus();
				}
				fromVirtualGridToHtmlGrid(virtualGrid);
				//printVirtualGrid();
				if(eat == 2) {
					over = true;
					$("#over").text("GAME OVER");
					console.log("GAME OVER");
				}
			}
		}, 400);
	}

	function setGame() {
		clearInterval(interval);
		virtualGrid = setVirtualGrid(gridHeight, gridWidth);

		snakeBody = new Array();
		snakeHead = createYXObject(gridHeight / 2, gridWidth / 2);
		lastPosition = snakeHead;

		bonus = getBonus(virtualGrid, gridHeight, gridWidth);
		score = 0;
		htmlScore.text("score: 0");

		direction = TOP;
		over = false;
		fromVirtualGridToHtmlGrid(virtualGrid);
		$("#over").text("");
	}

	$("#newGame").click(function() {
		setGame();
		play();
	});
});