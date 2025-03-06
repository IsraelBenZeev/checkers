class MoveChecker {
    constructor(boardArr) {
        this.boardArr = boardArr;
        this.canMove = null;
    }
    colissin(_i, _j, _boardArr) {
        this.boardArr = _boardArr;
        return this.boardArr[_i][_j] === "true";
    }
    isOpponent(_i, _j, _boardArr) {
        this.boardArr = _boardArr;
        return this.boardArr[_i][_j] === "red" ||this.boardArr[_i][_j] === "kingRed";
    }
    whereCanMove(_i, _j, _boardArr) {
        this.boardArr = _boardArr;
        let directions = [];
        let eatingMoves = [];
        
        if (this.boardArr[_i][_j] === "kingDark") {
            if (_i < this.boardArr.length - 2 && _j > 1 && 
                this.colissin(_i + 2, _j - 2, _boardArr) && 
                this.isOpponent(_i + 1, _j - 1, _boardArr)) {
                eatingMoves.push("l_eat_down");
            }
            if (_i < this.boardArr.length - 2 && _j < this.boardArr.length - 2 && this.colissin(_i + 2, _j + 2, _boardArr) && 
                this.isOpponent(_i + 1, _j + 1, _boardArr)) {
                eatingMoves.push("r_eat_down");
            }
        }
    
        if (_i > 1) {
            if (_j > 1 && this.colissin(_i - 2, _j - 2, _boardArr) && this.isOpponent(_i - 1, _j - 1, _boardArr)) {
                eatingMoves.push("l_eat");
            }
            if (_j < this.boardArr.length - 2 && this.colissin(_i - 2, _j + 2, _boardArr) && this.isOpponent(_i - 1, _j + 1, _boardArr)) {
                eatingMoves.push("r_eat");
            }
        }
        if (eatingMoves.length > 0) {
            return eatingMoves;
        }
    
        if (this.boardArr[_i][_j] === "kingDark" && _i >= 0) {
            if (_i < this.boardArr.length-1) {
                if (_j > 0 && this.colissin(_i + 1, _j - 1, _boardArr)) {
                    directions.push("l_down");
                }
                if (_j < this.boardArr.length-1 && this.colissin(_i + 1, _j + 1, _boardArr)) {
                    directions.push("r_down");
                }
            }
        }
    
        if (_i > 0) {
            if (_j > 0 && this.colissin(_i - 1, _j - 1, _boardArr)) {
                directions.push("l");
            }
            if (_j < this.boardArr.length-1 && this.colissin(_i - 1, _j + 1, _boardArr)) {
                directions.push("r");
            }
        }
    
        return directions;
    }  
}
export default MoveChecker;