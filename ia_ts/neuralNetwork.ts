import synaptic, { Network } from "synaptic"
import { boardTo1DArrayFormatted, evaluateLearning, getArrayFromIndex } from "./helper";

export function initNN(): Network {
    const layers = [100]

    const hiddenLayers = [];
    for (let layer = 0; layer < layers.length; layer++) {
        hiddenLayers.push(new synaptic.Layer(layers[layer]));
        hiddenLayers[layer].set({
            squash: synaptic.Neuron.squash.ReLU, // ! RELU ????
        });
    }

    const outputLayer = new synaptic.Layer(7);
    outputLayer.set({
        squash: synaptic.Neuron.squash.IDENTITY,
    });

    const inputLayer = new synaptic.Layer(7 * 6);
    inputLayer.project(hiddenLayers[0]);
    for (let layer = 0; layer < layers.length - 1; layer++) {
    hiddenLayers[layer].project(hiddenLayers[layer + 1])
    }

    hiddenLayers[hiddenLayers.length - 1].project(outputLayer);

    return new synaptic.Network({
        input: inputLayer,
        hidden: hiddenLayers,
        output: outputLayer,
        });
}

// ! COPY ????
export function getTrainer (network: Network) {
    const trainer = network
    return trainer
}

export function formatInput (
    board: Array<Array<number>>,
    playerIdToPlay: number
  ) {
    let formattedBoard;
    // if (networkType === 'CNN') {
    //   formattedBoard = Helper.boardToConvolutionalVol(board, playerIdToPlay);
    // } else if (networkType === 'NN') {
      formattedBoard = boardTo1DArrayFormatted(board, playerIdToPlay);
    // }
    return formattedBoard;
}

export function predict (
    // networkType: string,
    myNetwork: any,
    board: any,
  ) {
    let output = [];
    // let boardFormatted;
    // if (networkType === 'CNN') {
    //   output = myNetwork.forward(board).w;
    // } else if (networkType === 'NN') {
      output = myNetwork.activate(board);
    // }
    return output;
}

export function backPropagate (
    // networkType: string,
    trainer: any,
    board: any,
    reward: number,
    columnIndex: number,
    learningRate: number
  ) {
    const outputArray = getArrayFromIndex(columnIndex, reward);
    // if (networkType === 'CNN') {
    //   trainer.learning_rate = learningRate;
    //   trainer.train(board, outputArray);
    // } else if (networkType === 'NN') {
      trainer.activate(board);
      trainer.propagate(learningRate, outputArray);
    // }
  }

export function evaluate (
myNetwork: any,
) {
// if (networkType === 'CNN') {
    // return Helper.evaluateLearningCNN(myNetwork);
// } else if (networkType === 'NN') {
    return evaluateLearning(myNetwork);
// }
}