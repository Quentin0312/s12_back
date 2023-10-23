import { Server, Socket } from "socket.io";

import { PieceEnum, PlayerMoveType } from "./utils/board.utils";
import {
  getAvailableRoom,
  updateRoomsWithSocketId,
  resetRoom,
  ChatMessageType,
} from "./utils/room.utils";
import { communication, onMove } from "./utils/webSocket.utils";
import Timer from "./utils/Timer";
import TimerBis from "./utils/TimerBis";

export function webSocketConnection(socket: Socket, io: Server) {
  const room = getAvailableRoom();
  const roomId = String(room.id);
  const player = updateRoomsWithSocketId(room, socket.id);
  const playerPiece = player == 1 ? PieceEnum.yellow : PieceEnum.red; // Pas une erreur ici mais intentionel (inversion=> p1:yellow ; p2:red)

  const timer = 300000;
  // const timerYellow = new Timer(timer, PieceEnum.yellow, io, roomId, () => {
  //   console.log("Le timer jaune est terminé.");
  // });
  // const timerRed = new Timer(timer, PieceEnum.red, io, roomId, () => {
  //   console.log("Le timer rouge est terminé.");
  // });
  // const timerYellow = new TimerBis(timer, PieceEnum.yellow, io, roomId);
  let timerYellow: TimerBis;
  console.log("new timer created"); // !!!!!!!PROBLÈME DE CONCURENCE!!!!!!!!!!!
  let timerRed: TimerBis;
  // const timerRed = new TimerBis(timer, PieceEnum.red, io, roomId);

  console.log("new player (", playerPiece, ") connected in room", roomId);

  socket.emit("player color", playerPiece);

  socket.join(roomId);
  // if (player == 1) {
  // }
  if (player == 2) {
    io.to(roomId)
      .to(room.playerOneSocketId as string)
      .emit("opponent ready");
    // Démarrage des timer
    //io.to(roomId).emit("timer", timerRed.getCurrentTime())
    timerYellow = new TimerBis(timer, PieceEnum.yellow, io, roomId);
    timerRed = new TimerBis(timer, PieceEnum.red, io, roomId);
    timerRed.start();
  }

  socket.on("move", (req: PlayerMoveType) => {
    onMove(io, socket, req, room, roomId, playerPiece);
    console.log(" ====== Joeur playerPiece: " + playerPiece + " a joué ======");
    // Arreter d'envoie le timer
    debugger;
    if (playerPiece === PieceEnum.red) {
      console.log(
        " --- " + playerPiece + " stop timer rouge - start timer jaune --- "
      );
      timerRed.stop();
      timerYellow.start();
    } else {
      console.log(
        " --- " + playerPiece + " stop timer jaune - start time rouge --- "
      );
    }
  });

  // Envoie en continu du temps restant

  socket.on("message", (req: ChatMessageType) =>
    communication(io, roomId, playerPiece, req)
  );

  socket.on("disconnect", () => {
    // Disconnect the other player
    io.to(roomId).emit("disconnection order");

    console.log(
      playerPiece,
      "player of room",
      roomId,
      "disconnected by itself"
    );

    resetRoom(Number(roomId));
  });
}
