class Sound{
    constructor(_click){
        this.click = _click;
    }
    playClick(){
        const sound  = new Audio(this.click);
        sound.play();
    }
    stopClick(){
        const sound  = new Audio(this.click);
        sound.pause();
    }
}

export default Sound;