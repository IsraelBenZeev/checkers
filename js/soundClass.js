class Sound{
    constructor(){
        this.click = "./files/sounds/click.wav";
        this.eating = "./files/sounds/eat.mp3";
        this.move = "./files/sounds/move2.mp3";
        this.king = "./files/sounds/king.wav";
    }
    playClick(){
        const sound  = new Audio(this.click);
        sound.play();
    }
    stopClick(){
        const sound  = new Audio(this.click);
        sound.pause();
    }
    playEating(){
        const sound  = new Audio(this.eating);
        sound.play();
    }
    stopEating(){
        const sound  = new Audio(this.eating);
        sound.pause();
    }
    playMove(){
        const sound  = new Audio(this.move);
        sound.play();
    }
    stopMove(){
        const sound  = new Audio(this.move);
        sound.pause();
    }
    playKing(){
        const sound  = new Audio(this.king);
        sound.play();
    }
    stopKing(){
        const sound  = new Audio(this.king);
        sound.pause();
    }
    stopAll(){
        this.stopMove();
        this.stopEating();
        this.stopKing();
    }
}
export default Sound;