import { backPropagate, predict } from "./neuralNetwork";

export function trainOnPreviousPlays (
    myNetwork: any,
    myTrainer: any,
    boards: Array<any>,
    plays: Array<number>,
    learningRate: number,
    reward: number,
    discount: number,
    gamma: number,
  ) {
    const playsLength = plays.length;
    let previousQValue = predict(
      myNetwork,
      boards[playsLength - 1],
    );
    
    // backpropagate on the previous winnerPlays
    for (let playIndex = playsLength - 2; playIndex >= 0; playIndex--) {
      backPropagate(
        myTrainer,
        boards[playIndex],
        discount ** (playsLength - playIndex - 1) * reward + gamma * Math.max(...previousQValue),
        plays[playIndex],
        learningRate
      )
      previousQValue = predict(
        myNetwork,
        boards[playIndex],
      );
    }
  }