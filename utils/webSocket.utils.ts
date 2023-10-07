import { Server, Socket } from "socket.io"
import { PlayerMoveType, PieceEnum, updateBoard } from "./board.utils"
import { RoomType, updateRooms, getRooms, resetRoom } from "./room.utils"
import { checkWinGlobal, GameStepEnum, checkNull } from "./winDetection.utils"

export function onMove(io: Server, socket: Socket, req: PlayerMoveType, room: RoomType, roomId: string, playerPiece: PieceEnum.red | PieceEnum.yellow) {
    console.log(playerPiece, "move =>", req)
    // TODO: Verify if the move is legal (turn, position) ?? Actualy dealt by the front

    // Mise à jour du board
    // TODO: Put in a function !?
    room.board = updateBoard(req.row, req.column, room.board, playerPiece)
    updateRooms(room, socket.id)
    const updatedRoom = getRooms().filter((_room) => _room.id == room.id)[0]

    // Winning condition -----------------------------------------
    const totalWinningPieces = checkWinGlobal(updatedRoom.board)
    if (totalWinningPieces.length > 0) {
      console.log("in room", roomId, "player", playerPiece, "won")

      io.to(roomId).emit("game result", {
        result: GameStepEnum.win,
        board: updatedRoom.board,
        winningPieces: totalWinningPieces
      })
      resetRoom(Number(roomId))
      // TODO: Verify if this works properly
    // Draw condition -----------------------------------------
    } else if (checkNull(updatedRoom.board)){
      console.log("draw in room", roomId)

      io.to(roomId).emit("game result", {
        result: GameStepEnum.draw,
        board: updatedRoom.board
      })
      resetRoom(Number(roomId))
    // Simple move -----------------------------------------
    } else {
      io.to(roomId).emit('moved', updatedRoom.board)
    }
}

//import { Message } from "./message.utils"
export function communication(io: Server, roomId: string, idPlayer: number, 
  req: string){

    console.log("===================================")
    console.log(req)
    console.log(idPlayer)
    console.log("===================================")
    
    io.to(roomId).emit("message", {
      idPlayer: idPlayer,
      contenu: req
    })
    //const message = new Message(req) 
}