const UP = 38;
const DOWN = 40;
const LEFT = 37 ;
const RIGHT = 39;

const SVG_BACKGROUND_COLOUR = "#cccccc";
const DEFAULT_CURVE = 20;

var rows = 4;
var columns = 4;

var board = create2DArray(rows, columns);
var joined = create2DArray(rows, columns);

var tileHeight = 100;
var tileWidth = 100;

var tileMargin = 10;

init(board);

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

function init(board)
{
  var locations = generateRandomNumbers(2, 0, 15);

  for(var i = 0; i < locations.length; i++)
  {
    var j = Math.floor(locations[i] / columns);
    var k = locations[i] % columns;

    board[j][k] = 2;
  }
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
}

function up()
{

}

function down()
{
}

function left()
{
}

function right()
{
}
