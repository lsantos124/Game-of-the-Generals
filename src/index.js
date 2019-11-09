import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import fiveStarGeneral from './pieces/five-star-general.png'
import fourStarGeneral from './pieces/four-star-general.png'
import threeStarGeneral from './pieces/three-star-general.png'
import twoStarGeneral from './pieces/two-star-general.png'
import oneStarGeneral from './pieces/one-star-general.png'
import captain from './pieces/captain.png'
import colonel from './pieces/captain.png'
import hidden from './pieces/hidden.png'
import lieutenantColonel from './pieces/lieutenant colonel.png'
import privateP from './pieces/private.png'
import spy from './pieces/spy.png'
import major from './pieces/major.png'
import sergeant from './pieces/sergeant.png'
import firstLieutenant from './pieces/first-lieutenant.png'
import secondLieutenant from './pieces/second-lieutenant.png'
import flag from './pieces/flag.png'

const pieceImage = {
  "SP" : spy,
  "5S" : fiveStarGeneral,
  "4S" : fourStarGeneral,
  "3S" : threeStarGeneral,
  "2S" : twoStarGeneral,
  "1S" : oneStarGeneral,
  "C" : colonel,
  "LC" : lieutenantColonel,
  "M" : major,
  "CA" : captain,
  "1L" : firstLieutenant,
  "2L" : secondLieutenant,
  "S" : sergeant,
  "P" : privateP,
  "F" : flag
}

function Square(props) {
  let classes = "";

  if (props.adjacent) {
    classes += "square-adjacent";
  }
  else {
    classes += "square-normal";
  }

  let background = pieceImage[props.value];
  let imgClass = "";

  if (props.value) {
    if (props.player == "1") {
      //classes += " player1-background";
      imgClass = "player1-background";

      if (props.currPlayer == "2") {
        background = hidden;
      }
    }
    else if (props.player == "2") { 
      //classes += " player2-background";
      imgClass = "player2-background";

      if (props.currPlayer == "1"){
        background = hidden;
      }
    }
    
    if (props.currPlayer == "wait1" || props.currPlayer == "wait2") {
      background = hidden;
    }
  }

  return (
    <button className={classes} onClick={props.onClick}>
      <img className={imgClass} src={background}/>
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    if (this.props.possibleMoves.includes(i)){
      return (
        <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        adjacent={true}
        player={this.props.playerPositions[i]}
        currPlayer={this.props.player}
        />
      )
    }
    else{
      return (
          <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          adjacent={false}
          player={this.props.playerPositions[i]}
          currPlayer={this.props.player}
          />
        );
    }
  }

  render() {
    const row = [1,2,3,4,5,6,7,8]
    const col = [1,2,3,4,5,6,7,8,9]

    return (
      <div>
        {row.map((row, rowIdx) => {
          return (
            <div className="board-row">
            {
              col.map((col, colIdx) => {
              return this.renderSquare((9*rowIdx)+colIdx)
              })
            }
            </div>
          )
        })

        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    var p1Pieces = ["5S", "4S", "3S", "2S", "1S",
     "C", "LC", "M", "CA", "1L", "2L", "S", "F", "SP", "SP",
     "P", "P", "P", "P", "P", "P"]

    var p2Pieces = ["5S", "4S", "3S", "2S", "1S",
     "C", "LC", "M", "CA", "1L", "2L", "S", "F", "SP", "SP",
     "P", "P", "P", "P", "P", "P"]

    this.state = {
      squares: Array(72).fill(null),
      playerPositions : Array(72).fill(null),
      turn: "1",
      selected: null,
      possibleMoves: Array(4).fill(null),
      phase: "player1_setup",
      p1PiecesToPlace: p1Pieces,
      p2PiecesToPlace: p2Pieces,
    }
  }

  randomize() {
    const current = this.state;
    const squares = current.squares.slice();
    const playerPositions = current.playerPositions.slice();
    
    if (this.state.phase == "player1_setup") {
      var pieces = ["5S", "4S", "3S", "2S", "1S", "C", "LC", 
                    "M", "CA", "1L", "2L", "S", "F", "SP", "SP",
                    "P", "P", "P", "P", "P", "P"]

      var positions = Array(27).fill(null);

      while (pieces.length > 0) {
        var idx = Math.floor(Math.random() * 27);
        if (positions[idx] == null) {
          positions[idx] = pieces.shift();
        }
      }

      for (let i = 0; i < positions.length; i++) {
        if (positions[i] != null) {
          squares[i+45] = positions[i];
          playerPositions[i+45] = "1";
        }
      }

      this.setState({
        turn: "2",
        squares: squares,
        playerPositions: playerPositions,
        p1PiecesToPlace: [],
        phase: "player2_setup",
      });
    }
    else if (this.state.phase == "player2_setup") {
      var pieces = ["5S", "4S", "3S", "2S", "1S", "C", "LC", 
                    "M", "CA", "1L", "2L", "S", "F", "SP", "SP",
                    "P", "P", "P", "P", "P", "P"]

      var positions = Array(27).fill(null);

      while (pieces.length > 0) {
        var idx = Math.floor(Math.random() * 27);
        if (positions[idx] == null) {
          positions[idx] = pieces.shift();
        }
      }

      for (let i = 0; i < positions.length; i++) {
        if (positions[i] != null) {
          squares[i] = positions[i];
          playerPositions[i] = "2";
        }
      }

      this.setState({
        turn: "wait1",
        squares: squares,
        playerPositions: playerPositions,
        p2PiecesToPlace: [],
        phase: "game",
      });
    }
  }

  getAdjacentPositions(i) {
    const adjacentPos = Array(4).fill(null);

    const current = this.state;
    const row = Math.round(i / 9)
    const col = i % 9 

    // check left neighbor
    if (col - 1 >= 0 && current.playerPositions[i-1] != current.playerPositions[i]) {
      adjacentPos[0] = i-1
    }

    // check right neighbor
    if (col - 1 <= 8 && current.playerPositions[i+1] != current.playerPositions[i]) {
      adjacentPos[1] = i+1
    }

    // check top neighbor
    if (row - 1 >= 0 && current.playerPositions[i-9] != current.playerPositions[i]) {
      adjacentPos[2] = i-9
    }

    // check bottom neighbor
    if (row + 1 <= 8 && current.playerPositions[i+9] != current.playerPositions[i]) {
      adjacentPos[3] = i+9
    }

    return adjacentPos;
  }

  handleClick(i) {
    const row = Math.floor(i / 9);
    const col = i % 9;

    const current = this.state;
    const squares = current.squares.slice();
    const playerPositions = current.playerPositions.slice();
    var currTurn = current.turn;
    var currPhase = current.phase;

    // player 1 set up phase
    if (this.state.phase == "player1_setup") {
      if (row > 4) {
        var player1pieces = this.state.p1PiecesToPlace;
        // Condition 1: clicked empty tile, place piece
        if (player1pieces.length > 0) {
          if (squares[i] == null) {
            squares[i] = player1pieces.shift();
            playerPositions[i] = "1";
          }
          // Condition 2: clicked non-empty tile, place tile back on list
          else {
            player1pieces.unshift(squares[i]);
            squares[i] = null;
            playerPositions[i] = null;
          }

          this.setState({
            squares: squares,
            p1PiecesToPlace: player1pieces,
            playerPositions: playerPositions,
          });
        }
        else { // all pieces placed
          this.setState({
            turn: "2",
            phase: "player2_setup",
          });
        }
      }
      else {
        alert("Cannot place there");
      }
    }
    // player 2 set up phase
    else if (this.state.phase == "player2_setup") {
      if (row < 3) {
        var player2pieces = current.p2PiecesToPlace;

        // Condition 1: clicked empty tile, place piece
        if (player2pieces.length > 0) {
          if (squares[i] == null) {
            squares[i] = player2pieces.shift();
            playerPositions[i] = "2";
          }
          // Condition 2: clicked non-empty tile, place tile back on list
          else {
            player2pieces.unshift(squares[i]);
            squares[i] = null;
            playerPositions[i] = null;
          }

          this.setState({
            squares: squares,
            p2PiecesToPlace: player2pieces,
            playerPositions: playerPositions,
          });
        }
        else { // all pieces placed
          this.setState({
            turn: "wait1",
            phase: "game",
          });
        }
      }
      else {
        alert("Cannot place there");
      }
    }
    // in game
    else if (this.state.phase == "game") { // in game
      if (this.state.turn == "wait1"){
        this.setState({
          turn: "1"
        });
      }
      else if (this.state.turn == "wait2"){
        this.setState({
          turn: "2"
        })
      }
      else{
        let adjacent = false;
        if (this.state.possibleMoves.includes(i))
          adjacent = true;

        // check if user clicked a high-lighted adjacent tile
        if (adjacent){
          if (squares[i] == null){ // empty tile
            squares[i] = squares[current.selected];
            playerPositions[i] = playerPositions[current.selected];
            squares[current.selected] = null;
            playerPositions[current.selected] = null;

            this.setState({
                squares: squares,
                turn: (current.turn == "1" ? "wait2" : "wait1"),
                selected: null,
                possibleMoves: Array(4).fill(null),
                playerPositions: playerPositions,
              });
          }
          else if (playerPositions[i] == playerPositions[current.selected]){ // picked one of own pieces
            this.setState({
              squares: squares,
              selected: null,
              possibleMoves: Array(4).fill(null),
            });
          }
          else { // challenge
            // special handling for spies to see if current piece is a spy
            if (squares[current.selected] == "SP" && squares[i] == "P"){
              squares[current.selected] = null;
              playerPositions[current.selected] = null;

              currTurn = (currTurn == "1" ? "wait2" : "wait1");
            }
            else if (squares[current.selected] == "P" && squares[i] == "SP"){
              squares[i] = squares[current.selected];
              playerPositions[i] = playerPositions[current.selected];
              squares[current.selected] = null;
              playerPositions[current.selected] = null;

              currTurn = (currTurn == "1" ? "wait2" : "wait1");
            }
            else { // normal
              if (squares[i] == "F") {
                if (squares[current.selected] == "F") { // tie
                  currTurn = "tie";
                }
                currPhase = "end";
              }

              if (squares[current.selected] == "F") {
                currPhase = "end";
              }

              if (currTurn != "tie") {
                currTurn = (currTurn == "1" ? "wait2" : "wait1");
              }

              var diff = pieces[squares[current.selected]] - pieces[squares[i]];

              if (diff > 0) { // piece won
                squares[i] = squares[current.selected];
                playerPositions[i] = playerPositions[current.selected];
                squares[current.selected] = null;
                playerPositions[current.selected] = null;
              }
              else if (diff < 0) { // other piece won
                squares[current.selected] = null;
                playerPositions[current.selected] = null;
              }
              else { // tie - both die
                squares[current.selected] = null;
                playerPositions[current.selected] = null;
                squares[i] = null;
                playerPositions[i] = null;
              }
            }

            this.setState({
              squares: squares,
              turn: currTurn,
              phase: currPhase,
              selected: null,
              possibleMoves: Array(4).fill(null),
              playerPositions: playerPositions,
            });
          }
        }
        else{
          // User clicked piece to move
          if (current.selected == null && current.squares[i] != null && playerPositions[i] == current.turn){
            const adjacentPositions = this.getAdjacentPositions(i);

            this.setState({
              squares: squares,
              selected: i,
              possibleMoves: adjacentPositions,
            });
          }
          // user clicked empty tile
          else {
            this.setState({
              squares: squares,
              selected: null,
              possibleMoves: Array(4).fill(null),
            });
          } 
        }
      }
    }
    else { 
      alert("Game is Over");
    }
  }

  render() {
    let status;
    if (this.state.phase == "end") {
      status = "Winner: " + (this.state.turn == "wait1" ? "Player 1" : "Player 2");
    }
    else {
      if (this.state.turn == "wait1"){
        status = "Click anywhere on the board to begin Player 1's turn"
      }
      else if (this.state.turn == "wait2"){
        status = "Click anywhere on the board to begin Player 2's turn"
      }
      else {
        status = "Current Turn: Player " + this.state.turn;
      }
    }

    let piecesToPlace = [];
    let setup = false;
    if (this.state.phase == "player1_setup"){
      piecesToPlace = this.state.p1PiecesToPlace;
      setup = true;
    }
    else if (this.state.phase == "player2_setup"){
      piecesToPlace = this.state.p2PiecesToPlace;
      setup = true;
    }

    return (
      <div className="game">
        <div className="game-board">
        <div>{status}</div>
          <Board 
            squares={this.state.squares}
            onClick={(i,adjacent) => this.handleClick(i)} 
            possibleMoves={this.state.possibleMoves}
            playerPositions={this.state.playerPositions}
            player={this.state.turn}
          />
        </div>
        <div class={setup ? '' : 'hidden'}>
          <div>
            Current Piece:{this.state.p1PiecesToPlace[0]}
          </div>
          {
            piecesToPlace.map((piece) => {
              return <div>{piece}</div>
            })
          }
          <button onClick={() => this.randomize()}>Randomize</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

const pieces = {
  "SP" : 14,
  "5S" : 13,
  "4S" : 12,
  "3S" : 11,
  "2S" : 10,
  "1S" : 9,
  "C" : 8,
  "LC" : 7,
  "M" : 6,
  "CA" : 5,
  "1L" : 4,
  "2L" : 3,
  "S" : 2,
  "P" : 1,
  "F" : 0
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
