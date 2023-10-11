import {
  PieceEnum,
  WinningPiecesType,
  boardStateDictType,
  columns,
  rows,
} from "./board.utils";

export enum GameStepEnum {
  playing,
  draw,
  win,
}

// TODO: Use same utils file for front and back ?
// TODO: Delete useless: checkLeft, checkDown, checkUpRight, checkDownRight ??

function checkLeft(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (column < 3) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row][column - 1] == actualPieceColor &&
    boardStateDict[row][column - 2] == actualPieceColor &&
    boardStateDict[row][column - 3] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkRight(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (column > 3) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row][column + 1] == actualPieceColor &&
    boardStateDict[row][column + 2] == actualPieceColor &&
    boardStateDict[row][column + 3] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkUp(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (row < 3) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row - 1][column] == actualPieceColor &&
    boardStateDict[row - 2][column] == actualPieceColor &&
    boardStateDict[row - 3][column] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkDown(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (row > 2) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row + 1][column] == actualPieceColor &&
    boardStateDict[row + 2][column] == actualPieceColor &&
    boardStateDict[row + 3][column] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkDownLeft(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (row > 2 || column < 4) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row + 1][column - 1] == actualPieceColor &&
    boardStateDict[row + 2][column - 2] == actualPieceColor &&
    boardStateDict[row + 3][column - 3] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkUpLeft(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (row < 4 || column < 4) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row - 1][column - 1] == actualPieceColor &&
    boardStateDict[row - 2][column - 2] == actualPieceColor &&
    boardStateDict[row - 3][column - 3] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkUpRight(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (row < 4 || column > 3) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row - 1][column + 1] == actualPieceColor &&
    boardStateDict[row - 2][column + 2] == actualPieceColor &&
    boardStateDict[row - 3][column + 3] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkDownRight(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  if (row > 2 || column > 3) return;

  const actualPieceColor = boardStateDict[row][column];
  if (
    boardStateDict[row + 1][column + 1] == actualPieceColor &&
    boardStateDict[row + 2][column + 2] == actualPieceColor &&
    boardStateDict[row + 3][column + 3] == actualPieceColor
  ) {
    return true;
  } else {
    return false;
  }
}

function checkWin(
  row: number,
  column: number,
  boardStateDict: boardStateDictType
) {
  const winningPieces: WinningPiecesType = [];

  if (boardStateDict[row][column] == PieceEnum.empty) return [];

  if (checkLeft(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row, column: column - 1 },
        { row: row, column: column - 2 },
        { row: row, column: column - 3 },
      ]
    );
  if (checkRight(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row, column: column + 1 },
        { row: row, column: column + 2 },
        { row: row, column: column + 3 },
      ]
    );
  if (checkUp(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row - 1, column },
        { row: row - 2, column },
        { row: row - 3, column },
      ]
    );
  if (checkDown(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row + 1, column },
        { row: row + 2, column },
        { row: row + 3, column },
      ]
    );
  if (checkDownLeft(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row + 1, column: column - 1 },
        { row: row + 2, column: column - 2 },
        { row: row + 3, column: column - 3 },
      ]
    );
  if (checkUpLeft(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row - 1, column: column - 1 },
        { row: row - 2, column: column - 2 },
        { row: row - 3, column: column - 3 },
      ]
    );
  if (checkUpRight(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row - 1, column: column + 1 },
        { row: row - 2, column: column + 2 },
        { row: row - 3, column: column + 3 },
      ]
    );
  if (checkDownRight(row, column, boardStateDict))
    winningPieces.push(
      ...[
        { row, column },
        { row: row + 1, column: column + 1 },
        { row: row + 2, column: column + 2 },
        { row: row + 3, column: column + 3 },
      ]
    );

  return winningPieces;
}

export function checkWinGlobal(board: boardStateDictType) {
  const totalWinningPieces: WinningPiecesType = [];

  for (const row of rows) {
    for (const column of columns) {
      const winningPieces = checkWin(row, column, board);
      if (winningPieces.length > 0) {
        totalWinningPieces.push(...winningPieces);
      }
    }
  }
  return totalWinningPieces;
}

export function checkNull(board: boardStateDictType) {
  const emptyPos = board[0].filter((piece) => piece == PieceEnum.empty);
  if (emptyPos.length == 0) {
    console.log("tie");
    return true;
  } else return false;
}
