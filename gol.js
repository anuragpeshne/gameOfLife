var clearChildren = function (element) {
  while (element.firstChild) {
        element.removeChild(element.firstChild);
  }
};

var getNxMElement = function(universeContainer, x, y) {
  return universeContainer.childNodes[y].childNodes[x];
};

var resurrect = function(universe, cell) {
	var cellPosition = cell.id.split('-');
	universe[parseInt(cellPosition[0])][parseInt(cellPosition[1])] = 1;
  cell.className += ' alive';
};

var kill = function(universe, cell) {
	var cellPosition = cell.id.split('-');
	universe[parseInt(cellPosition[0])][parseInt(cellPosition[1])] = 0;
  cell.className = cell.className.slice(3);   //b'coz 'row'.length = 3
};

var getNeighbours = function(i, j, universe) {
	var ii, jj;
	var neighbours = [];
	for (ii = i - 1; ii <= i + 1; ii++) {
		for (jj = j - 1; jj <= j + 1; jj++) {
			if (typeof(universe[ii]) !== 'undefined' &&
					typeof(universe[ii][jj]) !== 'undefined') {
				neighbours.push(universe[ii][jj]);
			}
		}
	}
	return neighbours;
}

var tick = function(universe, universeContainer, speed) {
	window.setInterval(function innerTick() {
		var i, j;
		var gridSize = universe.length;
		for (i = 0; i < gridSize; i++) {
			for (j = 0; j < gridSize; j++) {
				var neighbours = getNeighbours(i, j, universe);
				if (neighbours.length < 2 || neighbours.length > 3) {
					console.log('kill');
					kill(universe, getNxMElement(universeContainer, i, j));
				} else {
					console.log('resurrect');
					resurrect(universe, getNxMElement(universeContainer, i, j));
				}
			}
		}
	}, speed * 100);
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
  var gridSize = document.getElementById('gridSize').value;
  var speed = document.getElementById('speed').value;
	var startBtn = document.getElementById('play');
	var universe = initUniverse(gridSize);


  (function drawUniverse(){
    var universeContainer = document.getElementById('universeContainer');
    clearChildren(universeContainer);

    var i, j;
    for (i = 0; i < gridSize; i++) {
      var row = document.createElement('div');
      row.classList.add('row');
      for (j = 0; j < gridSize; j++) {
        var cell = document.createElement('span');
        cell.classList.add('cell');
				cell.id = (i + 1) + '-' + (j + 1);
        row.appendChild(cell);
      }
      universeContainer.appendChild(row);
    }
  })();

  universeContainer.addEventListener('click', function(e) {
		var target = e.target;
		resurrect(universe, target);
  });

	startBtn.addEventListener('click', function(e) {
		startBtn.value = 'stop';
		tick(universe, universeContainer, speed);
	});

};
