const MINE = "\u2620";

const DEFAULT_TILE_COLOUR = "#999999";
const SHADED_TILE_COLOUR = "#666666";
const FLAGGED_COLOUR = "firebrick";
const BORDER_COLOUR = "#333333";
const MINE_CLICKED_COLOUR = "red";

var marginLeft = 10;
var marginTop = 10;

var m_rows = 10;
var m_columns = 10;

var nMines = 16;

var m_tileHeight = 39;
var m_tileHeight = 39;

var height = m_tileHeight*m_rows + 2*marginTop;
var width = m_tileHeight*m_columns + 2*marginLeft;

var m_board = initializem_board(create2DArray(m_rows, m_columns), nMines);
var clicked = create2DArray(m_rows,m_columns);
var flagged = create2DArray(m_rows,m_columns);

var svg = d3.select("body")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .on("contextmenu", function() {d3.event.preventDefault()})

var groups = svg.selectAll("g")
  .data(m_board)
  .enter().append("g")
    .selectAll("g")
    .data(function(d){return d})
      .enter().append("g")
      .attr("id", function(d,i,j){return "G" + j + "-" + i;})

var rects = groups.append("rect")
  .attr("height", m_tileHeight)
  .attr("width", m_tileHeight)
  .attr("x", function(d,i,j){return i*m_tileHeight + marginLeft})
  .attr("y", function(d,i,j){return j*m_tileHeight + marginTop})
  .attr("fill", DEFAULT_TILE_COLOUR)
  .attr("stroke", BORDER_COLOUR)
  .attr("stroke-width", 1)
  .on("click", function(d,i,j){onClick(m_board,j,i)})
  .on("contextmenu", function(d,i,j){onRightClick(m_board,j,i)})

var text = groups.append("text")
  .attr("x", function(d,i,j){return i*m_tileHeight + marginLeft + 20})
  .attr("y", function(d,i,j){return j*m_tileHeight + marginTop + 20})
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", "middle")
  .attr("font-size", m_tileHeight/2)
  .style("pointer-events", "none")

function create2DArray(m_rows, m_columns)
{
  var Array2D = [];

  for(var i = 0; i < m_rows; i++)
  {
    Array2D[i] = new Array(m_columns);

    for(var j = 0; j < m_columns; j++)
    {
      Array2D[i][j] = 0;
    }
  }

  return Array2D;
}

function initializem_board(array, numMines)
{
  var m_rows = array.length;
  var m_columns = array[0].length;

  var numSpaces = m_rows*m_columns;

  var mines = generateRandomNumbers(numMines, 0, numSpaces);

  for(var i = 0; i < mines.length; i++)
  {
    var j = Math.floor(mines[i] / m_columns);
    var k = mines[i] % m_columns;

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
  var m_rows = array.length;
  var m_columns = array[0].length;

  for(var i = 0; i < m_rows; i++)
  {
    for(var j = 0; j < m_columns; j++)
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

        if(i-1 >= 0 && j+1 <= m_columns - 1)
        {
          if(array[i-1][j+1] == MINE)
            count++;
        }

        if(j-1 >= 0)
        {
          if(array[i][j-1] == MINE)
            count++;
        }

        if(j+1 <= m_columns -1)
        {
          if(array[i][j+1] == MINE)
            count++;
        }

        if(i+1 <= m_rows-1 && j-1 >=0)
        {
          if(array[i+1][j-1] == MINE)
            count++;
        }

        if(i+1 <= m_rows-1)
        {
          if(array[i+1][j] == MINE)
            count++;
        }

        if(i+1 <= m_rows-1 && j+1 <= m_columns-1)
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
        .attr("fill", MINE_CLICKED_COLOUR)
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

    if(i-1 >= 0 && j+1 <= m_columns - 1)
    {
      if(array[i-1][j+1] != MINE && !clicked[i-1][j+1])
      {
        onClick(array, i-1, j+1);
      }
    }

    if(j-1 >= 0)
    {
      if(array[i][j-1] != MINE&& !clicked[i][j-1])
      {
        onClick(array,i,j-1);
      }
    }

    if(j+1 <= m_columns -1)
    {
      if(array[i][j+1] != MINE && !clicked[i][j+1])
      {
        onClick(array,i,j+1);
      }
    }

    if(i+1 <= m_rows-1 && j-1 >=0)
    {
      if(array[i+1][j-1] != MINE && !clicked[i+1][j-1])
      {
        onClick(array,i+1,j-1);
      }
    }

    if(i+1 <= m_rows-1)
    {
      if(array[i+1][j] != MINE && !clicked[i+1][j])
      {
        onClick(array,i+1,j);
      }
    }

    if(i+1 <= m_rows-1 && j+1 <= m_columns-1)
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

  for(var i = 0; i < m_rows; i++)
  {
    for(var j = 0; j < m_columns; j++)
    {
      if(clicked[i][j] == 1 && m_board[i][j] != MINE)
      {
        count++;
      }
    }
  }

  if(count == m_rows*m_columns - nMines)
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
  set2DArray(m_board,0);
  set2DArray(clicked, 0);
  set2DArray(flagged, 0);

  rects
    .attr("fill", DEFAULT_TILE_COLOUR)

  text
    .text("")

  m_board = initializem_board(m_board, nMines);
}

function gameWon()
{
  console.log("Winner!");

  for(var i = 0; i < m_rows; i++)
  {
    for(var j = 0; j < m_columns; j++)
    {
      clicked[i][j] = 1;

      if(m_board[i][j] == MINE)
      {
        d3.select("#G" + i + "-" + j)
          .select("text")
          .text(MINE);
      }
    }
  }

  // do ajax request
  // d3.text("/api/msLoss")
  //   .header("Content-type", "application/json")
  //   .post(JSON.stringify("sampleSessionToken"), function(error, text) { console.log(text); });
}

function gameLost()
{
  console.error("Game Over");

  set2DArray(clicked, 1);
  showAllMines(m_board);

  // do ajax request
  // d3.text("/api/msLoss")
  //   .header("Content-type", "application/json")
  //   .post(JSON.stringify("sampleSessionToken"), function(error, text) { console.log(text); });

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

function showAllMines(array)
{
  for(var i = 0; i < m_rows; i++)
  {
    for(var j = 0; j < m_columns; j++)
    {
      if(array[i][j] == MINE)
      {
        d3.select("#G" + i + "-" + j)
          .select("text")
          .text(MINE);
      }
    }
  }
}
