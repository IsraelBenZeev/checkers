class Sound{
    constructor(_click, _eating, _move, _king){
        this.click = _click;
        this.eating = _eating;
        this.move = _move;
        this.king = _king;
    }
    playClick(){
        const sound  = new Audio(this.click);
        sound.play();
    }
    stopClick(){
        const sound  = new Audio(this.click);
        sound.pause();
    }
    playEting(){
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