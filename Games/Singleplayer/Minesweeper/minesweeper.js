const MINE = "x";

const DEFAULT_TILE_COLOUR = "#999999";
const SHADED_TILE_COLOUR = "#666666";
const FLAGGED_COLOUR = "firebrick";
const BORDER_COLOUR = "black";

var marginLeft = 10;
var marginTop = 10;

var rows = 10;
var columns = 10;

var nMines = 16;

var tileHeight = 39;
var tileWidth = 39;

var height = tileHeight*rows + 2*marginTop;
var width = tileWidth*columns + 2*marginLeft;

var board = initializeBoard(create2DArray(rows, columns), nMines);
var clicked = create2DArray(rows,columns);
var flagged = create2DArray(rows,columns);

var svg = d3.select("body")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .on("contextmenu", function() {d3.event.preventDefault()})

var groups = svg.selectAll("g")
  .data(board)
  .enter().append("g")
    .selectAll("g")
    .data(function(d){return d})
      .enter().append("g")
      .attr("id", function(d,i,j){return "G" + j + "-" + i;})

var rects = groups.append("rect")
  .attr("height", tileHeight)
  .attr("width", tileWidth)
  .attr("x", function(d,i,j){return i*tileWidth + marginLeft})
  .attr("y", function(d,i,j){return j*tileHeight + marginTop})
  .attr("fill", DEFAULT_TILE_COLOUR)
  .attr("stroke", BORDER_COLOUR)
  .attr("stroke-width", 1)
  .on("click", function(d,i,j){onClick(board,j,i)})
  .on("contextmenu", function(d,i,j){onRightClick(board,j,i)})

var text = groups.append("text")
  .attr("x", function(d,i,j){return i*tileWidth + marginLeft + 20})
  .attr("y", function(d,i,j){return j*tileHeight + marginTop + 20})
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", "middle")
  .attr("font-size", tileWidth/2)
  .style("pointer-events", "none")

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

function initializeBoard(array, numMines)
{
  var rows = array.length;
  var columns = array[0].length;

  var numSpaces = rows*columns;

  var mines = generateRandomNumbers(numMines, 0, numSpaces);

  for(var i = 0; i < mines.length; i++)
  {
    var j = Math.floor(mines[i] / columns);
    var k = mines[i] % columns;

    array[j][k] = MINE;
  }

  array = setNumbers(array)

  return array;
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

function setNumbers(array)
{
  var rows = array.length;
  var columns = array[0].length;

  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      count = 0;

      if(array[i][j] != MINE)
      {
        if(i-1 >= 0 && j-1 >=0)
        {
          if(array[i-1][j-1] == MINE)
            count++;
        }

        if(i-1 >= 0)
        {
          if(array[i-1][j] == MINE)
            count++;
        }

        if(i-1 >= 0 && j+1 <= columns - 1)
        {
          if(array[i-1][j+1] == MINE)
            count++;
        }

        if(j-1 >= 0)
        {
          if(array[i][j-1] == MINE)
            count++;
        }

        if(j+1 <= columns -1)
        {
          if(array[i][j+1] == MINE)
            count++;
        }

        if(i+1 <= rows-1 && j-1 >=0)
        {
          if(array[i+1][j-1] == MINE)
            count++;
        }

        if(i+1 <= rows-1)
        {
          if(array[i+1][j] == MINE)
            count++;
        }

        if(i+1 <= rows-1 && j+1 <= columns-1)
        {
          if(array[i+1][j+1] == MINE)
            count++;
        }

        array[i][j] = count;
      }
    }
  }

  return array;
}

function onClick(array,i,j)
{
  if(!clicked[i][j] && !flagged[i][j])
  {
    clicked[i][j] = 1;

    if(array[i][j] == MINE)
    {
      d3.select("#G" + i + "-" + j)
        .select("text")
        .attr("fill", "red")
        .text(array[i][j]);

      gameLost();
    }
    else if(array[i][j] == 0)
    {
      d3.select("#G" + i + "-" + j)
        .select("rect")
        .attr("fill", SHADED_TILE_COLOUR)

      zeroClick(array,i,j)
      checkWin();
    }
    else
    {
      d3.select("#G" + i + "-" + j)
        .select("text")
        .text(array[i][j]);

      checkWin();
    }
  }
}

function zeroClick(array,i,j)
{
    if(i-1 >= 0 && j-1 >=0)
    {
      if(array[i-1][j-1] != MINE && !clicked[i-1][j-1])
      {
        onClick(array, i-1, j-1);
      }
    }

    if(i-1 >= 0)
    {
      if(array[i-1][j] != MINE && !clicked[i-1][j])
      {
        onClick(array, i-1, j);
      }
    }

    if(i-1 >= 0 && j+1 <= columns - 1)
    {
      if(array[i-1][j+1] != MINE && !clicked[i-1][j+1])
      {
        //console.log("Calling onclick: i: " + i+1 + " j: " + j+1);
        onClick(array, i-1, j+1);
      }
    }

    if(j-1 >= 0)
    {
      if(array[i][j-1] != MINE&& !clicked[i][j-1])
      {
        //console.log("Calling onclick: i: " + i + " j: " + j-1);
        onClick(array,i,j-1);
      }
    }

    if(j+1 <= columns -1)
    {
      if(array[i][j+1] != MINE && !clicked[i][j+1])
      {
        onClick(array,i,j+1);
      }
    }

    if(i+1 <= rows-1 && j-1 >=0)
    {
      if(array[i+1][j-1] != MINE && !clicked[i+1][j-1])
      {
        onClick(array,i+1,j-1);
      }
    }

    if(i+1 <= rows-1)
    {
      if(array[i+1][j] != MINE && !clicked[i+1][j])
      {
        onClick(array,i+1,j);
      }
    }

    if(i+1 <= rows-1 && j+1 <= columns-1)
    {
      if(array[i+1][j+1] != MINE && !clicked[i+1][j+1])
      {
        onClick(array,i+1,j+1);
      }
    }
}


function checkWin()
{
  var count = 0;

  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      if(clicked[i][j] == 1 && board[i][j] != MINE)
      {
        count++;
      }
    }
  }

  if(count == rows*columns - nMines)
  {
    gameWon();
  }
}

function onRightClick(array,i,j)
{
  if(!clicked[i][j])
  {
    if(flagged[i][j])
    {
        d3.select("#G" + i + "-" + j)
          .select("rect")
          .attr("fill", DEFAULT_TILE_COLOUR)

        flagged[i][j] = 0;
    }
    else
    {
      d3.select("#G" + i + "-" + j)
        .select("rect")
        .attr("fill", FLAGGED_COLOUR)

      flagged[i][j] = 1;
    }
  }
}

function newGame()
{
  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      clicked[i][j] = 0;
      flagged[i][j] = 0;
      board[i][j] = 0;
    }
  }

  rects
    .attr("fill", DEFAULT_TILE_COLOUR)

  text
    .text("")

  board = initializeBoard(board, nMines);
}


function gameWon()
{
  console.log("Winner!");

  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      clicked[i][j] = 1;

      if(board[i][j] == MINE)
      {
        d3.select("#G" + i + "-" + j)
          .select("text")
          .text(MINE);
      }
    }
  }

  d3.xhr("/api/msWin", function(err, res)
  {
    console.log("win xhr request");
  })
}

function gameLost()
{
  console.error("Game Over");

  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      clicked[i][j] = 1;

      if(board[i][j] == MINE)
      {
        d3.select("#G" + i + "-" + j)
          .select("text")
          .text(MINE);
      }
    }
  }

  d3.xhr("/api/msLoss", function(err, res)
  {
    console.log("loss xhr request");
  })
}
