const COLOR_BOARD_DARK = "rgb(41, 88, 108)";

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
        this.counterRedPawn = 12;
        this.counterDarkPawn = 12;
        this.myTimer = 1; // שינוי הערך ההתחלתי ל-1
        this.timerOpponent = null;
        this.i = 0;
        this.playerTurn = true; // מוסיף משתנה חדש לניהול תורות
        this.computerDelay = 300; // שינוי מ-1000 ל-300 מילישניות
        this.moveInProgress = false; // משתנה חדש לבדיקה אם יש מהלך בתהליך
        this.handlerLisInRender = null;
        this.arrSave = [];
        this.startGame = !localStorage.getItem('indexes'); // שינוי כאן - יהיה true רק אם אין מידע בלוקאל סטורג'
        this.timerGame = null;
    };

    updaterRedCounter() {
        const pawnsDed = document.querySelector(".pawns-red-ded");
        pawnsDed.style.direction = "rtl";
        pawnsDed.innerHTML = "";

        for (let i = 0; i < 12 - this.counterRedPawn; i++) {
            pawnsDed.innerHTML += `<img src="./files/light.png" style="width: 30px;  margin: 2px 0">`;
        }
    }

    updaterDarkCounter() {
        const pawnsDed = document.querySelector(".pawns-dark-ded");
        pawnsDed.style.direction = "rtl";
        pawnsDed.innerHTML = "";

        for (let i = 0; i < 12 - this.counterDarkPawn; i++) {
            pawnsDed.innerHTML += `<img src="./files/dark.png" style="width: 30px; margin: 2px 0">`;
        }
    }

    fillArr() {
        const savedBoard = JSON.parse(localStorage.getItem('indexes'));
        if (savedBoard) {
            this.boardArr = savedBoard;
            this.startGame = false;
            return;
        }
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
        this.startGame = false;
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
                    this.cells[i][j].style.border = "none";
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
        if (_i !== 0) {
            if (this.boardArr[_i][_j] === "red") {
                if (this.boardArr[(_i - 1)][(_j - 1)] === "true") {
                    return true;
                }
            }
        }
        return false;
    }
    checkEatOpponentRight(_i, _j) {
        if (_i !== 0) {
            if (this.boardArr[_i][_j] === "red") {
                if (this.boardArr[(_i - 1)][(_j + 1)] === "true") {
                    return true;
                }
            }
        }
        return false;
    }

    removeLeftEatListener(_i, _j) {
        if (this.handlerLeftEat) {
            this.cells[_i][_j].removeEventListener("click", this.handlerLeftEat);
            this.handlerLeftEat = null;
        }
    }

    removeRightEatListener(_i, _j) {
        if (this.handlerRightEat) {
            this.cells[_i][_j].removeEventListener("click", this.handlerRightEat);
            this.handlerRightEat = null;
        }
    }

    listenerRightEat(_i, _j) {
        return () => {

            if (_i === 0) {
                this.boardArr[_i][_j] = "kingDark";
                // this.boardArr[_i][_j] = "dark";
                console.log("המלך הגיע!!!!!!!!!!!!!");
                console.log("boardarr: " + this.boardArr);

            }
            else {
                this.boardArr[_i][_j] = "dark";
            }
            // this.boardArr[_i][_j] = "dark";
            this.boardArr[_i + 1][_j - 1] = "true";
            this.boardArr[_i + 2][_j - 2] = "true";
            this.cells[_i + 1][_j - 1].innerHTML = "";
            this.cells[_i + 2][_j - 2].innerHTML = "";

            this.counterRedPawn--;
            this.updaterRedCounter();

            this.removeRightEatListener(_i, _j); // הוספת שורה זו
            this.render();
            this.resetLine(_i);
            this.resetLine(_i + 1);

            setTimeout(() => {
                this.myTimer = 0;
                this.moveDown();
            }, this.computerDelay);
        }
    }


    listenerLeftEat(_i, _j) {
        return () => {
            if (_i === 0) {
                this.boardArr[_i][_j] = "kingDark";
                // this.boardArr[_i][_j] = "dark";
                console.log("המלך הגיע!!!!!!!!!!!!!");
                console.log("boardarr: " + this.boardArr);


            }
            else {
                this.boardArr[_i][_j] = "dark";
            }

            // this.cells[_i][_j].addEventListener
            this.boardArr[_i + 1][_j + 1] = "true";
            this.boardArr[_i + 2][_j + 2] = "true";
            this.cells[_i + 1][_j + 1].innerHTML = "";
            this.cells[_i + 2][_j + 2].innerHTML = "";
            this.counterRedPawn--;
            this.updaterRedCounter();

            this.removeLeftEatListener(_i, _j); // הוספת שורה זו
            this.render();
            this.resetLine(_i);
            this.resetLine(_i + 1);

            setTimeout(() => {
                this.myTimer = 0;
                this.moveDown();
            }, this.computerDelay);
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
        if (this.boardArr[_toI][_toJ] === "true") {
            if (_toI === 0) {
                this.boardArr[_toI][_toJ] = "kingDark";
                console.log("המלך הגיע!!!!!!!!!!!!!");
                console.log("boardarr: " + this.boardArr);
            }
            else {
                this.boardArr[_toI][_toJ] = "dark";
            }
            this.boardArr[_fromI][_fromJ] = "true";
            this.cells[_fromI][_fromJ].innerHTML = "";
            this.render();
            this.resetLine(_toI);

            setTimeout(() => {
                this.myTimer = 0;
                this.moveDown();
            }, this.computerDelay);
        }
    }

    drawCelForMove(_i, _j) {
        if (this.boardArr[_i][_j] == "true") {
            this.cells[_i][_j].style.backgroundColor = "rgb(0, 127, 197)";

            // this.cells[_i][_j].classList = "chang center";
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
                this.drawCelForMove(_fromI - 2, _fromJ - 2);
                this.handlerLeftEat = this.listenerLeftEat(_fromI - 2, _fromJ - 2);
                this.cells[_fromI - 2][_fromJ - 2].addEventListener("click", this.handlerLeftEat);
                return;

            }
            if (this.checkEatOpponentRight(_fromI - 1, _fromJ + 1)) {
                console.log("eat in right");
                this.drawCelForMove(_fromI - 2, _fromJ + 2);
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
    isRedCanEatLeft(_i, _j) {
        if (_i + 2 < this.cells.length && _j - 2 >= 0) {
            if (this.boardArr[_i + 1][_j - 1] === "dark") {
                if (this.boardArr[_i + 2][_j - 2] === "true") {
                    console.log("cannnnnn");
                    return true;
                }
            }
            return false;
        }
    }
    isRedCanEatRight(_i, _j) {
        if (_i + 2 < this.cells.length && _j + 2 < this.cells.length) {
            if (this.boardArr[_i + 1][_j + 1] === "dark") {
                if (this.boardArr[_i + 2][_j + 2] === "true") {
                    return true;
                }
            }
        }
        return false;
    }
    isRedMoveRight(_i, _j) {
        if (_i + 1 < this.cells.length && _j + 1 < this.cells.length) {
            if (this.boardArr[_i + 1][_j + 1] === "true") {
                return true;
            }
        }
        return false;
    }
    isRedMoveLeft(_i, _j) {
        if (_i + 1 < this.cells.length && _j - 1 < this.cells.length) {
            if (this.boardArr[_i + 1][_j - 1] === "true") {
                return true;
            }
        }
        return false;
    }

    moveKing(_i, _j) {
        if (_i != this.row-1) {
            if (this.isRedMoveLeft(_i, _j)) {
                console.log("king can left");
                
                this.boardArr[_i][_j] = "true";
                this.cells[_i][_j].innerHTML = "";
                this.boardArr[_i + 1][_j - 1] = "kingDark";
                this.myTimer = 0;
                this.render();
            }
            if (this.isRedMoveRight(_i, _j)) {
                console.log("king can right");
                
                setTimeout(() => {
                    this.boardArr[_i][_j] = "true";
                    this.cells[_i][_j].innerHTML = "";
                    this.boardArr[_i + 1][_j + 1] = "kingDark"; // תיקון שם המשתנה
                    this.myTimer = 0;
                    this.render();
                }, this.computerDelay);
            }
        }
    }

    moveDown() {
        let arrRed = [];
        for (let i = 0; i < this.boardArr.length; i++) {
            for (let j = 0; j < this.boardArr[i].length; j++) {
                if (this.boardArr[i][j] === "red") {
                    arrRed.push({ i, j });
                }
            }
        }

        for (let k = 0; k < arrRed.length; k++) {
            const currentPawn = arrRed[k];

            if (this.isRedCanEatLeft(currentPawn.i, currentPawn.j)) {
                const fromI = currentPawn.i;
                const fromJ = currentPawn.j;
                const toI = fromI + 2;
                const toJ = fromJ - 2;

                setTimeout(() => {
                    this.cells[fromI][fromJ].innerHTML = "";
                    this.cells[fromI + 1][fromJ - 1].innerHTML = "";
                    this.boardArr[fromI][fromJ] = "true";
                    this.boardArr[fromI + 1][fromJ - 1] = "true";
                    this.boardArr[toI][toJ] = "red";
                    this.counterDarkPawn--;
                    this.updaterDarkCounter();
                    this.render();
                    this.myTimer = 1;
                }, this.computerDelay);

                return;
            }
            else if (this.isRedCanEatRight(currentPawn.i, currentPawn.j)) {
                const fromI = currentPawn.i;
                const fromJ = currentPawn.j;
                const toI = fromI + 2;
                const toJ = fromJ + 2;

                setTimeout(() => {
                    this.cells[fromI][fromJ].innerHTML = "";
                    this.cells[fromI + 1][fromJ + 1].innerHTML = "";

                    this.boardArr[fromI][fromJ] = "true";
                    this.boardArr[fromI + 1][fromJ + 1] = "true";

                    this.boardArr[toI][toJ] = "red";
                    this.counterDarkPawn--;
                    this.updaterDarkCounter();
                    this.render();
                    this.myTimer = 1;

                }, this.computerDelay);
                return;
            }
        }
        let arrMoveREd = [];
        for (let i = 0; i < arrRed.length; i++) {
            if (this.isRedMoveLeft(arrRed[i].i, arrRed[i].j) || this.isRedMoveRight(arrRed[i].i, arrRed[i].j)) {
                arrMoveREd.push({ i: arrRed[i].i, j: arrRed[i].j });
            }
        }
        let random = Math.floor(Math.random() * arrMoveREd.length)
        let pawnCurrent = arrMoveREd[random];
        if (this.isRedMoveLeft(pawnCurrent.i, pawnCurrent.j)) {
            const fromI = pawnCurrent.i;
            const fromJ = pawnCurrent.j;
            setTimeout(() => {
                this.cells[fromI][fromJ].innerHTML = "";
                this.boardArr[fromI][fromJ] = "true";
                this.boardArr[fromI + 1][fromJ - 1] = "red";
                this.render();
                this.myTimer = 1;
            }, this.computerDelay);
            return;
        }

        else if (this.isRedMoveRight(pawnCurrent.i, pawnCurrent.j)) {
            const fromI = pawnCurrent.i;
            const fromJ = pawnCurrent.j;
            setTimeout(() => {
                this.cells[fromI][fromJ].innerHTML = "";
                this.boardArr[fromI][fromJ] = "true";
                this.boardArr[fromI + 1][fromJ + 1] = "red";
                this.render();
                this.myTimer = 1;
            }, this.computerDelay);
            return;
        }
    }

    render() {
        // this.arrSave = this.boardArr;
        localStorage.setItem('indexes', JSON.stringify(this.boardArr)); console.log("my timer:" + this.myTimer);

        console.log("counter red: " + this.counterRedPawn);
        console.log("counter dark: " + this.counterDarkPawn);

        const savedBoard = JSON.parse(localStorage.getItem('indexes'));
        console.log("boardAA" + this.boardArr);
        console.log("savedBoard" + savedBoard);
        if (savedBoard) {
            console.log("llllllllllllllll");

            this.boardArr = savedBoard;
        }

        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                // שומרים על צבעי הלוח המקוריים
                if ((i + j) % 2 === 0) {
                    this.cells[i][j].className = "cell cell-dark center";
                }

                if (this.cells[i][j].querySelector(".pawn")) continue;
                if (this.cells[i][j].querySelector(".king")) continue;

                let pawnDark = document.createElement("img");
                pawnDark.src = "./files/dark.png";
                pawnDark.alt = "pawn dark";
                pawnDark.classList = "pawn pawn-dark"

                let pawnRed = document.createElement("img");
                pawnRed.src = "./files/light.png";
                pawnRed.alt = "pawn light";
                pawnRed.classList = "pawn pawn-light"

                let kingDark = document.createElement("img");
                kingDark.src = "./files/king-dark.png";
                kingDark.alt = "king";
                kingDark.classList = "king pawn-dark"

                if (this.boardArr[i][j] === "dark") this.cells[i][j].appendChild(pawnDark)
                if (this.boardArr[i][j] === "red") this.cells[i][j].appendChild(pawnRed)
                if (this.boardArr[i][j] === "kingDark") this.cells[i][j].appendChild(kingDark)

                if (this.myTimer === 1) {

                    if (this.boardArr[i][j] === "dark") {
                        this.cells[i][j].firstElementChild.addEventListener("click", () => {
                            this.resetBoard();
                            this.removeRightListener();
                            this.removeLeftListener();
                            this.cells[i][j].style.border = "2px solid white";
                            this.cells[i][j].style.borderRadius = "5px"
                            this.MoveUp(i, j);
                        });
                    }
                    else if (this.boardArr[i][j] === "kingDark") {
                        this.cells[i][j].firstElementChild.addEventListener("click", () => {
                            // this.resetBoard();
                            this.removeRightListener();
                            this.removeLeftListener();
                            this.cells[i][j].style.border = "2px solid white";
                            this.cells[i][j].style.borderRadius = "5px"
                            this.moveKing(i, j);
                        });

                    }
                }
            }
        }
    }
}
