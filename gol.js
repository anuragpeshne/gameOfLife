/*jshint esversion: 6 */

const CELL_SIZE = 8; // in pixels

function Universe(length, breath) {
  var initGrid = function(length, breath) {
    var grid = [];
    for (var row = 0; row < breath; row++) {
      grid.push([]);
      for (var col = 0; col < length; col++) {
        grid[row].push(0);
      }
    }
    return grid;
  };

  function getNeighbours(x, y) {
    var neighbours = [];
    for (var row = x - 1; row <= x + 1; row++) {
      for (var col = y - 1; col <= y + 1; col++) {
        if (row >= 0 && row < grid.length &&
            col >= 0 && col < grid[0].length &&
            !(row === x && col === y)) {
          neighbours.push([row, col]);
        }
      }
    }
    return neighbours;
  }
  this.getNeighbours = getNeighbours;

  this.tick = function() {
    function kill(row, col) {
      grid[row][col] &= 1; // 11 & 01 = 1
    }

    function resurrect(row, col) {
      grid[row][col] |= (1 << 1); // 01 | (1 << 1) = 01 | 10 = 11
    }

    function generateNextState() {
      for (var row = 0; row < grid.length; row++) {
        for (var col = 0; col < grid[0].length; col++) {
          var aliveNeighbours = getNeighbours(row, col).filter(function(neighbor) {
            return isCellAlive(neighbor[0], neighbor[1]);
          });
          if (isCellAlive(row, col)) {
            //under population and over population
            if (aliveNeighbours.length < 2 || aliveNeighbours.length > 3) {
              kill(row, col);
            } else {
              resurrect(row, col);
            }
          } else {
            if (aliveNeighbours.length === 3) {
              resurrect(row, col);
            }
          }
        }
      }
    }

    function applyNextState() {
      for (var row = 0; row < grid.length; row++) {
        for (var col = 0; col < grid[0].length; col++) {
          grid[row][col] = grid[row][col] >> 1;
        }
      }
    }
    generateNextState();
    applyNextState();
  };

  this.resurrectCell = function (row, col) {
    grid[row][col] = 1;
  };

  function isCellAlive(row, col) {
    return (grid[row][col] & 1) > 0;
  };
  this.isCellAlive = isCellAlive;

  var grid = initGrid(length, breath);
  this.length = length;
  this.breath = breath;
}

function presetUniverse(universe) {
  for (var row = 0; row < universe.breath; row++) {
    for (var col = 0; col < universe.length; col++) {
      var rnd = Math.random();
      if (rnd > 0.8) {
        universe.resurrectCell(row, col);
      }
    }
  }
}

function DomUniverse(universeContainer) {
  this.universeContainer = universeContainer;
  var containerLength = this.universeContainer.offsetWidth;
  var containerBreath = this.universeContainer.offsetHeight;

  this.length = Math.floor((containerLength / CELL_SIZE));// * 8 / 10);
  this.breath = Math.floor((containerBreath / CELL_SIZE));// * 8 / 10);

  this.draw = function(){
    this.clear();

    for (var i = 0; i < this.breath; i++) {
      var row = document.createElement('div');
      row.classList.add('row');
      for (var j = 0; j < this.length; j++) {
        var cell = document.createElement('span');
        cell.classList.add('cell');
        cell.id = i + '-' + j;
        row.appendChild(cell);
      }
      universeContainer.appendChild(row);
    }
  };

  this.update = function(universe) {
    for (var row = 0; row < universe.breath; row++) {
      for (var col = 0; col < universe.length; col++) {
        if (universe.isCellAlive(row, col)) {
          this.universeContainer.childNodes[row].childNodes[col].className = "cell alive";
        } else {
          this.universeContainer.childNodes[row].childNodes[col].className = "cell";
        }
      }
    }
  };

  // https://stackoverflow.com/a/3955238/1291435
  this.clear = function () {
    var element = this.universeContainer;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };
}

function GameOfLife(universeContainer, preset) {
  var domUniverse = new DomUniverse(universeContainer);
  var universe = new Universe(domUniverse.length, domUniverse.breath);
  var interval = null;

  domUniverse.draw();
  presetUniverse(universe);
  domUniverse.update(universe);

  this.resurrectCell = function(row, col) {
    universe.resurrectCell(row, col);
    domUniverse.update(universe);
  };

  this.play = function(speed) {
    interval = window.setInterval(function() {
      console.log("play");
      universe.tick();
      domUniverse.update(universe);
    }, speed);
  };

  this.pause = function() {
    window.clearInterval(interval);
  };
}
