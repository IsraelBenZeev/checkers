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

    leftListener(_fromI, _fromJ, _toI, _toJ) {
        this.handlerLeft =  ()=> this.movePawn(_fromI, _fromJ, _toI, _toJ);
        this.cells[_fromI - 1][_fromJ - 1].addEventListener("click", this.handlerLeft);
        this.indexesLisLeft[0]= _fromI - 1;
        this.indexesLisLeft[1]= _fromJ - 1;
        
        // this.cells[_fromI - 1][_fromJ - 1].removeEventLissiner("click", hander);
            // this.movePawn(_fromI, _fromJ, _toI, _toJ);
    }

    removeLeftListener(){
        if(this.indexesLisLeft[0] !== null && this.indexesLisLeft[1] !== null && this.handlerLeft){
            this.cells[this.indexesLisLeft[0]][this.indexesLisLeft[1]].removeEventListener("click", this.handlerLeft);
            this.handlerLeft = null;
            this.cells[this.indexesLisLeft[0]+1][this.indexesLisLeft[1]+1].style.border = "none";

        }
    }

  removeRightListener(){
        if(this.indexesLisRight[0] !== null && this.indexesLisRight[1] !== null && this.handlerRight){
            this.cells[this.indexesLisRight[0]][this.indexesLisRight[1]].removeEventListener("click", this.handlerRight);
            this.handlerRight = null;
        }
    }

    rightListener(_fromI, _fromJ, _toI, _toJ) {
        this.handlerRight = ()=> this.movePawn(_fromI, _fromJ, _toI, _toJ);
        this.cells[_fromI - 1][_fromJ + 1].addEventListener("click", this.handlerRight)
        this.indexesLisRight[0] = _fromI - 1;
        this.indexesLisRight[1] = _fromJ + 1;

    }
  


    movePawn(_fromI, _fromJ, _toI, _toJ) {
        this.boardArr[_toI][_toJ] = "dark";
        this.boardArr[_fromI][_fromJ] = "true";
        this.cells[_fromI][_fromJ].innerHTML = "";
        this.render();
        this.resetLine(_toI)
        // this.resetBoard()
    }
    drawCelForMove(_i, _j) {
        this.cells[_i][_j].style.backgroundColor = "rgb(0, 127, 197)";
    }
    // isExistPawn(_i, _j){
    //     for
    // }

    choosMove(_fromI, _fromJ) {
        if (_fromI !== 0) {
            this.resetLine(_fromI - 1);
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
        
            if (_fromJ !== this.cells.length - 1 && _fromJ !== 0) {
                this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1)
                this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);
            }
            else if (_fromJ === this.cells.length - 1) {
                this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);
            }
            else if (_fromJ === 0) {
                this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1);
            }
        }
    }

    render() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.cells[i][j].querySelector(".pawn")) continue;

                let pawnDark = document.createElement("img");
                pawnDark.src = "../files/pawn-dark.png";
                pawnDark.alt = "pawn dark";
                pawnDark.classList = "pawn pawn-dark"

                let pawnRed = document.createElement("img");
                pawnRed.src = "../files/pawn-red.png";
                pawnRed.alt = "pawn light";
                pawnRed.classList = "pawn pawn-light"

                if (this.boardArr[i][j] === "dark") this.cells[i][j].appendChild(pawnDark)
                if (this.boardArr[i][j] === "red") this.cells[i][j].appendChild(pawnRed)


                pawnDark.addEventListener("click", () => {
                    this.cells[i][j].style.border = "2px solid white";
                    this.cells[i][j].style.borderRadius = "5px"
                    console.log("i: "+i);
                    console.log("j: "+j);
                    
                    this.removeLeftListener();
                    this.removeRightListener();
                    this.resetBoard()
                    this.choosMove(i, j);
                });
            }
        }
    }
}

