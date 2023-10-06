import { backPropagate, evaluate, getTrainer, initNN } from "./neuralNetwork";
import { playGame } from "./play";
import { trainOnPreviousPlays } from "./qlearning";
import fs from "fs"

// TODO: remettre en place la possibilité d'utiliser le CNN

// -------------- PARAMETERS ---------------- //
// number of games to play
const LEARN_TIMES = 360000;
// learningRate is progressively decreased with the number of games until
// the final value LR_INIT/LR_FINAL_FRACTION
const LR_INIT = 0.0001;
const LR_FINAL_FRACTION = 10;
// epsilon is the ratio between exploration and exploitation
// it can evolve along the games played
const EPSILON_INIT = 0.1;
const EPSILON_FINAL = 0.4;
// gamma is the fraction attributed to the maximum Q Value of the next state
const GAMMA = 0.3;
// reward awarded to the final play that led to victory
const REWARD = 100;
// discount applied to the reward awarded to the previous plays that led to victory
const DISCOUNT = 0.8;
// reward (or - reward) awarded to prevent the bot to lose
const SIDE_REWARD = 75;
// ------------------------------------------ //


const myNetwork = initNN()
const myTrainer = getTrainer(myNetwork)

for (let i = 0; i < LEARN_TIMES; i++) {

  const display = (i % (LEARN_TIMES / 100) === 0) ? true : false;

  // change ratio between exploration and exploitation
  const epsilon = EPSILON_INIT + (EPSILON_FINAL - EPSILON_INIT) * i / LEARN_TIMES; // ! ?

  // play a game of connect4
  const gameInfo = playGame(epsilon, myNetwork, display);

  // get game info back
  const winnerBoardStates = gameInfo.winnerBoardStates;
  const winnerPlays = gameInfo.winnerPlays;
  const loserBoardStates = gameInfo.loserBoardStates;
  const loserPlays = gameInfo.loserPlays;
  const winnerPlaysLength = winnerPlays.length;
  const loserPlaysLength = loserPlays.length;

    // adapt learning rate
    const learningRate = LR_INIT / (1 + (LR_FINAL_FRACTION - 1) * i / LEARN_TIMES);

    if (winnerBoardStates.length !== 0) {
      // backpropagate full reward for the final winner play
      backPropagate(
        myTrainer,
        winnerBoardStates[winnerPlaysLength - 1],
        REWARD,
        winnerPlays[winnerPlaysLength - 1],
        learningRate
      )
  
      // train on all the plays that led to victory
      trainOnPreviousPlays(
        myNetwork,
        myTrainer,
        winnerBoardStates,
        winnerPlays,
        learningRate,
        REWARD,
        DISCOUNT,
        GAMMA,
      );
      
      if (winnerPlays[winnerPlaysLength - 1] !== loserPlays[loserPlaysLength - 1]) {
        // backpropagate reward for the final loser play if he could have prevented it
        backPropagate(
          myTrainer,
          loserBoardStates[loserPlaysLength - 1],
          SIDE_REWARD,
          winnerPlays[winnerPlaysLength - 1],
          learningRate
        )
      } else {
        // backpropagate punishment for the final loser play if he permitted it
        backPropagate(
          myTrainer,
          loserBoardStates[loserPlaysLength - 1],
          - SIDE_REWARD,
          loserPlays[loserPlaysLength - 1],
          learningRate
        )
      }
    }
    if (i % (LEARN_TIMES / 100) === 0) {
      console.log('HVD 410', evaluate(myNetwork));
    }
}

// write final weights
const networkWeights = myNetwork && myNetwork.toJSON();
const json = JSON.stringify(networkWeights);

fs.writeFile(`networkWeights.json`, json, 'utf8', (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
