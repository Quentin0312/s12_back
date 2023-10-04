import { boardStateDictType, getInitialBoard } from "./board.utils"

export type RoomType = {
    id: number,
    playerOneSocketId: string | undefined,
    playerTwoSocketId: string | undefined,
    board: boardStateDictType,
}

// TODO: Utiliser une DB !?
// TODO: Augmenter le nombre de rooms disponible
// TODO: Mettre en place cas ou toutes les rooms sont pleines (création de nouvelles rooms)
let rooms: RoomType[] = [0,1,2].map((id) => {
    return {
        id,
        playerOneSocketId: undefined,
        playerTwoSocketId: undefined,
        board: getInitialBoard()
    }
})

export function getRooms() {
    return rooms
}

export function getAvailableRoom() {
    const roomForPlayerTwo = rooms.filter((room) => room.playerOneSocketId && !room.playerTwoSocketId)
    if (roomForPlayerTwo.length != 0) {
      return roomForPlayerTwo[0]
    } else {
      return rooms.filter((room) => !room.playerOneSocketId)[0]
    }
}

// TODO: Rename
export function updateRooms(room: RoomType, socketId: string) {
    let player:number;
    if (!room.playerOneSocketId) {
      room.playerOneSocketId = socketId
      player = 1 
    } else {
      room.playerTwoSocketId = socketId
      player = 2
    }
  
    const oldRooms = rooms.filter((_room) => room.id != _room.id)
    oldRooms.push(room)
    rooms = oldRooms
    return player
}

// TODO: Verify if there is no bug
export function resetRoom(roomId: number) {
    const oldRooms = rooms.filter((_room) => roomId != _room.id)
    oldRooms.push({
        id: roomId,
        playerOneSocketId: undefined,
        playerTwoSocketId: undefined,
        board: getInitialBoard()    
    })
    rooms = oldRooms
    console.log(`room ${roomId} reseted`);
}