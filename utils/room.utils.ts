import Timer from "./Timer";
import { PieceEnum, boardStateDictType, getInitialBoard } from "./board.utils";

// TODO: Ajouter message.utils.ts !?
export type ChatMessageType = {
  who: PieceEnum;
  message: string;
  temps: string;
  image?: any; // TODO: Delete => no user profile feature targeted
};

export type RoomType = {
  id: number;
  playerOneSocketId: string | undefined;
  playerTwoSocketId: string | undefined;
  board: boardStateDictType;
  messages: ChatMessageType[];
  redTimer?: Timer;
  yellowTimer?: Timer;
};

// TODO: Mettre en place cas ou toutes les rooms sont pleines (création de nouvelles rooms)
let rooms: RoomType[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => {
  return {
    id,
    playerOneSocketId: undefined,
    playerTwoSocketId: undefined,
    board: getInitialBoard(),
    messages: [],
  };
});

// TODO: Refactor => create fonction getRoomsById

export function getRooms() {
  return rooms;
}

// TODO: Use this
// function getRoomById(roomId: number) {
//   return rooms.filter((_room) => _room.id == Number(roomId))[0];
// }

export function getAvailableRoom() {
  const roomForPlayerTwo = rooms.filter(
    (room) => room.playerOneSocketId && !room.playerTwoSocketId
  );
  if (roomForPlayerTwo.length != 0) {
    return roomForPlayerTwo[0];
  } else {
    return rooms.filter((room) => !room.playerOneSocketId)[0];
  }
}

// TODO: Rename
export function updateRoomsWithSocketId(room: RoomType, socketId: string) {
  let player: number;
  if (!room.playerOneSocketId) {
    room.playerOneSocketId = socketId;
    player = 1;
  } else {
    room.playerTwoSocketId = socketId;
    player = 2;
  }

  const oldRooms = rooms.filter((_room) => room.id != _room.id);
  oldRooms.push(room);
  rooms = oldRooms;
  return player;
}

// TODO: Verify if there is no bug
export function resetRoom(roomId: number) {
  const oldRooms = rooms.filter((_room) => roomId != _room.id);
  oldRooms.push({
    id: roomId,
    playerOneSocketId: undefined,
    playerTwoSocketId: undefined,
    board: getInitialBoard(),
    messages: [],
  });
  rooms = oldRooms;
  console.log(`room ${roomId} reseted`);
}

// TODO: Just update room and return void
export function updateRoomWithMessage(
  roomId: string,
  message: ChatMessageType
) {
  const room = rooms.filter((_room) => _room.id == Number(roomId))[0];
  room.messages.push(message);

  // TODO: Use this instead
  // return getRoomById(roomId).messages.push(message)

  return room;
}
