class Move {
    constructor(_boardAr, _cells, _board) {
        this.boardArr = _boardAr;
        this.cells = _cells;
        this.board = _board;
    }
    isKingDark(_i, _j) {
        return this.boardArr[_i][_j] === "kingDark";
    }
    movePawn(_fromI, _fromJ, _toI, _toJ, _boardArr, _cells) {
        this.boardArr = _boardArr;
        this.cells = _cells;

        console.log("entered move pawn");
        // this.sound.stopAll();
        if (_toI !== 0) {
            if (this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "kingDark";
                // this.sound.stopMove();
                // this.sound.playMove();
            }
            else if (!this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "dark";
                // this.sound.stopMove();
                // this.sound.playMove();
            }
        }
        else if (_toI === 0) {
            this.boardArr[_toI][_toJ] = "kingDark";
            // this.sound.stopMove();
            // if(this.boardArr[_fromI][_fromJ] === "dark") this.sound.playKing();
        }
        this.boardArr[_fromI][_fromJ] = "true";
        this.cells[_fromI][_fromJ].innerHTML = "";
        this.board.resetBoard();
        this.board.render(this.boardArr, this.cells);
        this.board.turnManagement.changeTurn("opponent");

    }


    moveEat(_fromI, _fromJ, _toI, _toJ, _diedI, _diedJ, _boardArr, _cells) {
        this.boardArr = _boardArr;
        this.cells = _cells;
        console.log("enter to move eat");
        // this.sound.playEting();
        const wasKing = this.isKingDark(_fromI, _fromJ);
        if (_toI === 0 || wasKing) {
            this.boardArr[_toI][_toJ] = "kingDark";
        } else {
            this.boardArr[_toI][_toJ] = "dark";
        }

        this.boardArr[_fromI][_fromJ] = "true";
        this.boardArr[_diedI][_diedJ] = "true";
        this.cells[_fromI][_fromJ].innerHTML = "";
        this.cells[_diedI][_diedJ].innerHTML = "";

        // this.storage.counterRedPawn--;
        // this.victory();

        // this.storage.updaterRedCounter();
        // this.removeLeftListenerEat();
        // this.removeRightListenerEat();
        // this.removeLisLeftEatKing();
        // this.removeLisRightEatKing();
        // this.resetBoard();
        this.board.render(this.boardArr, this.cells);
        this.board.turnManagement.changeTurn("opponent");

    }


}
export default Move;