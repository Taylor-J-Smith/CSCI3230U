const UP = 38;
const DOWN = 40;
const LEFT = 37 ;
const RIGHT = 39;

const SVG_BACKGROUND_COLOUR = "#666666";
const DEFAULT_CURVE = 15;
const BACKGROUND_TILE_COLOUR = "#cccccc";

var l_rows = 4;
var l_columns = 4;

var l_board = create2DArray(l_rows, l_columns);
var joined = create2DArray(l_rows, l_columns);

var l_tileHeight = 100;
var l_tileHeight = 100;

var tileMargin = 10;

var score = 0;

d3.select("body")
  .on("keydown", function()
    {
      d3.event.preventDefault();
      keyHandler();
    })

var svg = d3.select("svg")
  .attr("height", 4*l_tileHeight + 5*tileMargin)
  .attr("width", 4*l_tileHeight + 5*tileMargin);

var bGround = svg.append("rect")
  .attr("height", 4*l_tileHeight + 5*tileMargin)
  .attr("width", 4*l_tileHeight + 5*tileMargin)
  .attr("rx", DEFAULT_CURVE)
  .attr("ry", DEFAULT_CURVE)
  .attr("fill", SVG_BACKGROUND_COLOUR);

var bGroundGroups = svg.selectAll("g")
  .data(l_board)
  .enter().append("g")
    .selectAll("g")
    .data(function(d){return d;})
      .enter().append("g")
        .attr("transform", function(d,i,j) {return "translate(" + ((j+1)*tileMargin + j*l_tileHeight) + "," + ((i+1)*tileMargin + i*l_tileHeight) + ")";})
        .attr("id", function(d,i,j){return "G" + j + "-" + i;})

var bGroundTiles = bGroundGroups.append("rect")
  .attr("height", l_tileHeight)
  .attr("width", l_tileHeight)
  .attr("fill", BACKGROUND_TILE_COLOUR)
  .attr("rx", DEFAULT_CURVE)
  .attr("ry", DEFAULT_CURVE);

var numbers = bGroundGroups.append("text")
  .attr("x", l_tileHeight/2)
  .attr("y", l_tileHeight/2)
  .attr("font-size", 50)
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", "middle");

var endGame = svg.append("rect")
  .attr("height", 4*l_tileHeight + 5*tileMargin)
  .attr("width", 4*l_tileHeight + 5*tileMargin)
  .attr("rx", DEFAULT_CURVE)
  .attr("ry", DEFAULT_CURVE)
  .attr("fill", "black");

var endGameText = svg.append("text")
  .attr("x", (4*l_tileHeight + 5*tileMargin)/2)
  .attr("y", (4*l_tileHeight + 5*tileMargin)/2)
  .attr("font-size", 75)
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", "middle")
  .attr("fill", "red")
  .text("Game Over!");

init(l_board);

function init(l_board)
{
  var score = 0;
  updateScore();

  endGame.attr("opacity", 0)
  endGameText.attr("opacity", 0)

  var locations = generateRandomNumbers(2, 0, 15);

  for(var i = 0; i < locations.length; i++)
  {
    var j = Math.floor(locations[i] / l_columns);
    var k = locations[i] % l_columns;

    l_board[j][k] = 2;
  }

  updateTiles();
}

function generateRandomNumbers(n, min, max)
{
  if(n > max - min)
  {
    console.error("Asking for more numbers than in range.");
    return;
  }

  var randNumbers = [];
  var count = 0;

  while(count < n)
  {
    var r = Math.floor(Math.random() * max) + min;

    if(randNumbers.indexOf(r) == -1)
    {
      randNumbers.push(r);
      count++;
    }
  }

  return randNumbers;
}

function print2DArray(array)
{
    for(var i = 0; i < array.length; i++)
    {
      console.log(array[i]);
    }
}

function create2DArray(l_rows, l_columns)
{
  var Array2D = [];

  for(var i = 0; i < l_rows; i++)
  {
    Array2D[i] = new Array(l_columns);

    for(var j = 0; j < l_columns; j++)
    {
      Array2D[i][j] = 0;
    }
  }

  return Array2D;
}

function set2DArray(array, value)
{
  for(var i = 0; i < array.length; i++)
  {
    for(var j = 0; j < array[0].length; j++)
    {
      array[i][j] = value;
    }
  }
}

function keyHandler()
{
  var keyCode = d3.event.keyCode;

  if(keyCode == UP)
  {
    up();
  }
  if(keyCode == DOWN)
  {
    down();
  }
  if(keyCode == LEFT)
  {
    left();
  }
  if(keyCode == RIGHT)
  {
    right();
  }
  updateTiles();
  updateScore();
}

function up()
{
  set2DArray(joined, 0);
  var numMoved = 0;

  for(var i = 0; i < l_columns; i++)
  {
    for(var j = 1; j < l_rows; j++)
    {
      var k=0;
      while(k < j)
      {
        if(l_board[(j-k)-1][i] == 0 && l_board[j-k][i] != 0)
        {
          l_board[(j-k)-1][i] = l_board[j-k][i];
          joined[(j-k)-1][i] = joined[j-k][i];
          l_board[j-k][i] = 0;
          numMoved++
        }

        if(l_board[(j-k)-1][i] == l_board[j-k][i] && !joined[(j-k)-1][i] && !joined[(j-k)][i] && l_board[j-k][i] !=0)
        {
          l_board[(j-k)-1][i] = 2*l_board[j-k][i];
          score += 2*l_board[j-k][i];
          l_board[j-k][i] = 0;
          joined[(j-k)-1][i] = 1;
          numMoved++;
        }
        k++;
      }
    }
  }

  if(numMoved > 0)
  {
    spawnNewTile();
  }
}

function down()
{
  set2DArray(joined, 0);
  var numMoved = 0;

  for(var i = 0; i < l_columns; i++)
  {
    for(var j = l_rows - 2; j >= 0; j--)
    {
      var k=0;
      while(j+k < l_rows-1)
      {
        if(l_board[j+k+1][i] == 0 && l_board[j + k][i] != 0)
        {
          l_board[j+k+1][i] = l_board[j + k][i];
          joined[j+k+1][i] = joined[j + k][i];
          l_board[j+k][i] = 0;
          numMoved++
        }

        if(l_board[j+k+1][i] == l_board[j+k][i] && !joined[j+k+1][i] && !joined[j+k][i] && l_board[j+k][i] !=0)
        {
          l_board[j+k+1][i] = l_board[j+k][i]+l_board[j+k+1][i];
          score += 2*l_board[j+k][i];
          l_board[j+k][i] = 0;
          joined[j+k+1][i] = 1;
          numMoved++;
        }
        k++;
      }
    }
  }

  if(numMoved > 0)
  {
    spawnNewTile();
  }
}

function left()
{
  set2DArray(joined, 0);
  var numMoved = 0;

  for(var i = 0; i < l_columns; i++)
  {
    for(var j = 1; j < l_rows; j++)
    {
      var k=0;
      while(k < j)
      {

        if(l_board[i][(j-k)-1] == 0 && l_board[i][j-k] != 0)
        {
          l_board[i][(j-k)-1] = l_board[i][j-k];
          joined[i][(j-k)-1] = joined[i][j-k];
          l_board[i][j-k] = 0;
          numMoved++
        }

        if(l_board[i][(j-k)-1] == l_board[i][j-k] && !joined[i][(j-k)-1] && !joined[i][(j-k)] && l_board[i][j-k] !=0)
        {
          l_board[i][(j-k)-1] = 2*l_board[i][j-k];
          score += 2*l_board[i][j-k];
          l_board[i][j-k] = 0;
          joined[i][(j-k)-1] = 1;
          numMoved++;
        }
        k++;
      }
    }
  }

  if(numMoved > 0)
  {
    spawnNewTile();
  }
}

function right()
{
  set2DArray(joined, 0);
  var numMoved = 0;

  for(var i = 0; i < l_columns; i++)
  {
    for(var j = l_rows - 2; j >= 0; j--)
    {
      var k=0;
      while(j+k < l_rows-1)
      {
        if(l_board[i][j+k+1] == 0 && l_board[i][j + k] != 0)
        {
          l_board[i][j+k+1] = l_board[i][j + k];
          joined[i][j+k+1] = joined[i][j + k];
          l_board[i][j+k] = 0;
          numMoved++
        }

        if(l_board[i][j+k+1] == l_board[i][j+k] && !joined[i][j+k+1] && !joined[i][j+k] && l_board[i][j+k] !=0)
        {
          l_board[i][j+k+1] = l_board[i][j+k]+l_board[i][j+k+1];
          score += 2*l_board[i][j+k];
          l_board[i][j+k] = 0;
          joined[i][j+k+1] = 1;
          numMoved++;
        }
        k++;
      }
    }
  }

  if(numMoved > 0)
  {
    spawnNewTile();
  }
}

function newGame()
{
  set2DArray(l_board, 0);
  init(l_board);
}

function spawnNewTile()
{

  var count = 0;

  for(var i = 0; i < l_rows ; i++)
  {
    for(var j = 0; j < l_columns; j++)
    {
      if(l_board[i][j] == 0)
      {
        count++;
      }
    }
  }

  if(count == 1)
  {
    for(var i = 0; i < l_rows ; i++)
    {
      for(var j = 0; j < l_columns; j++)
      {
        if(l_board[i][j] == 0)
        {
          l_board[i][j] = 2;
          checkLoss();
          return
        }
      }
    }
  }

  newTile = false;

  while(!newTile)
  {
    var r = generateRandomNumbers(1,0,15);

    var j = Math.floor(r / l_columns);
    var k = r % l_columns;

    if(l_board[j][k] == 0)
    {
      l_board[j][k] = 2;
      newTile = true;
    }
  }

  checkLoss();
}

function updateTiles()
{
  for(var i = 0; i < l_rows; i++)
  {
    for(var j = 0; j < l_columns; j++)
    {
      if(l_board[i][j] != 0)
      {
        d3.select("#G" + j + "-" + i)
          .attr("class", "N" + l_board[i][j])
          .select("text")
          .text(l_board[i][j])
      }
      else
      {
        d3.select("#G" + j + "-" + i)
          .attr("class", "N0")
          .select("text")
          .text(null)
      }

    }
  }
}

function updateScore()
{
  d3.select("#score")
    .text(score)
}

function checkLoss()
{
  for(var i = 0; i < l_rows; i++)
  {
    for(var j = 0; j < l_columns; j++)
    {
      if(l_board[i][j] == 0)
      {
        return;
      }

      if((i-1)>= 0)
      {
        if(l_board[i-1][j] == l_board[i][j])
        {
          return;
        }
      }

      if((j-1) >= 0)
      {
        if(l_board[i][j-1] == l_board[i][j])
        {
          return;
        }
      }

      if((i+1) < l_rows)
      {
        if(l_board[i+1][j] == l_board[i][j])
        {
          return;
        }
      }

      if((j+1) < l_columns)
      {
        if(l_board[i][j+1] == l_board[i][j])
        {
          return;
        }
      }
    }
  }

  gameLost();
}

function gameLost()
{
  endGame.transition()
    .attr("opacity", 0.9)
    .duration(700)
    .delay(500)

  endGameText.transition()
    .attr("opacity", 1)
    .delay(1200)
    .duration(500);
}
