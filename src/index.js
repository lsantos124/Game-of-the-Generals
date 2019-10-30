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
        onClick={() => this.props.onClick(i,true)}
        adjacent={true}
        />
      )
    }
    else{
      return (
          <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i,false)}
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
    boardStart[1] = 'O';
    boardStart[2] = 'O';
    this.state = {
      squares: boardStart,
      xIsNext: true,
      selected: null,
      possibleMoves: Array(4).fill(null),
    }
  }

  // Function used for debugging state
  printState() {
    alert("Current State: ")
    alert(this.state.squares);
    alert(this.state.selected);
    alert(this.state.possibleMoves);
  }

  getAdjacentPositions(i) {
    const adjacentPos = Array(4).fill(null);

    const current = this.state;
    const row = Math.round(i / 9)
    const col = i % 9 

    // check left neighbor
    if (col - 1 >= 0 && current.squares[i-1] == null) {
      adjacentPos[0] = i-1
    }

    // check right neighbor
    if (col - 1 <= 8 && current.squares[i+1] == null) {
      adjacentPos[1] = i+1
    }

    // check top neighbor
    if (row - 1 >= 0 && current.squares[i-9] == null) {
      adjacentPos[2] = i-9
    }

    // check bottom neighbor
    if (row + 1 >= 0 && current.squares[i+9] == null) {
      adjacentPos[3] = i+9
    }

    return adjacentPos;
  }

  handleClick(i, adjacent) {
    const row = Math.round(i / 9)
    const col = i % 9 

    const current = this.state;
    const squares = current.squares.slice();

    // check if user clicked a high-lighted adjacent tile
    if (adjacent){
      squares[i] = squares[current.selected];
      squares[current.selected] = null;

      this.setState({
          squares: squares,
          xIsNext: !current.xIsNext,
          selected: null,
          possibleMoves: Array(4).fill(null),
        });
    }
    else{
      // User clicked piece to move
      if (current.selected == null && current.squares[i] == "O"){
        const adjacentPositions = this.getAdjacentPositions(i);

        this.setState({
          squares: squares,
          xIsNext: !current.xIsNext,
          selected: i,
          possibleMoves: adjacentPositions,
        });
      }
      // user clicked empty tile
      else {
        this.setState({
          squares: squares,
          xIsNext: !current.xIsNext,
          selected: null,
          possibleMoves: Array(4).fill(null),
        });
      } 
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={this.state.squares}
            onClick={(i,adjacent) => this.handleClick(i, adjacent)} 
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
