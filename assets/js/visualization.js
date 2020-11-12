var word;
var map;
var rendererTwo;

  for(var i=0; i<document.querySelectorAll(".item").length; i++)
{
    document.querySelectorAll(".item")[i].addEventListener("click", function () 
    {
        word = this.innerHTML.toUpperCase();
        for(var i=0; i<document.querySelectorAll(".item").length; i++)
        {
          document.querySelectorAll(".item")[i].classList.remove("highlight");
        }
        this.classList.add("highlight");
    });
}
$('#reset').on('click', () => {
  for(var i=0; i<document.querySelectorAll(".item").length; i++)
        {
          document.querySelectorAll(".item")[i].classList.remove("highlight");
        }
});

document.addEventListener('DOMContentLoaded', () => {

    for(var i=0; i<7; i++) {
        for(var j=0; j<7; j++) {
            document.querySelector(".table1 .t" + (i*7 + j + 1) + "").innerHTML = mazeOne[i][j];
            console.log(".table1 .t" + (i*7 + j + 1) + "");
        }
    }

    for(var i=0; i<7; i++) {
        for(var j=0; j<7; j++) {
            document.querySelector(".table2 .t" + (i*7 + j + 1) + "").innerHTML = mazeOne[i][j];
        }

}

  let maze = mazeOne;
  setUpMap(mazeOne);
  let resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', () => {
    reset(maze);
  });

  $('#play').on('click', () => {
    var pathDFS = makePath(map, rendererTwo);
    $('#play').attr('disabled', true);
    $('#reset').attr('disabled', true);
    runPath(200, pathDFS[0], pathDFS[1], rendererTwo, map);
  });

});

const reset = (maze) => {
  setUpMap(maze);
  $('#play').attr('disabled', false);
};

const setUpMap = (maze) => {
  map = makeMap(maze, 25, 25);
  rendererTwo = makeRenderer(map, 'dfs-graph');
  drawMap(rendererTwo, map);
};

const makeMap = (mazeData, width, height) => ({
  data: mazeData,
  width: mazeData[0].length,
  height: mazeData.reduce(function (acc, row) {
    return acc + 1;
  }, 0),
  cellWidth: width,
  cellHeight: height,
});

const makeRenderer = (map, id) => {
  const canvasEl = document.getElementById(id);
  canvasEl.width = map.cellWidth * map.width;
  canvasEl.height = map.cellHeight * map.height;
  return {
    canvasEl: canvasEl,
    ctx: canvasEl.getContext('2d'),
  };
};

const drawMap = (renderer, map) => {
  let ctx = renderer.ctx;
  let canvas = renderer.canvasEl;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      let cellChar = map.data[y][x];
      ctx.textAlign = 'center';
      ctx.font = '15px Arial';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        cellChar,
        (x + 0.5) * map.cellWidth,
        (y + 0.5) * map.cellHeight
      );
      ctx.strokeStyle = 'black';
      ctx.strokeRect(
        x * map.cellWidth,
        y * map.cellHeight,
        map.cellWidth,
        map.cellHeight
      );
    }
  }
};

const drawPath = (renderer, point, width, height, map, color) => {
  if (point[2] === 0) {
    renderer.ctx.clearRect(point[1] * width, point[0] * height, width, height);
    renderer.ctx.fillStyle = 'black';
    renderer.ctx.textAlign = 'center';
    renderer.ctx.font = '15px Arial';
    renderer.ctx.textBaseline = 'middle';
    renderer.ctx.fillText(
      map.data[point[0]][point[1]],
      (point[1] + 0.5) * width,
      (point[0] + 0.5) * height
    );
    renderer.ctx.strokeStyle = 'black';
    renderer.ctx.strokeRect(point[1] * width, point[0] * height, width, height);
  } else {
    renderer.ctx.strokeStyle = color;
    renderer.ctx.beginPath();
    renderer.ctx.arc(
      12.5 + point[1] * width,
      12.5 + point[0] * height,
      10,
      0,
      Math.PI * 2,
      true
    );
    renderer.ctx.stroke();
  }
};

const runPath = (num, path, found, renderer, map) => {
  let pos = 0;
  function render() {
    if (pos < path.length) {
      drawPath(renderer, path[pos], map.cellWidth, map.cellHeight, map, 'red');
    } else {
      found.forEach((posi) => {
        drawPath(renderer, posi, map.cellWidth, map.cellHeight, map, 'blue');
        $('#reset').attr('disabled', false);
      });
      return;
    }
    pos += 1;
    setTimeout(render, num);
  }
  return render();
};

const makePoint = (point) =>
  point.split(',').map((v) => {
    return v | 0;
  });

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const makePath = (map, renderer) => {
  path = [];
  foundPath = [];
  function dfs(map, i, j, curr, vis) {
    if (curr == word.length - 1 && map.data[i][j] == word[curr] && !vis[i][j]) {
      foundPath.push([i, j, 2]);
      path.push([i, j, 1]);
      return true;
    }
    path.push([i, j, 1]);
    foundPath.push([i, j, 2]);
    vis[i][j] = true;
    if (map.data[i][j] == word[curr]) {
      if (i > 0 && !vis[i - 1][j] && dfs(map, i - 1, j, curr + 1, vis))
        return true;
      if (
        i < map.height - 1 &&
        !vis[i + 1][j] &&
        dfs(map, i + 1, j, curr + 1, vis)
      )
        return true;
      if (j > 0 && !vis[i][j - 1] && dfs(map, i, j - 1, curr + 1, vis))
        return true;
      if (
        j < map.width - 1 &&
        !vis[i][j + 1] &&
        dfs(map, i, j + 1, curr + 1, vis)
      )
        return true;
    }
    foundPath.pop();
    vis[i][j] = false;
    path.push([i, j, 0]);
    return false;
  }

  vis = [];
  for (var i = 0; i < map.height; i++) {
    visrow = [];
    for (var j = 0; j < map.width; j++) {
      visrow.push(false);
    }
    vis.push(visrow);
  }

  for (var i = 0; i < map.height; i++) {
    var flag = false;
    for (var j = 0; j < map.width; j++) {
      if (dfs(map, i, j, 0, vis)) {
        flag = true;
        break;
      }
    }
    if (flag) break;
  }
  return [path, foundPath];
};

let mazeOne = [
  ['H', 'T', 'A',	'O', 'E', 'X' ,'M'],
  ['D', 'D', 'S', 'L', 'Y', 'Y', 'K'],
  ['U', 'Y', 'E', 'E', 'A', 'X', 'O'],
  ['R', 'A', 'D', 'Z', 'T', 'C', 'N'],
  ['P', 'I', 'M', 'W', 'Q', 'D', 'Y'],
  ['V', 'N', 'X', 'A', 'E', 'P', 'R'],
  ['W', 'C', 'L', 'B', 'G', 'T', 'O']
];