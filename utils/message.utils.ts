// TODO: Use it !

export class Message{
    contenu: string;
    id: string;
    temps: string
    private tempsBrut: Date

    constructor(contenu: string){
        this.tempsBrut = new Date()
        this.id = this.generateID(this.tempsBrut)
        this.contenu = contenu
        this.temps = this.getDate(this.tempsBrut)
    }

    private generateID(tempsBrut: Date): string {
        return(tempsBrut.getTime().toString())
    }    
    
    private getDate(tempsBrut: Date): string {
        const temps = tempsBrut.getHours() + ":" + tempsBrut.getMinutes();
        return(temps)
    }
}


