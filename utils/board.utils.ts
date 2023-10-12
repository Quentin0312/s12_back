export enum PieceEnum {
  red = "red",
  yellow = "yellow",
  empty = "white",
}

export type PlayerMoveType = {
  row: number;
  column: number;
};

export type boardStateDictType = { [key: number]: PieceEnum[] };
export type WinningPiecesType = { row: number; column: number }[];

export const rows = [0, 1, 2, 3, 4, 5];
export const columns = [0, 1, 2, 3, 4, 5, 6];

export function getInitialBoard() {
  const initialBoardStateDict: boardStateDictType = {};

  for (const row of rows) {
    initialBoardStateDict[row] = Array(7).fill(PieceEnum.empty);
  }
  return initialBoardStateDict;
}

export function updateBoard(
  row: number,
  column: number,
  board: boardStateDictType,
  piece: PieceEnum
) {
  board[row][column] = piece;
  return board;
}
