import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.adjacent){
    return (
      <button className="square-adjacent" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  else{
    return (
      <button className="square-normal" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    if (this.props.possibleMoves.includes(i)){
      return (
        <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        adjacent={true}
        />
      )
    }
    else{
      return (
          <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          adjacent={false}
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
    const boardStart = Array(72).fill(null);

    var p1Pieces = ["5S", "4S", "3S", "2S", "1S",
     "C", "LC", "M", "CA", "1L", "2L", "S", "F", "SP", "SP",
     "P", "P", "P", "P", "P", "P"]

    var p2Pieces = ["5S", "4S", "3S", "2S", "1S",
     "C", "LC", "M", "CA", "1L", "2L", "S", "F", "SP", "SP",
     "P", "P", "P", "P", "P", "P"]

    this.state = {
      squares: boardStart,
      xIsNext: true,
      selected: null,
      possibleMoves: Array(4).fill(null),
      phase: "player1",
      p1PiecesToPlace: p1Pieces,
      p2PiecesToPlace: p2Pieces,
    }

    //alert("constructor");
    this.printState();
  }

  // Function used for debugging state
  printState() {
    //alert("Current State: " + this.state.phase);
    //alert(this.state.p1PiecesToPlace);
    //alert(this.state.squares);
    //alert(this.state.selected);
    //alert(this.state.possibleMoves);
  }

  getAdjacentPositions(i) {
    alert("adjacent");
    this.printState();

    const adjacentPos = Array(4).fill(null);

    const current = this.state;
    const row = Math.round(i / 9)
    const col = i % 9 

    // check left neighbor
    if (col - 1 >= 0) {
      adjacentPos[0] = i-1
    }

    // check right neighbor
    if (col - 1 <= 8) {
      adjacentPos[1] = i+1
    }

    // check top neighbor
    if (row - 1 >= 0) {
      adjacentPos[2] = i-9
    }

    // check bottom neighbor
    if (row + 1 >= 0) {
      adjacentPos[3] = i+9
    }

    return adjacentPos;
  }

  handleClick(i) {

    //alert(this.state.p1piecesToPlace);
    //alert("handleclick");
    this.printState();

    const row = Math.round(i / 9)
    const col = i % 9 

    const current = this.state;
    const squares = current.squares.slice();

    //alert(this.state.p1PiecesToPlace[0]);
    if (this.state.phase == "player1") {
      var player1pieces = this.state.p1PiecesToPlace;

      // Condition 1: clicked empty tile, place piece
      if (player1pieces.length > 0) {
        if (squares[i] == null) {
          squares[i] = player1pieces.shift();
        }
        // Condition 2: clicked non-empty tile, place tile back on list
        else {
          player1pieces.unshift(squares[i]);
          squares[i] = null;
        }

        this.setState({
          squares: squares,
          xIsNext: !current.xIsNext,
          selected: null,
          possibleMoves: Array(4).fill(null),
          phase: "player1",
          p1PiecesToPlace: player1pieces,
          p2PiecesToPlace: current.p2PiecesToPlace,
        });
      }
      else { // all pieces placed
        this.setState({
          squares: squares,
          xIsNext: !current.xIsNext,
          selected: null,
          possibleMoves: Array(4).fill(null),
          phase: "player2",
          p1PiecesToPlace: current.p1PiecesToPlace,
          p2PiecesToPlace: current.p2PiecesToPlace,
        });
        alert("done player1")
      }
    }
    else if (this.state.phase == "player2") {
      var player2pieces = this.state.p2PiecesToPlace;

      // Condition 1: clicked empty tile, place piece
      if (player2pieces.length > 0) {
        if (squares[i] == null) {
          squares[i] = player2pieces.shift();
        }
        // Condition 2: clicked non-empty tile, place tile back on list
        else {
          player2pieces.unshift(squares[i]);
          squares[i] = null;
        }

        this.setState({
          squares: squares,
          xIsNext: !current.xIsNext,
          selected: null,
          possibleMoves: Array(4).fill(null),
          phase: "player2",
          p1PiecesToPlace: current.p1PiecesToPlace,
          p2PiecesToPlace: player2pieces,
        });
      }
      else { // all pieces placed
        this.setState({
          squares: squares,
          xIsNext: !current.xIsNext,
          selected: null,
          possibleMoves: Array(4).fill(null),
          phase: "game",
          p1PiecesToPlace: current.p1PiecesToPlace,
          p2PiecesToPlace: player2pieces,
        });
      }
    }
    else { // in game
      let adjacent = false;
      if (this.state.possibleMoves.includes(i))
        adjacent = true;

      // check if user clicked a high-lighted adjacent tile
      if (adjacent){
        if (squares[i] == null){
          squares[i] = squares[current.selected];
          squares[current.selected] = null;

          this.setState({
              squares: squares,
              xIsNext: !current.xIsNext,
              selected: null,
              possibleMoves: Array(4).fill(null),
              phase: "game",
              p1PiecesToPlace: [],
              p2PiecesToPlace: [],
            });
        }
        else {
                  // special handling for spies to see if current piece is a spy
          if (squares[current.selected] == "SP") {
            if (squares[i] == "SP") { // other piece is also spy
              squares[current.selected] = null;
              squares[i] = null;
            }
            else if (squares[i] == "P") { // other piece is a private, spy dies
              squares[current.selected] = null;
            }
            else { // piece is anything, automatically dies
              squares[i] = squares[current.selected];
              squares[current.selected] = null;
            }
          }
          else { // normal
            var diff = pieces[squares[current.selected]] - pieces[squares[i]];

            if (diff > 0) { // piece won
              squares[i] = squares[current.selected];
              squares[current.selected] = null;
            }
            else if (diff < 0) { // other piece won
              squares[current.selected] = null;
            }
            else { // tie - both die
              squares[current.selected] = null;
              squares[i] = null;
            }
          }

          this.setState({
            squares: squares,
            xIsNext: !current.xIsNext,
            selected: null,
            possibleMoves: Array(4).fill(null),
            phase: "game",
            p1PiecesToPlace: [],
            p2PiecesToPlace: [],
          });
        }
      }
      else{
        // User clicked piece to move
        if (current.selected == null && current.squares[i] != null){
          const adjacentPositions = this.getAdjacentPositions(i);

          this.setState({
            squares: squares,
            xIsNext: !current.xIsNext,
            selected: i,
            possibleMoves: adjacentPositions,
            phase: "game",
            p1PiecesToPlace: [],
            p2PiecesToPlace: [],
          });
        }
        // user clicked empty tile
        else {
          this.setState({
            squares: squares,
            xIsNext: !current.xIsNext,
            selected: null,
            possibleMoves: Array(4).fill(null),
            phase: "game",
            p1PiecesToPlace: [],
            p2PiecesToPlace: [],
          });
        } 
      }
    }
  }

  render() {
    //alert("phase " + this.state.phase);
    // check if still in set up phase
    if (this.state.phase == "player1"){
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={this.state.squares}
              onClick={(i,adjacent) => this.handleClick(i)} 
              possibleMoves={this.state.possibleMoves}
            />
          </div>
          <div>
            <div>
              Current Piece:{this.state.p1PiecesToPlace[0]}
            </div>
            {
              this.state.p1PiecesToPlace.map((piece) => {
                return <div>{piece}</div>
              })
            }
          </div>
        </div>
      );
    }
    else if (this.state.phase == "player2"){
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={this.state.squares}
              onClick={(i,adjacent) => this.handleClick(i)} 
              possibleMoves={this.state.possibleMoves}
            />
          </div>
          <div>
            <div>
              Current Piece:{this.state.p2PiecesToPlace[0]}
            </div>
            {
              this.state.p2PiecesToPlace.map((piece) => {
                return <div>{piece}</div>
              })
            }
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={this.state.squares}
              onClick={(i,adjacent) => this.handleClick(i)} 
              possibleMoves={this.state.possibleMoves}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={this.state.squares}
            onClick={(i,adjacent) => this.handleClick(i)} 
            possibleMoves={this.state.possibleMoves}
          />
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
