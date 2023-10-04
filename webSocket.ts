import { Server, Socket } from "socket.io";

import { PieceEnum, PlayerMoveType } from "./utils/board.utils";
import { getAvailableRoom, updateRooms, resetRoom } from "./utils/room.utils";
import { onMove } from "./utils/webSocket.utils";

export function webSocketConnection(socket: Socket, io:Server) {
  
    const room = getAvailableRoom()
    const roomId = String(room.id)
    const player = updateRooms(room, socket.id)
    const playerPiece = player == 1 ? PieceEnum.yellow : PieceEnum.red // Pas une erreur ici mais intentionel (inversion=> p1:yellow ; p2:red)
    
    console.log('new player (', playerPiece, ') connected in room', roomId)
  
    socket.emit("player color", playerPiece);
    
    // TODO: When game ended, delete / empty the room ?
    socket.join(roomId)
  
    if (player == 2) {
      io.to(roomId).to(room.playerOneSocketId as string).emit("opponent ready")
    }
  
    // TODO: Put the anonymous functions in external functions
    socket.on("move", (req: PlayerMoveType) => onMove(io, socket, req, room, roomId, playerPiece))
  
    socket.on("disconnect", () => {
      // Disconnect the other player
      io.to(roomId).emit("disconnection order")
  
      console.log(playerPiece, "player of room", roomId, "disconnected by itself")

      resetRoom(Number(roomId))
  
    })
  }