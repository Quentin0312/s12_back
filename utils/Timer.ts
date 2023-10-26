import { Server } from "socket.io";
import { formatTime } from "./TimerUtils";
import { GameStepEnum } from "./winDetection.utils";
import { getRooms } from "./room.utils";
import { PieceEnum } from "./board.utils";

export default class Timer {
  private currentTime: number;
  private timerInterval: NodeJS.Timeout;
  couleur: string;
  private io: Server;
  private roomId: string;

  constructor(
    initialTime: number,
    couleur: string,
    io: Server,
    roomId: string
  ) {
    this.currentTime = initialTime;
    this.timerInterval = setInterval(() => {
      return;
    }, 1);
    this.couleur = couleur;
    this.roomId = roomId;
    this.io = io;
  }

  public start(): void {
    // Crée un intervalle qui décrémentera le temps restant toutes les secondes
    this.timerInterval = setInterval(() => {
      if (this.currentTime == 0) {
        this.io.to(this.roomId).emit("game result", {
          result: GameStepEnum.win,
          board: getRooms().filter(
            (_room) => _room.id == Number(this.roomId)
          )[0].board,
          winningPieces: [],
          winner:
            this.couleur == PieceEnum.red ? PieceEnum.yellow : PieceEnum.red,
        });
      } else {
        this.currentTime -= 1000;
        // Emit updated time
        this.io.to(this.roomId).emit("timer", {
          currentTime: formatTime(this.currentTime),
          playerPiece: this.couleur,
        });
      }
    }, 1000);
  }

  public stop(): void {
    clearInterval(this.timerInterval);
  }
}
