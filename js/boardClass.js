const COLOR_BOARD_DARK = "rgb(41, 88, 108)";
// import Sound from "./soundClass";

async function loadSound() {
    const Sound = await import('./soundClass.js');
    return Sound.default;
}

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
        this.indexUser = this.returnIndexOfCurrentUser();
        this.sound = null; // במקום ליצור את האובייקט, נאתחל אותו כ-null
        this.initSound(); // נקרא לפונקציה שתיצור את האובייקט
    }

    async initSound() {
        try {
            const SoundModule = await import('./soundClass.js');
            this.sound = new SoundModule.default("./files/sounds/click.wav");
        } catch (error) {
            console.error("Could not load sound module:", error);
        }
    }

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
    returnIndexOfCurrentUser() {
        const usersData = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = localStorage.getItem("currentUser");
        for (let i = 0; i < usersData.length; i++) {
            if (usersData[i].username === currentUser) { 
                return i;
            }
        }
        return -1;
    }

    fillArr() {
        const usersData = JSON.parse(localStorage.getItem("users"));
        this.boardArr = usersData[this.indexUser].dataGame;
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
                if (this.boardArr[i][j] === "dark" || this.boardArr[i][j] === "true" || this.boardArr[i][j] === "kingDark") {
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

    checkEatOpponentLeftDwon(_i, _j) {
        if (_i !== this.cells.length - 1) {
            if (this.boardArr[_i][_j] === "red") {
                if (this.boardArr[(_i + 1)][(_j - 1)] === "true") {
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

    checkEatOpponentRightDown(_i, _j) {
        if (_i !== this.cells.length - 1) {
            if (this.boardArr[_i][_j] === "red") {
                if (this.boardArr[(_i + 1)][(_j + 1)] === "true") {
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


    listenerLeftEat(_i, _j) {
        return () => {
            if (_i === 0) {
                this.boardArr[_i][_j] = "kingDark";
                console.log("המלך הגיע!!!!!!!!!!!!!");
                console.log("boardarr: " + this.boardArr);
            }
            else {
                this.boardArr[_i][_j] = "dark";
            }
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


    listenerLeftEatDown(_i, _j) {
        return () => {
            // if (_i === 0) {
            this.boardArr[_i][_j] = "kingDark";
            console.log("המלך הגיע!!!!!!!!!!!!!");
            console.log("boardarr: " + this.boardArr);
            // }
            // else {
            //     this.boardArr[_i][_j] = "dark";
            // }
            this.boardArr[_i - 1][_j + 1] = "true";
            this.boardArr[_i - 2][_j + 2] = "true";
            this.cells[_i - 1][_j + 1].innerHTML = "";
            this.cells[_i - 2][_j + 2].innerHTML = "";
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


    listenerRightEatDown(_i, _j) {
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
            this.boardArr[_i - 1][_j - 1] = "true";
            this.boardArr[_i - 2][_j - 2] = "true";
            this.cells[_i - 1][_j - 1].innerHTML = "";
            this.cells[_i - 2][_j - 2].innerHTML = "";

            this.counterRedPawn--;
            this.updaterRedCounter();

            this.removeRightEatListener(_i, _j); // הוספת שורה זו
            this.render();
            this.resetLine(_i);
            this.resetLine(_i - 1);

            setTimeout(() => {
                this.myTimer = 0;
                this.moveDown();
            }, this.computerDelay);
        }
    }




    leftListener(_fromI, _fromJ, _toI, _toJ) {
        console.log("entered left listener");

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
    isKingDark(_i, _j) {
        return this.boardArr[_i][_j] === "kingDark";
    }

    movePawn(_fromI, _fromJ, _toI, _toJ) {
        console.log("entered move pawn");
        if (_toI !== 0) {
            if (this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "kingDark";
            }
            else if (!this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "dark";
            }
        }
        else if (_toI === 0) {
            this.boardArr[_toI][_toJ] = "kingDark";
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

    drawCelForMove(_i, _j) {
        if (this.boardArr[_i][_j] == "true") {
            this.cells[_i][_j].style.backgroundColor = "rgb(0, 127, 197)";
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
            if (this.collision(_fromI - 1, _fromJ - 1) && this.collision(_fromI - 1, _fromJ + 1)) {
                console.log("rl");
                this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1)
                this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);

            }

            else if (this.collision(_fromI - 1, _fromJ - 1)) {
                console.log("L");
                this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);
            }
            else if (this.collision(_fromI - 1, _fromJ + 1)) {
                console.log("r");
                this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1);
            }
        }

    }
    isRedCanEatLeft(_i, _j) {
        if (_i + 2 < this.cells.length && _j - 2 >= 0) {
            if (this.boardArr[_i + 1][_j - 1] === "dark" || this.isKingDark(_i + 1, _j - 1)) {
                if (this.boardArr[_i + 2][_j - 2] === "true") {
                    return true;
                }
            }
            return false;
        }
    }
    isRedCanEatRight(_i, _j) {
        if (_i + 2 < this.cells.length && _j + 2 < this.cells.length) {
            if (this.boardArr[_i + 1][_j + 1] === "dark" || this.isKingDark(_i + 1, _j + 1)) {
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
        if (_i < this.cells.length - 1 && _j - 1 < this.cells.length) {
            if (this.boardArr[_i + 1][_j - 1] === "true") {
                return true;
            }
        }
        return false;
    }

    moveKing(_i, _j) {

        if (this.checkEatOpponentLeftDwon(_i + 1, _j - 1)) {
            console.log("king eat L");
            this.drawCelForMove(_i + 2, _j - 2);
            this.handlerLeftEat = this.listenerLeftEatDown(_i + 2, _j - 2);
            this.cells[_i + 2][_j - 2].addEventListener("click", this.handlerLeftEat);
            return;
        }
        if (this.checkEatOpponentRightDown(_i + 1, _j + 1)) {
            console.log("king eat R");
            this.drawCelForMove(_i + 2, _j + 2);
            this.handlerLeftEat = this.listenerRightEatDown(_i + 2, _j + 2);
            this.cells[_i + 2][_j + 2].addEventListener("click", this.handlerLeftEat);
            return;
        }
        if (this.collision(_i + 1, _j - 1) && this.collision(_i + 1, _j + 1)) {
            console.log("king RL");
            this.leftListener(_i, _j, _i + 1, _j - 1);
            this.rightListener(_i, _j, _i + 1, _j + 1);

        }
        else if (this.collision(_i + 1, _j - 1)) {
            console.log("king L");
            this.leftListener(_i, _j, _i + 1, _j - 1);
        }
        else if (this.collision(_i + 1, _j + 1)) {
            console.log("king R");
            this.rightListener(_i, _j, _i + 1, _j + 1);
        }
        if (_j === this.cells.length - 1) {
            this.drawCelForMove(_i + 1, _j - 1);
        }
        else if (_j === 0) {
            this.drawCelForMove(_i + 1, _j + 1);
        }
        else if (_j !== 0 && _j !== this.cells.length - 1) {
            this.drawCelForMove(_i + 1, _j - 1);
            this.drawCelForMove(_i + 1, _j + 1);
        }
    }

    lightToKing(_i, _j) {
        if (_i === this.boardArr.length - 1) this.boardArr[_i][_j] = "kingLight";
    }

    isKingRed(_i, _j) {
        return this.boardArr[_i][_j] === "kingRed";
    }
    moveDown() {
        let arrRed = [];
        for (let i = 0; i < this.boardArr.length; i++) {
            for (let j = 0; j < this.boardArr[i].length; j++) {
                if (this.boardArr[i][j] === "red" || this.isKingRed(i, j)) {
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
                    // קודם נציב את החייל האדום במיקום החדש
                    if (this.isKingRed(fromI, fromJ) || toI === this.boardArr.length - 1) {
                        this.boardArr[toI][toJ] = "kingRed";
                    } else {
                        this.boardArr[toI][toJ] = "red";
                    }

                    // רק אז נמחק את המיקום הישן ואת החייל שנאכל
                    this.boardArr[fromI][fromJ] = "true";
                    this.boardArr[fromI + 1][fromJ - 1] = "true";
                    this.cells[fromI][fromJ].innerHTML = "";
                    this.cells[fromI + 1][fromJ - 1].innerHTML = "";

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
                    // קודם נציב את החייל האדום במיקום החדש
                    if (this.isKingRed(fromI, fromJ) || toI === this.boardArr.length - 1) {
                        this.boardArr[toI][toJ] = "kingRed";
                    } else {
                        this.boardArr[toI][toJ] = "red";
                    }

                    // רק אז נמחק את המיקום הישן ואת החייל שנאכל
                    this.boardArr[fromI][fromJ] = "true";
                    this.boardArr[fromI + 1][fromJ + 1] = "true";
                    this.cells[fromI][fromJ].innerHTML = "";
                    this.cells[fromI + 1][fromJ + 1].innerHTML = "";

                    this.counterDarkPawn--;
                    this.updaterDarkCounter();
                    this.render();
                    this.myTimer = 1;
                }, this.computerDelay);
                return;
            }
        }
        const kingMoved = this.moveKingRedUp();
        if (kingMoved) {
            return;
        }

        let arrMoveREd = [];
        for (let i = 0; i < arrRed.length; i++) {
            if (this.isRedMoveLeft(arrRed[i].i, arrRed[i].j) || this.isRedMoveRight(arrRed[i].i, arrRed[i].j)) {
                arrMoveREd.push({ i: arrRed[i].i, j: arrRed[i].j });
            }
        }

        // בדיקה שיש תזוזות אפשריות
        if (arrMoveREd.length === 0) {
            console.log("אין לאן לזוז");
            this.myTimer = 1;
            return;
        }

        let random = Math.floor(Math.random() * arrMoveREd.length);
        let pawnCurrent = arrMoveREd[random];

        if (this.isRedMoveLeft(pawnCurrent.i, pawnCurrent.j)) {
            const fromI = pawnCurrent.i;
            const fromJ = pawnCurrent.j;
            setTimeout(() => {
                this.cells[fromI][fromJ].innerHTML = "";
                this.boardArr[fromI][fromJ] = "true";
                if (this.isKingRed(fromI, fromJ) || fromI + 1 === this.boardArr.length - 1) {
                    this.boardArr[fromI + 1][fromJ - 1] = "kingRed";
                } else {
                    this.boardArr[fromI + 1][fromJ - 1] = "red";
                }
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
                if (this.isKingRed(fromI, fromJ) || fromI + 1 === this.boardArr.length - 1) {
                    this.boardArr[fromI + 1][fromJ + 1] = "kingRed";
                } else {
                    this.boardArr[fromI + 1][fromJ + 1] = "red";
                }
                this.render();
                this.myTimer = 1;
            }, this.computerDelay);
            return;
        }

    }

    moveKingRedUp() {
        let kingsCanMove = [];
        for (let i = 0; i < this.boardArr.length; i++) {
            for (let j = 0; j < this.boardArr.length; j++) {
                if (this.isKingRed(i, j)) {
                    if (this.isKingCanEatLeftUp(i, j) || this.isKingCanEatRightUp(i, j) || this.isKingRedMoveLeftUp(i, j) || this.isKingRedMoveRightUp(i, j)) {
                        kingsCanMove.push({ i, j });
                    }
                }
            }
        }
        let randomKing = Math.floor(Math.random() * kingsCanMove.length);
        let kingCurrent = kingsCanMove[randomKing];
        let existKings = kingsCanMove.length > 0;  // התיקון כאן

        if (existKings && this.isKingCanEatLeftUp(kingCurrent.i, kingCurrent.j)) {
            console.log("יש אכילה בשמאל");

            const fromI = kingCurrent.i;
            const fromJ = kingCurrent.j;
            setTimeout(() => {
                this.cells[fromI][fromJ].innerHTML = "";
                this.boardArr[fromI][fromJ] = "true";
                this.boardArr[fromI - 1][fromJ - 1] = "true";
                this.cells[fromI - 1][fromJ - 1].innerHTML = "";
                this.boardArr[fromI - 2][fromJ - 2] = "kingRed";

                this.render();
                this.myTimer = 1;
            }, this.computerDelay);
            return true;
        }
        if (existKings && this.isKingCanEatRightUp(kingCurrent.i, kingCurrent.j)) {
            console.log("יש אכילה בימין");
            const fromI = kingCurrent.i;
            const fromJ = kingCurrent.j;
            setTimeout(() => {
                this.cells[fromI][fromJ].innerHTML = "";
                this.boardArr[fromI][fromJ] = "true";
                this.boardArr[fromI - 1][fromJ + 1] = "true";
                this.cells[fromI - 1][fromJ + 1].innerHTML = "";
                this.boardArr[fromI - 2][fromJ + 2] = "kingRed";

                this.render();
                this.myTimer = 1;
            }, this.computerDelay);
            return true;
        }

        if (existKings && this.isKingRedMoveLeftUp(kingCurrent.i, kingCurrent.j)) {
            console.log("יש תנועה בשמאל");
            const fromI = kingCurrent.i;
            const fromJ = kingCurrent.j;

            setTimeout(() => {
                this.cells[fromI][fromJ].innerHTML = "";
                this.boardArr[fromI][fromJ] = "true";
                this.boardArr[fromI - 1][fromJ - 1] = "kingRed";

                this.render();
                this.myTimer = 1;
            }, this.computerDelay);
            return true;
        }

        if (existKings && this.isKingRedMoveRightUp(kingCurrent.i, kingCurrent.j)) {
            console.log("יש תנועה בימין");
            const fromI = kingCurrent.i;
            const fromJ = kingCurrent.j;

            setTimeout(() => {
                this.cells[fromI][fromJ].innerHTML = "";
                this.boardArr[fromI][fromJ] = "true";
                this.boardArr[fromI - 1][fromJ + 1] = "kingRed";

                this.render();
                this.myTimer = 1;
            }, this.computerDelay);
            return true;
        }
        return false; // אם לא בוצע אף מהלך עם מלך
    }

    isKingRedMoveLeftUp(_i, _j) {
        if (_i !== 0 && _j >= 1) {
            if (this.boardArr[_i - 1][_j - 1] === "true") {
                return true;
            }
        }
        return false;
    }
    isKingRedMoveRightUp(_i, _j) {
        if (_i !== 0 && _j < this.boardArr.length - 2) {
            if (this.boardArr[_i - 1][_j + 1] === "true") {
                return true;
            }
        }
        return false;
    }

    isKingCanEatLeftUp(_i, _j) {
        if (_i > 1 && _j > 1) {
            if (this.boardArr[_i - 1][_j - 1] === "dark" || this.boardArr[_i - 1][_j - 1] === "kingDark") {
                if (this.boardArr[_i - 2][_j - 2] === "true")
                    return true;
            }
        }
        return false;
    }

    isKingCanEatRightUp(_i, _j) {
        if (_i > 1 && _j < this.boardArr.length - 2) {
            if (this.boardArr[_i - 1][_j + 1] === "dark" || this.boardArr[_i - 1][_j + 1] === "kingDark") {  // הוספת בדיקה למלך שחור
                if (this.boardArr[_i - 2][_j + 2] === "true") {
                    console.log("נמצאה אפשרות אכילה ימינה למעלה");
                    return true;
                }
            }
        }
        return false;
    }


    render() {
       const users = JSON.parse(localStorage.getItem("users"));
       users[this.indexUser].dataGame = this.boardArr;
       localStorage.setItem("users", JSON.stringify(users));
    


        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
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

                let kingRed = document.createElement("img");
                kingRed.src = "./files/king-light.png";
                kingRed.alt = "king";
                kingRed.classList = "king pawn-light"

                if (this.boardArr[i][j] === "dark") this.cells[i][j].appendChild(pawnDark)
                if (this.boardArr[i][j] === "red") this.cells[i][j].appendChild(pawnRed)
                if (this.boardArr[i][j] === "kingDark") this.cells[i][j].appendChild(kingDark)
                if (this.boardArr[i][j] === "kingRed") this.cells[i][j].appendChild(kingRed)

                this.removeRightListener();
                this.removeLeftListener();
                if (this.myTimer === 1) {

                    if (this.boardArr[i][j] === "dark") {
                        this.cells[i][j].firstElementChild.addEventListener("click", () => {
                            this.sound.playClick();
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
                            this.sound.playClick();
                            this.resetBoard();
                            this.removeRightListener();
                            this.removeLeftListener();
                            this.cells[i][j].style.border = "2px solid white";
                            this.cells[i][j].style.borderRadius = "5px"
                            this.moveKing(i, j);
                            // this.MoveUp(i, j);
                        });

                    }
                }
            }
        }
    }
}
