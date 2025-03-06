// import {Sound}from './soundClass.js';
class Move {
    constructor(_boardAr, _cells, _board, _storage) {
        this.boardArr = _boardAr;
        this.cells = _cells;
        this.board = _board;
        this.storage = _storage;
    }
    isKingDark(_i, _j) {
        return this.boardArr[_i][_j] === "kingDark";
    }
    movePawn(_fromI, _fromJ, _toI, _toJ, _boardArr, _cells) {
        this.board.sound.playMove();
        this.boardArr = _boardArr;
        this.cells = _cells;

        console.log("entered move pawn");
        if (_toI !== 0) {
            if (this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "kingDark";
                this.board.sound.stopMove();
                this.board.sound.playMove();
            }
            else if (!this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "dark";
                // Sound.stopMove();
                // Sound.playMove();
            }
        }
        else if (_toI === 0) {
            this.boardArr[_toI][_toJ] = "kingDark";
        //    Sound.stopMove();
            if(this.boardArr[_fromI][_fromJ] === "dark") this.board.sound.playKing();
        }
        this.boardArr[_fromI][_fromJ] = "true";
        this.cells[_fromI][_fromJ].innerHTML = "";
        this.board.resetBoard();

        this.board.turnsManagement.changeTurn("opponent");
        this.board.render(this.boardArr, this.cells);
    }


    moveEat(_fromI, _fromJ, _toI, _toJ, _diedI, _diedJ, _boardArr, _cells) {
        this.board.sound.playEating();

        this.boardArr = _boardArr;
        this.cells = _cells;
        console.log("enter to move eat");
        const wasKing = this.isKingDark(_fromI, _fromJ);
        if (_toI === 0 || wasKing) {
            this.boardArr[_toI][_toJ] = "kingDark";
            this.board.sound.playKing();

        } else {
            this.boardArr[_toI][_toJ] = "dark";
        }

        this.boardArr[_fromI][_fromJ] = "true";
        this.boardArr[_diedI][_diedJ] = "true";
        this.cells[_fromI][_fromJ].innerHTML = "";
        this.cells[_diedI][_diedJ].innerHTML = "";
        if (this.storage)this.storage.decrementCounterRed();
        else console.log("המחלקה עוד לא נוצרה");
        
    
        // שינוי השם של המשתנה
        this.board.turnsManagement.changeTurn("opponent");
        this.board.render(this.boardArr, this.cells);
        
    }


}
export default Move;