class TurnsManagement {
    constructor(_turn) {
        this.turn = _turn;
        
    }
    changeTurn(_turn){
        this.turn = _turn;
    }
    returnTurnYou(){
        return this.turn === "you";
    }
    returnTurnOpponent(){
        return this.turn === "opponent";
    }
}
export default TurnsManagement;