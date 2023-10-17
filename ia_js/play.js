// import { Network } from "synaptic";
// import { Game } from "./game";
// import { formatInput, predict } from "./neuralNetwork";
// import { randomChoice } from "./helper";
// const { Game } = require("./game");
const connect4 = require("./Game");

const { formatInput, predict } = require("./neuralNetwork");
const { randomChoice } = require("./helper");

exports.playGame = (epsilon, myNetwork, display) => {
  let winnerBoardStates = [];
  let winnerPlays = [];
  let loserBoardStates = [];
  let loserPlays = [];
  const game = new connect4.Game();
  const boardStatesAsPlayer1 = [];
  const boardStatesAsPlayer2 = [];
  const playsAsPlayer1 = [];
  const playsAsPlayer2 = [];

  let playerIdToPlay = 1;
  let pat = false;
  let winner = 0;
  while (!pat && !winner) {
    // Play
    const explore = !(Math.random() < epsilon);
    let columnIndex;
    let output = [];
    let formattedBoard = formatInput(game.board, playerIdToPlay);
    if (!explore) {
      // console.log("in explore cond");
      output = predict(myNetwork, formattedBoard);
      columnIndex = output.indexOf(Math.max(...output));
    } else {
      // console.log("not in explore cond");
      columnIndex = randomChoice([0, 1, 2, 3, 4, 5, 6]);
    }
    const playAgain = game.playChip(playerIdToPlay, columnIndex);
    // The same player may have to play again if the column he chose was full
    if (!playAgain) {
      // Save board states and plays
      if (playerIdToPlay === 1) {
        boardStatesAsPlayer1.push(formattedBoard);
        playsAsPlayer1.push(columnIndex);
      } else if (playerIdToPlay === 2) {
        boardStatesAsPlayer2.push(formattedBoard);
        playsAsPlayer2.push(columnIndex);
      }

      // Check for wins
      const gameState = game.checkForWin();
      switch (gameState) {
        case 0:
          // Nobody won, switch player
          playerIdToPlay = playerIdToPlay === 1 ? 2 : 1;
          break;
        case -1:
          // Pat
          pat = true;
          break;
        case 1:
          // Player 1 won
          winner = 1;
          break;
        case 2:
          // Player 2 won
          winner = 2;
          break;
        default:
          break;
      }
    } else {
      // Maybe backpropagate the fact that it played bad
      // For the moment, just ignore
    }
  }
  if (winner > 0) {
    winnerBoardStates =
      winner === 1 ? boardStatesAsPlayer1 : boardStatesAsPlayer2;
    winnerPlays = winner === 1 ? playsAsPlayer1 : playsAsPlayer2;
    loserBoardStates =
      winner === 1 ? boardStatesAsPlayer2 : boardStatesAsPlayer1;
    loserPlays = winner === 1 ? playsAsPlayer2 : playsAsPlayer1;
  }
  if (display) game.display();
  return {
    winnerBoardStates,
    winnerPlays,
    loserBoardStates,
    loserPlays,
  };
};
