import { Game } from "./game";

const boardTo1DArrayFiltered = (board: Array<Array<number>>, playerId: number): Array<number> => {
    // this function returns the board in a single array with
    // only the playerId chips appearing
    return board.reduce((array, line) => array.concat(
      line.map((cellValue) => {
        if (cellValue === playerId) return 1;
        else return 0;
      })
    ), []);
}
export function boardToConvolutionalVol (board: Array<Array<number>>, playerId: number) {
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

export function boardTo1DArrayFormatted (board: Array<Array<number>>, playerId: number): Array<number> {
  return board.reduce((array, line) => array.concat(
    line.map((cellValue) => {
      if (cellValue === 0) return 0;
      else if (cellValue === playerId) return 1;
      return -1;
    })
  ), []);
}

export function randomChoice (choices: Array<number>): number {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

export function getArrayFromIndex (columnIndex: number, value: number): Array<number> {

  return new Array(7).fill(0).map((_, index) => (index === columnIndex ? value : 0))
}

export function evaluateLearning (network: any): Array<number> {
  const benchMark = [];
  const game1 = new Game();
  game1.playChip(1, 1);
  game1.playChip(2, 0);
  game1.playChip(1, 2);
  game1.playChip(2, 6);
  game1.playChip(1, 3);
  game1.playChip(2, 1);
  benchMark.push(network.activate(game1.get1DArrayFormatted(1)));

  const game2 = new Game();
  game2.playChip(2, 0);
  game2.playChip(1, 1);
  game2.playChip(2, 0);
  game2.playChip(1, 1);
  game2.playChip(2, 6);
  game2.playChip(1, 1);
  game2.playChip(2, 2);
  benchMark.push(network.activate(game2.get1DArrayFormatted(1)));

  const game3 = new Game();
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