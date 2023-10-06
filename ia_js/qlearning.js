const { backPropagate, predict } = require("./neuralNetwork");


exports.trainOnPreviousPlays = (
    myNetwork,
    myTrainer,
    boards,
    plays,
    learningRate,
    reward,
    discount,
    gamma,
  ) => {
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