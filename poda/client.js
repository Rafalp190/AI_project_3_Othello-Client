/*
  MINIMAX CLIENT alpha-beta pruning optimization
  -----------------------------------------------------------------------
  @author: Rafael León
  @institution: UVG
  -----------------------------------------------------------------------
  Minimax Othello AI client to connect with the 1v1BoardgameCoordinator
  Socket Interface and Protocol taken from 
  @samuelchvz
  https://gist.github.com/samuelchvez/f066aeee698ddb37f759c619980bb0c7
*/

/*
-------------------------------------------------------------------------
  _ ___     _        _        _   __ ___  _ 
 / \ | |_| |_ |  |  / \   |  / \ /__  |  /  
 \_/ | | | |_ |_ |_ \_/   |_ \_/ \_| _|_ \_ 
-------------------------------------------------------------------------                                          
*/
/*
  Get Possible Moves
  Function that calculates the possible valid moves on the board
  @params:
  board: the current state of the board
  column: the column of the last move (int) 0-7
  row: the row of the last move (int) 0-7
  playerID: the ID of the current player

  @return
  moves: list of possible valid moves on the current board
*/
function get_possible_moves(board, column, row, playerID){

  var i = 0;
  var j = 0;
  var otherP = 1;
  if (playerID == 1)
    otherP = 2;
  var moves = [];

  if(row < 0 || row > 7 || column < 0 || column > 7)
    return moves;

  /*
    Moves based on the NORTH side of the map 
  */
  i = row - 1
    if (i >= 0 && board[i][column] == otherP){
        i = i - 1;
        while (i >= 0 && board[i][column] == otherP){
            i = i - 1;
        }
        if (i >= 0 && board[i][column] == 0){
            //moves.push([column,i]);
            moves.push(i*8 + column);
        }
    }
  /*
    Moves based on the NORTH-EAST side of the map 
  */
  i = row - 1
    j = column + 1
    if (i >= 0 && j < 8 && board[i][j] == otherP){
        i = i - 1
        j = j + 1
        while (i >= 0 && j < 8 && board[i][j] == otherP){
            i = i - 1
            j = j + 1
        }
        if (i >= 0 && j < 8 && board[i][j] == 0){
            //moves.push([j,i]);
            moves.push(i*8 + j);
        }
    }
  /*
    Moves based on the EAST side of the map 
  */
  j = column + 1;
    if (j < 8 && board[row][j] == otherP){
        j = j + 1;
        while (j < 8 && board[row][j] == otherP){
            j = j + 1;
        }
        if (j < 8 && board[row][j] == 0){
          //moves.push([j,row]);
            moves.push(row*8+j);
      }
    }
  /*
    Moves based on the SOUTH-EAST side of the map 
  */
  i = row + 1;
    j = column + 1;
    if (i < 8 && j < 8 && board[i][j] == otherP){
        i = i + 1;
        j = j + 1;
        while (i < 8 && j < 8 && board[i][j] == otherP){
            i = i + 1;
            j = j + 1;
        }
        if (i < 8 && j < 8 && board[i][j] == 0){
            //moves.push([j,i]);
            moves.push(i*8 + j);
        }
    }
  /*
    Moves based on the SOUTH side of the map 
  */
  i = row + 1;
    if (i < 8 && board[i][column] == otherP){
        i = i + 1;
        while (i < 8 && board[i][column] == otherP){
            i = i + 1;
        }
        if (i < 8 && board[i][column] == 0){
            //moves.push([column,i]);
            moves.push(i*8+column);
        }
    }
  /*
    Moves based on the SOUTH-WEST side of the map 
  */
  i = row + 1;
    j = column - 1;
    if (i < 8 && j >= 0 && board[i][j] == otherP){
        i = i + 1;
        j = j - 1;
        while (i < 8 && j >= 0 && board[i][j] == otherP){
            i = i + 1;
            j = j - 1;
        }
        if (i < 8 && j >= 0 && board[i][j] == 0){
            //moves.push([j,i]);
            moves.push(i*8 + j);
        }
    }

  /*
    Moves based on the WEST side of the map 
  */
  j = column - 1;
    if (j >= 0 && board[row][j] == otherP){
        j = j - 1;
        while (j >= 0 && board[row][j] == otherP){
            j = j - 1;
        }
        if (j >= 0 && board[row][j] == 0){
            //moves.push([j,row]);
            moves.push(row*8+j)
        }
    }

  /*
    Moves based on the NORTH-WEST side of the map 
  */
  i = row - 1;
    j = column - 1;
    if (i >= 0 && j >= 0 && board[i][j] == otherP){
        i = i - 1;
        j = j - 1;
        while (i >= 0 && j >= 0 && board[i][j] == otherP){
            i = i - 1;
            j = j - 1;
        }
        if (i >= 0 && j >= 0 && board[i][j] == 0){
            //moves.push([j,i]);
            moves.push(i*8 + j);
        }
    }


    return moves;
}

/*
  mutate board
  Function that thakes the board data and transforms the board to a 2D
  @params: 
  data: board data

  @return:
  board: current state of the board in 2D array
*/
function mutate_board(data){
  var temp = [];
  var board = [];
  for(var i = 1; i<=data.length;i++){
    temp.push(data[i-1]);
    if(i%8 == 0){
      board.push(temp);
      temp = [];
    }
  }
  return board;
}

/*
 FIXED ATTRIBUTES AND CONSTANTS
 these attributes and constants define the Level of the implementation
 MAX_DEPTH: Defines the max depth to go down to
 BLACK: Defines player tile color BLACK is first
 WHITE: Defines player tile color WHITE is second
 EMPTY: Defines code for empty tiles in the board
*/
var MAX_DEPTH = 7;
var BLACK = 1;
var WHITE = 2;
var n = 8;
var EMPTY = 0;


/*
  countPieces
  Heuristic function that counts the number of pieces in the board for each
  Board State Constant BLACK, WHITE, EMPTY
  @params: 
  data: board data

  @return:
  pieces: returns a count of pieces for each player and a count of empty tiles
*/
function countPieces(board){
    //cada posicion es una ficha del tablero
    var pieces = [];
    pieces[EMPTY] = 0;
    pieces[BLACK] = 0;
    pieces[WHITE] = 0;

    for (var i = 0; i < board.length; i++)
        pieces[board[i]]++;

    return pieces;
}

/*
  hasEMPTYSpaces
  Boolean function to evaluate if there are empty spaces in the board
  @params: 
  data: board data

  @return:
  boolean
*/
function hasEMPTYSpaces(board){
    return countPieces(board)[EMPTY] > 0;
}

/*
  getFlippedPositions
  Board Game Logic for Othello moves. Returns the positions that change from each toss. 
  This includes pieces flipped in an indirect manner, using the Othello rules.

  @params: 
  board: Board state
  currentPlayer: id of the current player
  position: Move made

  @return:
  tilePositionstoFlip: returns the tile positions to flip from the move as an array
*/
function getFlippedPositions(board, currentPlayer, position){
    var otherColor = currentPlayer === BLACK ? WHITE : BLACK;
    var deltaDir = {
        left: (-1) * n + (0),
        right: 1*n + 0,
        down: 0*n + 1,
        up: 0*n + (-1),
        leftDown: (-1)*n + 1,
        rightDown: 1*n + 1,
        leftUp: (-1) * n + (-1),
        rightUp: 1*n + (-1)
    };

    var lefts = [deltaDir.left, deltaDir.leftDown, deltaDir.leftUp];

    var rights = [deltaDir.right, deltaDir.rightDown, deltaDir.rightUp];

    var tilePositionsToFlip = [];

    for(var movementKey in deltaDir){

        var movementDelta = deltaDir[movementKey],
            cPosition = position,
            flippedPositions = [],
            foundCurrentColor = false;

        while(cPosition >= 0 && cPosition < (n*n)){
            if(cPosition !== position){

                //si en esta nueva posicion hay una ficha del oponente
                if(board[cPosition] === otherColor){
                    flippedPositions.push(cPosition);
                }else{
                    foundCurrentColor = board[cPosition] !== EMPTY;
                    break;
                }
            }

            if((cPosition % n === 0 && lefts.indexOf(movementDelta)>-1) || ((cPosition % n === n-1) && rights.indexOf(movementDelta) > -1))
                break;

            //moverse
            cPosition += movementDelta;
        }

        if(foundCurrentColor){
            for(var i = 0; i< flippedPositions.length; i++){
                tilePositionsToFlip.push(flippedPositions[i]);
            }
        }
    }
    return tilePositionsToFlip;
}
/*
  getNewBoards
  Board Game Logic for Othello moves. Returns the new board state for each toss. 
  This includes pieces flipped in an indirect manner, using the Othello rules.

  @params: 
  board: Board state
  currentPlayer: id of the current player
  movement: Move made

  @return:
  boardCopy: returns the 2D array of the board state
*/

function getNewBoards(board, currentPlayer, movement){
    var boardCopy = board.slice();
    var flippedPositions = getFlippedPositions(boardCopy, currentPlayer, movement);
    for(var i= 0; i<flippedPositions.length; i++){
        boardCopy[flippedPositions[i]] = currentPlayer;
    }

    boardCopy[movement] = currentPlayer;

    return boardCopy;
}
/*
------------------------------------------------------------------------------------------------
                    _                            _   __ ___  _ 
  _.  / |_    __   |_) ._    ._  o ._   _    |  / \ /__  |  /  
 (_| /  |_)        |   | |_| | | | | | (_|   |_ \_/ \_| _|_ \_ 
                                        _|                     
------------------------------------------------------------------------------------------------
*/
/*
  maxValue
  Independent Function to Calculate the maxValue, to be used for when Maximizing the move
  of the current player in the minimax implementation

  @params: 
  newBoards: current board state
  evaluatedPlayer: id of the player being evaluated
  currentPlayer: id of the current player
  depth: start node depth (between 0 and max_depth, where 0 means it will travel all the nodes until max_depth and any number
  inbetween means it will travel max_depth - depth only )
  max: max value to accept (set to Infinity for standard Minimax)
  min: min value to accept (set to -Infinity for standard Minimax)
  totalMoves: total moves available count
  movement: Move made

  @return:
  Dictionary containing maximization value and the corresponding movement
*/

function maxValue(newBoards, evaluatedPlayer, currentPlayer, depth, max, min,totalMoves){
    var v = -Infinity;

    for (var i = 0; i< newBoards.length; i++){
        var board = newBoards[i];

        v = Math.max(v, minimax(board.next, evaluatedPlayer, currentPlayer, depth+1, max, min,totalMoves).value);
        max = Math.max(max,v);
        if(min <= max){
            return { value: v, movement: board.movement };
        }
    }
    
    var x = 0;
    var index = 0;
    for (var j = 0; j < newBoards.length; j++) {
      var temp = countPieces(newBoards[j].next)[currentPlayer];
      if (temp > x) {
          index = j;
          x = temp;
      }
    }

    return { value: v, movement: newBoards[index].movement }; 
}

/*
  minValue
  Independent Function to Calculate the minValue, to be used for when Minimizing the move
  of the oposing player in the minimax implementation

  @params: 
  newBoards: current board state
  evaluatedPlayer: id of the player being evaluated
  currentPlayer: id of the current player
  depth: start node depth (between 0 and max_depth, where 0 means it will travel all the nodes until max_depth and any number
  inbetween means it will travel max_depth - depth only )
  max: max value to accept (set to Infinity for standard Minimax)
  min: min value to accept (set to -Infinity for standard Minimax)
  totalMoves: total moves available count
  movement: Move made

  @return:
  Dictionary containing maximization value and the corresponding movement
*/

function minValue(newBoards, evaluatedPlayer, currentPlayer, depth, max, min,totalMoves){
    var v = Infinity;

    for (var i = 0; i< newBoards.length; i++){
        var board = newBoards[i];

        v = Math.min(v, minimax(board.next, evaluatedPlayer, currentPlayer, depth+1, max, min,totalMoves).value);
        min = Math.min(min,v);
        if(min <= max){
            return { value: v, movement: board.movement };
        }
    }
    
    var x = 0;
    var index = 0;
    for (var j = 0; j < newBoards.length; j++) {
      var temp = countPieces(newBoards[j].next)[currentPlayer];
      if (temp < x) {
          index = j;
          x = temp;
      }
    }

    return { value: v, movement: newBoards[index].movement }; 
}

function minimax(board, evaluatedPlayer, currentPlayer, depth, max,min,totalMoves){
    //console.log("depth: ",MAX_DEPTH);
    if(depth >= MAX_DEPTH || !hasEMPTYSpaces(board)){
        //retorno un diccionario con dos elementos:
        //1. value es el valor resultante de la euristica (cant fichas)
        //2. movimiento, que en este caso esta indefinido
        return {value: (countPieces(board)[currentPlayer]), movement: undefined};
    }

    var newBoards = [];

    if(totalMoves === null || totalMoves.length === 0){
        return {value: (countPieces(board)[currentPlayer]), movement: undefined};
    }
    //get all posible boards from legal moves
    for(var i =0; i<totalMoves.length; i++){
        var move = totalMoves[i];
        var next =getNewBoards(board, currentPlayer, move);
        newBoards.push({next: next, movement: move});
    }

    var nextPlayer = currentPlayer === BLACK ? WHITE: BLACK;

    //maximizar
    if(evaluatedPlayer === currentPlayer)
        return maxValue(newBoards, evaluatedPlayer, nextPlayer, depth, max,min,totalMoves);
    else //minimizar
        return minValue(newBoards, evaluatedPlayer, nextPlayer, depth, max, min,totalMoves);
}


/*  
---------------------------------------------------------------------------------------------------------------------
  __  _   _     _ ___       _   __ ___  _              _    ___       _      _       _     ___    ___ ___  _       
 (_  / \ /  |/ |_  |    |  / \ /__  |  /     /\  |\ | | \    |  |\/| |_) |  |_ |\/| |_ |\ | |  /\  |   |  / \ |\ | 
 __) \_/ \_ |\ |_  |    |_ \_/ \_| _|_ \_   /--\ | \| |_/   _|_ |  | |   |_ |_ |  | |_ | \| | /--\ |  _|_ \_/ | \| 

  SOCKET LOGIC TO CONNECT WITH 1v1 Board Game Coordinator
  Socket Logic taken from: https://gist.github.com/samuelchvez/f066aeee698ddb37f759c619980bb0c7
  INCLUDES THE IMPLEMENTATION OF THE MINIMAX ALGORITHM AND THE SOCKET LOGIC 
---------------------------------------------------------------------------------------------------------------------
*/
var socket = require('socket.io-client')('http://localhost:3000');  // for example: http://127.0.0.1:3000
//var socket = require('socket.io-client')('http://192.168.0.107:4000');  // for example: http://127.0.0.1:3000
console.log("Connected to the Tournament Successfully");
var tournamentID = 142857;


//readline for username, ttid, role

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


//connecting
socket.on('connect', function(){
  console.log("Logging in");
  rl.question("Enter your username: ",(username) => { 
    socket.emit('signin', {
        user_name: username,
        tournament_id: tournamentID,
        user_role: 'player'
    });
  //console.log("signin in now", username, tournamentID); 
  })

});
//check if its signed in
socket.on('ok_signin', function(){
  console.log("Successfully signed in!");
});


socket.on('ready', function(data){
  console.log("RECIEVED READY");
  console.log("MY TURN TO MOVE");
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var databoard = data.board;

  //logica
  var totalMoves = [];
  var board = mutate_board(databoard);
  for(var i = 0; i<board[0].length;i++){
      for (var j = 0; j < board[0].length; j++) {
          if(board[i][j] == playerTurnID){
              var moves = get_possible_moves(board,j,i,playerTurnID);
              for (var k = 0; k<moves.length;k++){
                  if(!totalMoves.includes(moves[k]))
                      totalMoves.push(moves[k]);
                  //databoard[moves[k]] = 8;
              }
          }
      }
  }

  var play = minimax(databoard, playerTurnID, playerTurnID, 0, -Infinity, Infinity,totalMoves);
  console.log("BOARD");  
  console.log(board);   
  console.log("Player Turn: " + playerTurnID);
  console.log("Possible Moves: ",totalMoves);
  //var len = Math.floor((Math.random() * totalMoves.len) + 0);

 
  socket.emit('play', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID,
      movement: play.movement
    });
  console.log("Made Move: ", play); 
});

//reset availability of a player
socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
  
  // TODO: Your cleaning board logic here
  //PLAYERID = 1 o 2, BLACK or WHITE
  console.log("Game Over!");
  if(playerTurnID == winnerTurnID){
    console.log("Player "+winnerTurnID + " WINS!!!!!!!!!!!!!!!!!!!!!");
  }
  else{
    console.log("Player "+playerTurnID+ " LOSE!!!!!!!!!!!!!!!!!!!!!")
  }
  
  socket.emit('player_ready', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
  console.log("Sent Player Ready");  
});

