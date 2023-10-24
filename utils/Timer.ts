import { Server } from "socket.io";
import { formatTime } from "./TimerUtils";

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
      this.currentTime -= 1000;
      // Emit updated time
      this.io.to(this.roomId).emit("timer", {
        currentTime: formatTime(this.currentTime),
        playerPiece: this.couleur,
      });
    }, 1000);
  }

  public stop(): void {
    clearInterval(this.timerInterval);
  }
}
