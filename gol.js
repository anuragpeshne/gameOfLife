var clearChildren = function (element) {
  while (element.firstChild) {
        element.removeChild(element.firstChild);
  }
};

var getNxMElement = function(universeContainer, x, y) {
  return universeContainer.childNodes[y][x];
};

var kill = function(cell) {
  cell.className += ' alive';
};

var resurrect = function(cell) {
  cell.className = cell.className.slice(3);   //b'coz 'row'.length = 3
};

var tick = function(universe, universeContainer) {
  
}

window.onload = function(){
  var gridSize = document.getElementById('gridSize').value;
  var speed = document.getElementById('speed').value;

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
        row.appendChild(cell);
      }
      universeContainer.appendChild(row);
    }
  })();
};
