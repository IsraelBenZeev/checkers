class Sound{
    constructor(_click, _eating, _move){
        this.click = _click;
        this.eating = _eating;
        this.move = _move;
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
}

export default Sound;