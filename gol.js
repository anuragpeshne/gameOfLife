var clearChildren = function (element) {
  while (element.firstChild) {
        element.removeChild(element.firstChild);
  }
};

var getCell = function(universeContainer, x, y) {
  return universeContainer.childNodes[y].childNodes[x];
};

var resurrect = function(x, y, universe, cell) {
	universe[y][x] = 1;
  cell.className = 'cell alive';
};

var kill = function(x, y, universe, cell) {
  universe[y][x] = 0;
  cell.className = cell.className.slice(0, 4);   //b'coz 'cell'.length == 4
};

var isAlive = function(cellValue) {
  return cellValue === 1;
}

var getNeighbours = function(x, y, universe) {
	var ix, iy;
	var neighbours = [];
	for (iy = y - 1; iy <= y + 1; iy++) {
		if (typeof(universe[iy]) !== 'undefined') {
      for (ix = x - 1; ix <= x + 1; ix++) {
        if (typeof(universe[iy][ix]) !== 'undefined' &&
            !(ix === x && iy === y)) {
          neighbours.push(universe[iy][ix]);
        }
      }
    }
	}
	return neighbours;
}

var tick = function(universe, universeContainer, gameParams) {
	gameParams.timer = window.setInterval(function innerTick() {
		var x, y;
    var nextGenUniverse = initUniverse(gameParams.gridSize);
		for (y = 0; y < gameParams.gridSize; y++) {
			for (x = 0; x < gameParams.gridSize; x++) {
				var neighbours = getNeighbours(x, y, universe).filter(isAlive);
				if (universe[y][x] === 1) {//live cell
          //under population and over population
          if (neighbours.length < 2 || neighbours.length > 3) {
            kill(x, y, nextGenUniverse, getCell(universeContainer, x, y));
          } else {
            resurrect(x, y, nextGenUniverse, getCell(universeContainer, x, y));
          }
				} else if (universe[y][x] === 0 &&
            (neighbours.length === 3)) {
					resurrect(x, y, nextGenUniverse, getCell(universeContainer, x, y));
				}
			}
		}
    universe = nextGenUniverse;
	}, gameParams.speed * 100);
}

var initUniverse = function(gridSize) {
	var universe = [];
	var i, j;
	for (i = 0; i < gridSize; i++) {
			universe.push([]);
			for (j = 0; j < gridSize; j++) {
				universe[i].push(0);
			}
	}

	return universe;
}

window.onload = function(){
  var speedControler = document.getElementById('speed');
  var gameParams = {
    gridSize : document.getElementById('gridSize').value,
    speed : parseInt(speed.attributes.max.value) - speedControler.value + 1,
    timer : null
  }
	var startBtn = document.getElementById('play');
	var universe = initUniverse(gameParams.gridSize);


  (function drawUniverse(){
    var universeContainer = document.getElementById('universeContainer');
    clearChildren(universeContainer);

    var i, j;
    for (i = 0; i < gameParams.gridSize; i++) {
      var row = document.createElement('div');
      row.classList.add('row');
      for (j = 0; j < gameParams.gridSize; j++) {
        var cell = document.createElement('span');
        cell.classList.add('cell');
				cell.id = i + '-' + j;
        row.appendChild(cell);
      }
      universeContainer.appendChild(row);
    }
  })();

  universeContainer.addEventListener('click', function(e) {
		var target = e.target;
    if (target.className === 'cell') {
      var co_ord = target.id.split('-');
      //Be Carefull: we use x,y co-ord style
      resurrect(parseInt(co_ord[1]), parseInt(co_ord[0]), universe, target);
    }
  });

	startBtn.addEventListener('click', function(e) {
    if (startBtn.value.toLowerCase() === 'play') {
      startBtn.value = 'stop';
      tick(universe, universeContainer, gameParams);
    } else {
      startBtn.value = 'play';
      window.clearInterval(gameParams.timer);
    }
	});

};
