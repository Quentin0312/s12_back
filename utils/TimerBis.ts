import { Server } from "socket.io";
import { formatTime } from "./TimerBisUtils";

export default class TimerBis {
  private currentTime: number; // Le temps actuel restant sur le timer (en millisecondes)
  // isRunning: boolean; // Indique si le timer est en cours d'exécution ou non
  private timerInterval: NodeJS.Timeout; // Une référence à l'intervalle de temps (NodeJS.Timeout) créé pour mettre à jour le timer
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
    // this.isRunning = false;
    this.timerInterval = setInterval(() => {
      return;
    }, 1);
    this.couleur = couleur;
    this.roomId = roomId;
    this.io = io;
  }

  /** Démarre le timer */
  public start(): void {
    // Vérifie si le timer n'est pas déjà en cours d'exécution
    console.log(`+++ Dans la méthode start ${this.couleur} +++`);
    // if (!this.isRunning) {
    //   this.isRunning = true; // Marque le timer comme en cours d'exécution
    // Crée un intervalle qui décrémentera le temps restant toutes les secondes
    this.timerInterval = setInterval(() => {
      this.currentTime -= 1000;
      // console.log(
      //   this.couleur +
      //     " - " +
      //     formatTime(this.currentTime) +
      //     " - " +
      //     this.isRunning +
      //     " - " +
      //     "this.timerInterval :" +
      //     this.timerInterval
      // );
      this.io.to(this.roomId).emit("timer", {
        currentTime: formatTime(this.currentTime),
        playerPiece: this.couleur,
      });
      // Vérifie si le temps est écoulé
      //   if (this.currentTime <= 0) {
      //     this.stop();
      //     // ! Mettre la fonction à executer quand timer atteint sa fin
      //   }
    }, 1000);
    console.log("this.timerInterval====>", this.timerInterval);
    // }
  }

  /** Arrête le timer en cours. */
  public stop(): void {
    console.log(`+++ Dans la méthode stop ${this.couleur} +++`);
    // Vérifie si le timer est en cours d'exécution
    // console.log(this.couleur + " - " + "this.isRunning :" + this.isRunning);
    // console.log(
    //   this.couleur + " - " + "this.timerInterval :" + this.timerInterval
    // );
    // console.log("this.running", this.isRunning);
    // if (this.isRunning) {
    console.log("in if 01");
    //   this.isRunning = false; // Marque le timer comme arrêté
    // Arrête l'intervalle de mise à jour du temps, s'il existe
    // if (this.timerInterval) {
    console.log("in if 02");
    clearInterval(this.timerInterval);
    // this.timerInterval = null;
    // }
    // }
  }
}
