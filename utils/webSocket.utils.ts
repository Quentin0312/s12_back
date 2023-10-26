import { Server, Socket } from "socket.io";
import { PlayerMoveType, PieceEnum, updateBoard } from "./board.utils";
import {
  RoomType,
  updateRoomsWithSocketId,
  getRooms,
  resetRoom,
  updateRoomWithMessage,
  ChatMessageType,
} from "./room.utils";
import { checkWinGlobal, GameStepEnum, checkNull } from "./winDetection.utils";

export function onMove(
  io: Server,
  socket: Socket,
  req: PlayerMoveType,
  room: RoomType,
  roomId: string,
  playerPiece: PieceEnum.red | PieceEnum.yellow
) {
  console.log(playerPiece, "move =>", req);

  // Mise à jour du board
  // TODO: Put in a function !?
  room.board = updateBoard(req.row, req.column, room.board, playerPiece);
  updateRoomsWithSocketId(room, socket.id);
  const updatedRoom = getRooms().filter((_room) => _room.id == room.id)[0];

  // Winning condition -----------------------------------------
  const totalWinningPieces = checkWinGlobal(updatedRoom.board);
  if (totalWinningPieces.length > 0) {
    console.log("in room", roomId, "player", playerPiece, "won");

    io.to(roomId).emit("game result", {
      result: GameStepEnum.win,
      board: updatedRoom.board,
      winningPieces: totalWinningPieces,
      winner: playerPiece,
    });
    resetRoom(Number(roomId));
    // TODO: Verify if this works properly
    // Draw condition -----------------------------------------
  } else if (checkNull(updatedRoom.board)) {
    console.log("draw in room", roomId);

    io.to(roomId).emit("game result", {
      result: GameStepEnum.draw,
      board: updatedRoom.board,
    });
    resetRoom(Number(roomId));
    // Simple move -----------------------------------------
  } else {
    io.to(roomId).emit("moved", updatedRoom.board);
  }
}

// TODO: Rename all req and res to add info, ex: reqMessage
//import { Message } from "./message.utils"
export function communication(
  io: Server,
  roomId: string,
  sendingPlayer: PieceEnum,
  req: ChatMessageType
) {
  const room = updateRoomWithMessage(roomId, req);

  io.to(roomId).emit("messages to update", room.messages);
  //const message = new Message(req)
}
