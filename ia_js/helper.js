// import { Game } from "./game";
// const {Game} = require("./game")
const connect4 = require('./Game');

const boardTo1DArrayFiltered = (board, playerId) => {
    // this function returns the board in a single array with
    // only the playerId chips appearing
    return board.reduce((array, line) => array.concat(
      line.map((cellValue) => {
        if (cellValue === playerId) return 1;
        else return 0;
      })
    ), []);
}
exports.boardToConvolutionalVol = (board, playerId) => {
    const opponentId = playerId === 1 ? 2 : 1;
      const vol = {
        sx: 6,
        sy: 7,
        depth: 2,
        w: new Float64Array(boardTo1DArrayFiltered(board, playerId)
          .concat(boardTo1DArrayFiltered(board, opponentId))),
        dw: new Float64Array(6 * 7 * 2).fill(0),
      }
      return vol;
}

exports.boardTo1DArrayFormatted = (board, playerId) => {
  return board.reduce((array, line) => array.concat(
    line.map((cellValue) => {
      if (cellValue === 0) return 0;
      else if (cellValue === playerId) return 1;
      return -1;
    })
  ), []);
}

exports.randomChoice = (choices) => {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

exports.getArrayFromIndex = (columnIndex, value) => {

  return new Array(7).fill(0).map((_, index) => (index === columnIndex ? value : 0))
}

exports.evaluateLearning = (network) => {
  const benchMark = [];
  // const game1 = new Game();
  const game1 = new connect4.Game();

  game1.playChip(1, 1);
  game1.playChip(2, 0);
  game1.playChip(1, 2);
  game1.playChip(2, 6);
  game1.playChip(1, 3);
  game1.playChip(2, 1);
  benchMark.push(network.activate(game1.get1DArrayFormatted(1)));

  // const game2 = new Game();
  const game2 = new connect4.Game();

  game2.playChip(2, 0);
  game2.playChip(1, 1);
  game2.playChip(2, 0);
  game2.playChip(1, 1);
  game2.playChip(2, 6);
  game2.playChip(1, 1);
  game2.playChip(2, 2);
  benchMark.push(network.activate(game2.get1DArrayFormatted(1)));

  // const game3 = new Game();
  const game3 = new connect4.Game();

  game3.playChip(1, 0);
  game3.playChip(2, 0);
  game3.playChip(1, 1);
  game3.playChip(2, 6);
  game3.playChip(1, 6);
  game3.playChip(2, 2);
  game3.playChip(1, 3);
  game3.playChip(2, 1);
  game3.playChip(1, 1);
  game3.playChip(2, 3);
  game3.playChip(1, 2);
  game3.playChip(2, 0);
  benchMark.push(network.activate(game3.get1DArrayFormatted(1)));

  return benchMark;
}