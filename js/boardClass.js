const COLOR_BOARD_DARK = "rgb(106, 32, 12)";

class Board {
    constructor(_parent, _row, _col) {
        this.parent = _parent;
        this.row = _row;
        this.col = _col;
        this.cells = Array(this.row).fill().map(() => Array(this.col).fill(null));
        this.boardArr = Array(this.row).fill().map(() => Array(this.col).fill(null));
        this.indexesLisLeft = [null, null];
        this.indexesLisRight = [null, null];
        this.handlerLeft = null;
        this.handlerRight = null;
        this.handlerLeftEat = null;
        this.handlerRightEat = null;
        this.leftEAt = false;
        this.rightEAt = false;
        this.aaa = false;



    };
    fillArr() {
        for (let i = 0; i < this.boardArr.length; i++) {
            for (let j = 0; j < this.boardArr[i].length; j++) {
                if ((j + i) % 2 == 0) {
                    if (i <= 2) this.boardArr[i][j] = "red";
                    if (i >= 5) this.boardArr[i][j] = "dark";
                    else if (i > 2 && i < 5) this.boardArr[i][j] = "true"
                }
            }
        }
        console.log(this.boardArr);
    }

    drawBoard() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                let cel = document.createElement("div");
                cel.classList = "cell";
                document.querySelector(this.parent).appendChild(cel);
                if ((i + j) % 2 == 0) cel.classList = "cell cell-dark center";
                else cel.classList = "cell cell-light center";
                this.cells[i][j] = cel;
            }
        }
    }
    resetBoard() {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                if (this.boardArr[i][j] === "dark" || this.boardArr[i][j] === "true") {
                    this.cells[i][j].style.backgroundColor = COLOR_BOARD_DARK;
                }
            }
        }
    }

    resetLine(_indexI) {
        if (_indexI !== 0) {
            for (let i = 0; i < this.cells[_indexI].length; i++) {
                if (this.boardArr[_indexI][i] === "true" || this.boardArr[_indexI][i] === "dark")
                    this.cells[_indexI][i].style.backgroundColor = COLOR_BOARD_DARK;
            }
        }
    }

    resetCel(_arr, _indexI, _indexJ, _eqouls) {
        _arr[_indexI][_indexJ].style.backgroundColor = _eqouls;
    }

    checkEatOpponentLeft(_i, _j) {
        if (this.boardArr[_i][_j] === "red") {
            if (this.boardArr[(_i - 1)][(_j - 1)] === "true") {
                return true;
            }
        }
        return false;
    }
    checkEatOpponentRight(_i, _j) {
        if (this.boardArr[_i][_j] === "red") {
            if (this.boardArr[(_i - 1)][(_j + 1)] === "true") {
                return true;
            }
        }
        return false;
    }

    listenerRightEat(_i, _j) {
        return () => {
            this.boardArr[_i][_j] = "dark";
            this.boardArr[_i + 1][_j - 1] = "true";
            this.boardArr[_i + 2][_j - 2] = "true"
            this.cells[_i + 1][_j - 1].innerHTML = "";
            this.cells[_i + 2][_j - 2].innerHTML = "";
            this.render();

            this.cells[_i][_j].removeEventListener("click", this.handlerRightEat);
            this.handlerRightEat = null;
            this.resetLine(_i);
        }
    }
    
    listenerLeftEat(_i, _j) {
        return () => {
            this.boardArr[_i][_j] = "dark";
            this.boardArr[_i + 1][_j + 1] = "true";
            this.boardArr[_i + 2][_j + 2] = "true"
            this.cells[_i + 1][_j + 1].innerHTML = "";
            this.cells[_i + 2][_j + 2].innerHTML = "";
            this.render();
            
            this.cells[_i][_j].removeEventListener("click", this.handlerLeftEat);
            this.handlerLeftEat = null;
            this.resetLine(_i);
        }
    }

    leftListener(_fromI, _fromJ, _toI, _toJ) {
        this.handlerLeft = () => this.movePawn(_fromI, _fromJ, _toI, _toJ);
        this.cells[_toI][_toJ].addEventListener("click", this.handlerLeft);
        this.indexesLisLeft[0] = _toI;
        this.indexesLisLeft[1] = _toJ;
    }

    removeLeftListener() {
        if (this.indexesLisLeft[0] !== null && this.indexesLisLeft[1] !== null && this.handlerLeft) {
            this.cells[this.indexesLisLeft[0]][this.indexesLisLeft[1]].removeEventListener("click", this.handlerLeft);
            this.handlerLeft = null;
            this.cells[this.indexesLisLeft[0] + 1][this.indexesLisLeft[1] + 1].style.border = "none";
        }
    }

    rightListener(_fromI, _fromJ, _toI, _toJ) {
        this.handlerRight = () => this.movePawn(_fromI, _fromJ, _toI, _toJ);
        this.cells[_toI][_toJ].addEventListener("click", this.handlerRight)
        this.indexesLisRight[0] = _toI
        this.indexesLisRight[1] = _toJ;
    }

    removeRightListener() {
        if (this.indexesLisRight[0] !== null && this.indexesLisRight[1] !== null && this.handlerRight) {
            this.cells[this.indexesLisRight[0]][this.indexesLisRight[1]].removeEventListener("click", this.handlerRight);
            this.handlerRight = null;
        }
    }


    movePawn(_fromI, _fromJ, _toI, _toJ) {
        console.log(this.boardArr[_toI][_toJ]);
        if (this.boardArr[_toI][_toJ] === "true") {
            this.boardArr[_toI][_toJ] = "dark";
            this.boardArr[_fromI][_fromJ] = "true";
            this.cells[_fromI][_fromJ].innerHTML = "";
            this.render();
            this.resetLine(_toI)
        }
        // console.log(this.boardArr);
    }
    drawCelForMove(_i, _j) {
        if (this.boardArr[_i][_j] == "true") {
            this.cells[_i][_j].style.backgroundColor = "rgb(0, 127, 197)";
        }
    }

    drawEatLeft(_i, _j) {
        if (this.boardArr[_i][_j] === "red") {
            if (this.boardArr[_i - 1][_j - 1] === "true") {
                console.log("fun i: " + (_i - 1));
                console.log("fun j: " + (_j - 1));
                this.drawCelForMove(_i - 1, _j - 1);
            }
        }
    }
    drawEatRight(_i, _j) {
        if (this.boardArr[_i][_j] === "red") {
            if (this.boardArr[_i - 1][_j + 1] === "true") {
                console.log("fun i: " + (_i - 1));
                console.log("fun j: " + (_j + 1));
                this.drawCelForMove(_i - 1, _j + 1);
            }
        }
    }
    collision(_i, _j) {
        if (this.boardArr[_i][_j] === "true") return true;
        return false;
    }

    MoveUp(_fromI, _fromJ) {
        if (_fromI !== 0) {
            if (this.checkEatOpponentLeft(_fromI - 1, _fromJ - 1)) {
                console.log("eat in left");
                this.cells[_fromI - 2][_fromJ - 2].style.backgroundColor = "rgb(0, 127, 197)";
                this.handlerLeftEat = this.listenerLeftEat(_fromI - 2, _fromJ - 2);
                this.cells[_fromI - 2][_fromJ - 2].addEventListener("click", this.handlerLeftEat);

            }
            if (this.checkEatOpponentRight(_fromI - 1, _fromJ + 1)) {
                console.log("eat in right");
                this.cells[_fromI - 2][_fromJ + 2].style.backgroundColor = "rgb(0, 127, 197)";
                this.handlerRightEat = this.listenerRightEat(_fromI - 2, _fromJ + 2);
                this.cells[_fromI - 2][_fromJ + 2].addEventListener("click", this.handlerRightEat);
            }
            if (_fromJ === this.cells.length - 1) {
                this.drawCelForMove(_fromI - 1, _fromJ - 1);
            }
            else if (_fromJ === 0) {
                this.drawCelForMove(_fromI - 1, _fromJ + 1);
            }
            else if (_fromJ !== 0 && _fromJ !== this.cells.length - 1) {
                this.drawCelForMove(_fromI - 1, _fromJ - 1);
                this.drawCelForMove(_fromI - 1, _fromJ + 1);
            }
            if (_fromJ !== this.boardArr.length - 1 && _fromJ !== 0 && this.collision(_fromI - 1, _fromJ - 1) && this.collision(_fromI - 1, _fromJ + 1)) {
                console.log("rl");
                this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1)
                this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);
            }

            else if (_fromJ === this.boardArr.length - 1 || this.collision(_fromI - 1, _fromJ - 1)) {
                console.log("L");
                this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);
            }
            else if (_fromJ === 0 || this.collision(_fromI - 1, _fromJ + 1)) {
                console.log("r");
                this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1);
            }
        }
    }
    moveDown(_fromI, _fromJ){
    
    }


    render() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                // this.cells[i][j].innerHTML = "";
                if (this.cells[i][j].querySelector(".pawn")) continue;

                let pawnDark = document.createElement("img");
                pawnDark.src = "../files/pawn-dark.png";
                pawnDark.alt = "pawn dark";
                pawnDark.classList = "pawn pawn-dark"

                let pawnRed = document.createElement("img");
                pawnRed.src = "../files/pawn-red.png";
                pawnRed.alt = "pawn light";
                pawnRed.classList = "pawn pawn-light"
                let flegClick = false;
                if (!this.aaa) {
                    this.boardArr[4][4] = "red";
                    this.boardArr[4][2] = "red";
                    // this.boardArr[3][1] = "red";
                    this.aaa = true;
                }
                if (this.boardArr[i][j] === "dark") this.cells[i][j].appendChild(pawnDark)
                if (this.boardArr[i][j] === "red") this.cells[i][j].appendChild(pawnRed)
                // if (this.boardArr[i][j] === "true") this.cells[i][j].innerHTML = "";
                pawnDark.style.boxShadow = "5px 5px 10px 1px #000000";
                pawnRed.style.boxShadow = "5px 5px 10px 1px #000000";
                pawnDark.addEventListener("click", () => {
                    this.resetBoard();
                    if (!flegClick) {
                        this.cells[i][j].style.border = "2px solid white";
                        this.cells[i][j].style.borderRadius = "5px"
                        flegClick = true;
                    }
                    else {
                        this.cells[i][j].style.border = "none";
                        flegClick = false;
                    }
                    console.log("i: " + i+", j: " + j);
                    this.removeLeftListener();
                    this.removeRightListener();
                    this.MoveUp(i, j);
                }); 
            }
        }
    }
}

