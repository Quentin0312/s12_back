import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default class Timer {
    private initialTime: number;                                                // Le temps initial du timer (en millisecondes)
    private currentTime: number;                                                        // Le temps actuel restant sur le timer (en millisecondes)
    isRunning: boolean;                                                 // Indique si le timer est en cours d'exécution ou non
    private callback: () => void;                                               // La fonction de rappel à appeler lorsque le timer atteint zéro
    private timerInterval: NodeJS.Timeout | null;                               // Une référence à l'intervalle de temps (NodeJS.Timeout) créé pour mettre à jour le timer
    couleur: string;
    private io: Server;
    private roomId: string;
  
    constructor(initialTime: number, couleur: string, 
                io: Server, 
                roomId: string, 
                callback: () => void) {
      this.initialTime = initialTime;
      this.currentTime = initialTime;
      this.isRunning = false;
      this.callback = callback;
      this.timerInterval = null;
      this.couleur = couleur;
      this.roomId = roomId;
      this.io = io
    }

    /** Démarre le timer */
    public start(): void {
      // Vérifie si le timer n'est pas déjà en cours d'exécution
      console.log("+++ Dans la méthode start +++")   
      if (!this.isRunning) {                                                    
        this.isRunning = true; // Marque le timer comme en cours d'exécution                                 
        // Crée un intervalle qui décrémentera le temps restant toutes les secondes
        this.timerInterval = setInterval(() => {                                
          this.currentTime -= 1000;
          console.log(this.couleur + " - " + this.formatTime() + " - " + this.isRunning + " - " + "this.timerInterval :" + this.timerInterval)
          this.io.to(this.roomId).emit("timer", {"currentTime": this.formatTime(), 
                                                 "playerPiece": this.couleur})
          // Vérifie si le temps est écoulé
          if (this.currentTime <= 0) {
            this.stop();
            // Vérifie si une fonction de rappel a été spécifiée
            if (typeof this.callback === 'function') {
              this.callback();
            }
          }
        }, 1000);
      } else { this.stop(); }
    }
  
    /** Arrête le timer en cours. */
    public stop(): void {
      console.log("+++ Dans la méthode stop +++")   
      // Vérifie si le timer est en cours d'exécution  
      console.log(this.couleur + " - " + "this.isRunning :" + this.isRunning)
      console.log(this.couleur + " - " + "this.timerInterval :" + this.timerInterval)
      if(this.isRunning) {
        this.isRunning = false; // Marque le timer comme arrêté
        // Arrête l'intervalle de mise à jour du temps, s'il existe
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
      }
    }
  
    /** Met en pause le timer en cours  */
    public pause(): void {
        this.stop(); // Appelle la méthode stop() pour mettre en pause le timer
    }

    /** Reprend le timer s'il est en pause */
    public resume(): void {
      // Vérifie si le timer n'est pas déjà en cours d'exécution
      if (!this.isRunning) {
        this.start(); // Appelle la méthode start() pour reprendre le timer
      }
    }
  
    /** Réinitialise le timer en arrêtant le temps et en rétablissant le temps initial */
    public reset(): void {
        this.stop(); // Arrête le timer en appelant la méthode stop()
        this.currentTime = this.initialTime; // Rétablit le temps initial
    }

    /** Récupère le temps actuel restant sur le timer.
     * @returns Le temps actuel restant sur le timer en millisecondes.
     */
    public getCurrentTime(): number {
      return this.currentTime;
    }

    public logCurrentTime(): void {
      console.log(this.couleur + " - " + this.formatTime());
    }
  
    public formatTime(): string {
      const time = this.currentTime;
      const minutes = Math.floor(time / 60000);
      const seconds = ((time % 60000) / 1000).toFixed(0);
      return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
    }
}