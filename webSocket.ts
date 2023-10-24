import { Server, Socket } from "socket.io";

import { PieceEnum, PlayerMoveType } from "./utils/board.utils";
import {
  getAvailableRoom,
  updateRoomsWithSocketId,
  resetRoom,
  ChatMessageType,
} from "./utils/room.utils";
import { communication, onMove } from "./utils/webSocket.utils";
import TimerBis from "./utils/TimerBis";

export function webSocketConnection(socket: Socket, io: Server) {
  const room = getAvailableRoom();
  const roomId = String(room.id);
  const player = updateRoomsWithSocketId(room, socket.id);
  const playerPiece = player == 1 ? PieceEnum.yellow : PieceEnum.red; // Pas une erreur ici mais intentionel (inversion=> p1:yellow ; p2:red)

  const timerTime = 300000;

  console.log("new player (", playerPiece, ") connected in room", roomId);

  socket.emit("player color", playerPiece);

  socket.join(roomId);

  if (player == 2) {
    io.to(roomId)
      .to(room.playerOneSocketId as string)
      .emit("opponent ready");
    // Démarrage des timer
    room.redTimer = new TimerBis(timerTime, PieceEnum.red, io, roomId);
    room.yellowTimer = new TimerBis(timerTime, PieceEnum.yellow, io, roomId);
    room.redTimer.start();
  }

  socket.on("move", (req: PlayerMoveType) => {
    onMove(io, socket, req, room, roomId, playerPiece);

    // Envoie en continu du temps restant
    if (playerPiece === PieceEnum.red) {
      room.redTimer?.stop();
      room.yellowTimer?.start();
    } else {
      room.yellowTimer?.stop();
      room.redTimer?.start();
    }
  });

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
