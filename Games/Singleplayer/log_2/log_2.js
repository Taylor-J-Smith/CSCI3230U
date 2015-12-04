const UP = 38;
const DOWN = 40;
const LEFT = 37 ;
const RIGHT = 39;

const SVG_BACKGROUND_COLOUR = "#666666";
const DEFAULT_CURVE = 15;
const BACKGROUND_TILE_COLOUR = "#cccccc";

var rows = 4;
var columns = 4;

var board = create2DArray(rows, columns);
var joined = create2DArray(rows, columns);

var tileHeight = 100;
var tileWidth = 100;

var tileMargin = 10;

var score = 0;

d3.select("body")
  .on("keydown", function()
    {
      d3.event.preventDefault();
      keyHandler();
    })

var svg = d3.select("svg")
  .attr("height", 4*tileHeight + 5*tileMargin)
  .attr("width", 4*tileWidth + 5*tileMargin);

var bGround = svg.append("rect")
  .attr("height", 4*tileHeight + 5*tileMargin)
  .attr("width", 4*tileWidth + 5*tileMargin)
  .attr("rx", DEFAULT_CURVE)
  .attr("ry", DEFAULT_CURVE)
  .attr("fill", SVG_BACKGROUND_COLOUR);

var bGroundGroups = svg.selectAll("g")
  .data(board)
  .enter().append("g")
    .selectAll("g")
    .data(function(d){return d;})
      .enter().append("g")
        .attr("transform", function(d,i,j) {return "translate(" + ((j+1)*tileMargin + j*tileWidth) + "," + ((i+1)*tileMargin + i*tileHeight) + ")";})
        .attr("id", function(d,i,j){return "G" + j + "-" + i;})

var bGroundTiles = bGroundGroups.append("rect")
  .attr("height", tileHeight)
  .attr("width", tileWidth)
  .attr("fill", BACKGROUND_TILE_COLOUR)
  .attr("rx", DEFAULT_CURVE)
  .attr("ry", DEFAULT_CURVE);

var numbers = bGroundGroups.append("text")
  .attr("x", tileWidth/2)
  .attr("y", tileHeight/2)
  .attr("font-size", 50)
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", "middle");

var endGame = svg.append("rect")
  .attr("height", 4*tileHeight + 5*tileMargin)
  .attr("width", 4*tileWidth + 5*tileMargin)
  .attr("rx", DEFAULT_CURVE)
  .attr("ry", DEFAULT_CURVE)
  .attr("fill", "black");

var endGameText = svg.append("text")
  .attr("x", (4*tileWidth + 5*tileMargin)/2)
  .attr("y", (4*tileHeight + 5*tileMargin)/2)
  .attr("font-size", 75)
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", "middle")
  .attr("fill", "red")
  .text("Game Over!");

init(board);

function init(board)
{
  var score = 0;
  updateScore();

  endGame.attr("opacity", 0)
  endGameText.attr("opacity", 0)

  var locations = generateRandomNumbers(2, 0, 15);

  for(var i = 0; i < locations.length; i++)
  {
    var j = Math.floor(locations[i] / columns);
    var k = locations[i] % columns;

    board[j][k] = 2;
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

function create2DArray(rows, columns)
{
  var Array2D = [];

  for(var i = 0; i < rows; i++)
  {
    Array2D[i] = new Array(columns);

    for(var j = 0; j < columns; j++)
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

  for(var i = 0; i < columns; i++)
  {
    for(var j = 1; j < rows; j++)
    {
      var k=0;
      while(k < j)
      {
        if(board[(j-k)-1][i] == 0 && board[j-k][i] != 0)
        {
          board[(j-k)-1][i] = board[j-k][i];
          joined[(j-k)-1][i] = joined[j-k][i];
          board[j-k][i] = 0;
          numMoved++
        }

        if(board[(j-k)-1][i] == board[j-k][i] && !joined[(j-k)-1][i] && !joined[(j-k)][i] && board[j-k][i] !=0)
        {
          board[(j-k)-1][i] = 2*board[j-k][i];
          score += 2*board[j-k][i];
          board[j-k][i] = 0;
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

  for(var i = 0; i < columns; i++)
  {
    for(var j = rows - 2; j >= 0; j--)
    {
      var k=0;
      while(j+k < rows-1)
      {
        if(board[j+k+1][i] == 0 && board[j + k][i] != 0)
        {
          board[j+k+1][i] = board[j + k][i];
          joined[j+k+1][i] = joined[j + k][i];
          board[j+k][i] = 0;
          numMoved++
        }

        if(board[j+k+1][i] == board[j+k][i] && !joined[j+k+1][i] && !joined[j+k][i] && board[j+k][i] !=0)
        {
          board[j+k+1][i] = board[j+k][i]+board[j+k+1][i];
          score += 2*board[j+k][i];
          board[j+k][i] = 0;
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

  for(var i = 0; i < columns; i++)
  {
    for(var j = 1; j < rows; j++)
    {
      var k=0;
      while(k < j)
      {

        if(board[i][(j-k)-1] == 0 && board[i][j-k] != 0)
        {
          board[i][(j-k)-1] = board[i][j-k];
          joined[i][(j-k)-1] = joined[i][j-k];
          board[i][j-k] = 0;
          numMoved++
        }

        if(board[i][(j-k)-1] == board[i][j-k] && !joined[i][(j-k)-1] && !joined[i][(j-k)] && board[i][j-k] !=0)
        {
          board[i][(j-k)-1] = 2*board[i][j-k];
          score += 2*board[i][j-k];
          board[i][j-k] = 0;
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

  for(var i = 0; i < columns; i++)
  {
    for(var j = rows - 2; j >= 0; j--)
    {
      var k=0;
      while(j+k < rows-1)
      {
        if(board[i][j+k+1] == 0 && board[i][j + k] != 0)
        {
          board[i][j+k+1] = board[i][j + k];
          joined[i][j+k+1] = joined[i][j + k];
          board[i][j+k] = 0;
          numMoved++
        }

        if(board[i][j+k+1] == board[i][j+k] && !joined[i][j+k+1] && !joined[i][j+k] && board[i][j+k] !=0)
        {
          board[i][j+k+1] = board[i][j+k]+board[i][j+k+1];
          score += 2*board[i][j+k];
          board[i][j+k] = 0;
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
  set2DArray(board, 0);
  init(board);
}

function spawnNewTile()
{

  var count = 0;

  for(var i = 0; i < rows ; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      if(board[i][j] == 0)
      {
        count++;
      }
    }
  }

  if(count == 1)
  {
    for(var i = 0; i < rows ; i++)
    {
      for(var j = 0; j < columns; j++)
      {
        if(board[i][j] == 0)
        {
          board[i][j] = 2;
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

    var j = Math.floor(r / columns);
    var k = r % columns;

    if(board[j][k] == 0)
    {
      board[j][k] = 2;
      newTile = true;
    }
  }

  checkLoss();
}

function updateTiles()
{
  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      if(board[i][j] != 0)
      {
        d3.select("#G" + j + "-" + i)
          .attr("class", "N" + board[i][j])
          .select("text")
          .text(board[i][j])
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

    if(d3.select("#bscore").text() < score)
      d3.select("#bscore")
        .text(score)
}

function checkLoss()
{
  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      if(board[i][j] == 0)
      {
        return;
      }

      if((i-1)>= 0)
      {
        if(board[i-1][j] == board[i][j])
        {
          return;
        }
      }

      if((j-1) >= 0)
      {
        if(board[i][j-1] == board[i][j])
        {
          return;
        }
      }

      if((i+1) < rows)
      {
        if(board[i+1][j] == board[i][j])
        {
          return;
        }
      }

      if((j+1) < columns)
      {
        if(board[i][j+1] == board[i][j])
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
