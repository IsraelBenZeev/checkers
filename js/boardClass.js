const COLOR_BOARD_DARK = "rgb(41, 88, 108)";
const COLOR_MOVE = "rgb(10, 163, 229)";
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
        this.handlerLeft = null;
        this.handlerRight = null;
        this.handlerLeftEat = null;
        this.handlerRightEat = null;

        this.indexesLisLeft = [null, null];
        this.indexesLisRight = [null, null];
        this.indexesLisLeftEat = [null, null];
        this.indexesLisRightEat = [null, null];

        this.handlerLeftKing = null;
        this.handlerRightKing = null;
        this.handlerLeftEatKing = null;
        this.handlerRightEatKing = null;

        this.indexesLisLeftKing = [null, null];
        this.indexesLisRightKing = [null, null];
        this.indexesLisLeftEatKing = [null, null];
        this.indexesLisRightEatKing = [null, null];

        this.indexUser = this.returnIndexOfCurrentUser();
        this.counterDarkPawn = this.returnCounterDark();
        this.counterRedPawn = this.returnCounterRed();
        this.direction = null;
        this.myTimer = 1;
        this.computerDelay = 300;
        this.sound = null; // במקום ליצור את האובייקט, נאתחל אותו כ-null
        this.initSound(); // נקרא לפונקציה שתיצור את האובייקט
    }

    async initSound() {
        try {
            const SoundModule = await import('./soundClass.js');
            this.sound = new SoundModule.default("./files/sounds/click.wav", "./files/sounds/eat.mp3", "./files/sounds/move2.mp3", "./files/sounds/king.wav");
        } catch (error) {
            console.error("Could not load sound module:", error);
        }
    }

    victory(){
        if(this.counterRedPawn === 0){
            console.log("you won!!!!!!!!!!");
            
            window.location.href="./victory.html";
        }
    }

    updaterRedCounter() {
        console.log("counterRedPawn after eat: " + this.counterRedPawn);
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[this.indexUser].pawnDied[1] = this.counterRedPawn;
        localStorage.setItem("users", JSON.stringify(users)); 

        const pawnsDed = document.querySelector(".pawns-red-ded");
        pawnsDed.style.direction = "rtl";
        pawnsDed.innerHTML = "";
        const counterRed = users[this.indexUser].pawnDied[0];
        for (let i = 0; i < 12 - this.counterRedPawn; i++) {
            pawnsDed.innerHTML += `<img src="./files/light.png" style="width: 30px;  margin: 2px 0">`;
        }
    }

    updaterDarkCounter() {
        console.log("counterDarkPawn after eat: " + this.counterDarkPawn);
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[this.indexUser].pawnDied[0] = this.counterDarkPawn;
        localStorage.setItem("users", JSON.stringify(users)); 

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
    returnCounterDark() {
        const users = JSON.parse(localStorage.getItem("users"));
        const counterDark = users[this.indexUser].pawnDied[0];
        console.log("counterDark in start game: " + counterDark);
        return counterDark;
    }
    returnCounterRed() {
        const users = JSON.parse(localStorage.getItem("users"));
        const counterRed = users[this.indexUser].pawnDied[1];
        console.log("counterRed in start game: " + counterRed);
        return counterRed;
    }
    fillArr() {
        const usersData = JSON.parse(localStorage.getItem("users"));
        console.log("user:" + usersData[this.indexUser].username);
        console.log("data:" + usersData[this.indexUser].dataGame);
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
        if (_i > 1 && _j > 1) {
            if (this.boardArr[_i - 1][_j - 1] === "red" || this.boardArr[_i - 1][_j - 1] === "kingRed") {
                if (this.boardArr[_i - 2][_j - 2] === "true") {
                    return true;
                }
            }
        }
        return false;
    }
    checkEatOpponentRight(_i, _j) {
        if (_i > 1 && _j < this.col) {
            if (this.boardArr[_i - 1][_j + 1] === "red" || this.boardArr[_i - 1][_j + 1] === "kingRed") {
                if (this.boardArr[_i - 2][_j + 2] === "true") {
                    return true;
                }
            }
        }
        return false;
    }


    checkEatOpponentLeftForKing(_i, _j) {
        console.log("i:" + _i + ", j: " + _j);

        if (_i < this.cells.length && _j > 1) {
            console.log("נכנס לבדיקת שמאל");
            if (this.boardArr[_i + 1][_j - 1] === "red" || this.boardArr[_i + 1][_j - 1] === "kingRed") {
                if (this.boardArr[_i + 2][_j - 2] === "true") {
                    return true;
                }
            }
        }
        return false;
    }
    checkEatOpponentRightForKing(_i, _j) {
        if (_i < this.col && _j < this.row) {
            console.log("נכנס לבדיקת ימין");

            if (this.boardArr[_i + 1][_j + 1] === "red" || this.boardArr[_i + 1][_j + 1] === "kingRed") {
                if (this.boardArr[_i + 2][_j + 2] === "true") {
                    return true;
                }
            }
        }
        return false;
    }




    listenerLeftEat(_i, _j) {
        const toI = _i - 2;
        const toJ = _j - 2;
        const diedI = _i - 1;
        const diedJ = _j - 1;
        console.log("eat in L function");
        this.handlerLeftEat = () => this.moveEat(_i, _j, toI, toJ, diedI, diedJ);
        this.cells[toI][toJ].addEventListener("click", this.handlerLeftEat);
        this.indexesLisLeftEat[0] = toI;
        this.indexesLisLeftEat[1] = toJ;
    }
    removeLeftListenerEat() {
        console.log("enter move remove eat L");
        if (this.indexesLisLeftEat[0] !== null && this.indexesLisLeftEat[1] !== null && this.handlerLeftEat) {
            this.cells[this.indexesLisLeftEat[0]][this.indexesLisLeftEat[1]].removeEventListener("click", this.handlerLeftEat);
            this.handlerLeftEat = null;
        }
    }
    listenerRightEat(_i, _j) {
        console.log("eat in R function");
        const toI = _i - 2;
        const toJ = _j + 2;
        const diedI = _i - 1;
        const diedJ = _j + 1;
        console.log("eat in R function");
        this.handlerRightEat = () => this.moveEat(_i, _j, toI, toJ, diedI, diedJ);
        this.cells[toI][toJ].addEventListener("click", this.handlerRightEat);
        this.indexesLisRightEat[0] = toI;
        this.indexesLisRightEat[1] = toJ;
    }
    removeRightListenerEat() {
        console.log("enter move remove eat R");
        if (this.indexesLisRightEat[0] !== null && this.indexesLisRightEat[1] !== null && this.handlerRightEat) {
            this.cells[this.indexesLisRightEat[0]][this.indexesLisRightEat[1]].removeEventListener("click", this.handlerRightEat);
            this.handlerRightEat = null;
        }
    }
    moveEat(_fromI, _fromJ, _toI, _toJ, _diedI, _diedJ) {
        console.log("enter to move eat");
        this.sound.playEting();
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

        this.counterRedPawn--;
        this.victory();

        this.updaterRedCounter();
        this.removeLeftListenerEat();
        this.removeRightListenerEat();
        this.removeLisLeftEatKing();
        this.removeLisRightEatKing();
        this.resetBoard();
        this.render();

        setTimeout(() => {
            this.myTimer = 0;
            this.moveDown();
        }, this.computerDelay);
    }

    listinerLeftKing(_i, _j) {
        const to_i = _i + 1;
        const to_j = _j - 1;
        this.handlerLeftKing = () => { this.movePawn(_i, _j, to_i, to_j) }
        this.cells[to_i][to_j].addEventListener("click", this.handlerLeftKing);
        this.indexesLisLeftKing[0] = to_i;
        this.indexesLisLeftKing[1] = to_j;
    }
    removeLisLeftKing() {
        if (this.indexesLisLeftKing[0] !== null && this.indexesLisLeftKing[1] !== null && this.handlerLeftKing) {
            this.cells[this.indexesLisLeftKing[0]][this.indexesLisLeftKing[1]].removeEventListener("click", this.handlerLeftKing);
            this.handlerLeftKing = null;
        }
    }
    listinerRightKing(_i, _j) {
        const to_i = _i + 1;
        const to_j = _j + 1;
        this.handlerRightKing = () => { this.movePawn(_i, _j, to_i, to_j) }
        this.cells[to_i][to_j].addEventListener("click", this.handlerRightKing);
        this.indexesLisRightKing[0] = to_i;
        this.indexesLisRightKing[1] = to_j;
    }
    removeLisRightKing() {
        if (this.indexesLisRightKing[0] !== null && this.indexesLisRightKing[1] !== null && this.handlerRightKing) {
            this.cells[this.indexesLisRightKing[0]][this.indexesLisRightKing[1]].removeEventListener("click", this.handlerRightKing);
            this.handlerRightKing = null;
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
        console.log("entered move pawn");
        this.sound.stopAll();
        if (_toI !== 0) {
            if (this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "kingDark";
                // this.sound.stopMove();
                this.sound.playMove();
            }
            else if (!this.isKingDark(_fromI, _fromJ)) {
                this.boardArr[_toI][_toJ] = "dark";
                // this.sound.stopMove();
                this.sound.playMove();
            }
        }
        else if (_toI === 0) {
            this.boardArr[_toI][_toJ] = "kingDark";
            this.sound.stopMove();

            this.sound.playKing();
        }
        
        this.boardArr[_fromI][_fromJ] = "true";
        this.cells[_fromI][_fromJ].innerHTML = "";
        this.removeRightListener();
        this.removeLeftListener();
        this.removeLisLeftKing();
        this.removeLisRightKing();
        this.resetBoard();
        this.render();

        setTimeout(() => {
            this.myTimer = 0;
            this.moveDown();
        }, this.computerDelay);
    }

    drawCelForMove(_i, _j) {
        console.log("direction:" + this.direction);

        switch (this.direction) {
            case "lr":
                this.cells[_i - 1][_j - 1].style.backgroundColor = COLOR_MOVE;
                this.cells[_i - 1][_j + 1].style.backgroundColor = COLOR_MOVE;
                break;
            case "l":
                this.cells[_i - 1][_j - 1].style.backgroundColor = COLOR_MOVE;
                break;
            case "r":
                this.cells[_i - 1][_j + 1].style.backgroundColor = COLOR_MOVE;
                break;
            case "l_eat":
                this.cells[_i - 2][_j - 2].style.backgroundColor = COLOR_MOVE;
                break;
            case "r_eat":
                this.cells[_i - 2][_j + 2].style.backgroundColor = COLOR_MOVE;
                break;
            case "lr_eat":
                this.cells[_i - 2][_j - 2].style.backgroundColor = COLOR_MOVE;
                this.cells[_i - 2][_j + 2].style.backgroundColor = COLOR_MOVE;
                break;
            case "l_king":
                this.cells[_i + 1][_j - 1].style.backgroundColor = COLOR_MOVE;
                break;
            case "r_king":
                this.cells[_i + 1][_j + 1].style.backgroundColor = COLOR_MOVE;
                break;
            case "l_eat_king":
                this.cells[_i + 2][_j - 2].style.backgroundColor = COLOR_MOVE;
                break;
            case "r_eat_king":
                this.cells[_i + 2][_j + 2].style.backgroundColor = COLOR_MOVE;
                break;
            case "lr_eat_king":
                this.cells[_i + 2][_j + 2].style.backgroundColor = COLOR_MOVE;
                this.cells[_i + 2][_j - 2].style.backgroundColor = COLOR_MOVE;
                break;
        }
    }

    collision(_i, _j) {
        return this.boardArr[_i][_j] === "true";
    }

    isKingDark(_i, _j) {
        return this.boardArr[_i][_j] === "kingDark";
    }

    listenerLeftKingEat(_i, _j) {
        const to_i = _i + 2;
        const to_j = _j - 2;
        const died_i = _i + 1;
        const died_j = _j - 1;
        this.handlerLeftEatKing = () => this.moveEat(_i, _j, to_i, to_j, died_i, died_j);
        this.cells[to_i][to_j].addEventListener("click", this.handlerLeftEatKing);
        this.indexesLisLeftEatKing[0] = to_i;
        this.indexesLisLeftEatKing[1] = to_j;
    }
    removeLisLeftEatKing() {
        if (this.indexesLisLeftEatKing[0] !== null && this.indexesLisLeftEatKing[1] !== null && this.handlerLeftEatKing) {
            this.cells[this.indexesLisLeftEatKing[0]][this.indexesLisLeftEatKing[1]].removeEventListener("click", this.handlerLeftEatKing);
            this.handlerLeftEatKing = null;
        }
    }
    listenerRightKingEat(_i, _j) {
        const to_i = _i + 2;
        const to_j = _j + 2;
        const died_i = _i + 1;
        const died_j = _j + 1;
        this.handlerRightEatKing = () => this.moveEat(_i, _j, to_i, to_j, died_i, died_j);
        this.cells[to_i][to_j].addEventListener("click", this.handlerRightEatKing);
        this.indexesLisRightEatKing[0] = to_i;
        this.indexesLisRightEatKing[1] = to_j;
    }
    removeLisRightEatKing() {
        if (this.indexesLisRightEatKing[0] !== null && this.indexesLisRightEatKing[1] !== null && this.handlerRightEatKing) {
            this.cells[this.indexesLisRightEatKing[0]][this.indexesLisRightEatKing[1]].removeEventListener("click", this.handlerRightEatKing);
            this.handlerRightEatKing = null;
        }
    }


    MoveUp(_fromI, _fromJ) {
        if (this.isKingDark(_fromI, _fromJ) && _fromI < this.col) {
            // אכילות מלך
            if (this.checkEatOpponentLeftForKing(_fromI, _fromJ) && this.checkEatOpponentRightForKing(_fromI, _fromJ)) {
                console.log("king can eat in lr");
                this.direction = "lr_eat_king";
                this.drawCelForMove(_fromI, _fromJ);
                this.listenerLeftKingEat(_fromI, _fromJ);
                this.listenerRightKingEat(_fromI, _fromJ);
                return;
            }
            if (this.checkEatOpponentLeftForKing(_fromI, _fromJ)) {
                console.log("king can eat in l");
                this.direction = "l_eat_king";
                this.drawCelForMove(_fromI, _fromJ);
                this.listenerLeftKingEat(_fromI, _fromJ);
                return;
            }
            if (this.checkEatOpponentRightForKing(_fromI, _fromJ)) {
                console.log("king can eat in R");
                this.direction = "r_eat_king";
                this.drawCelForMove(_fromI, _fromJ);
                this.listenerRightKingEat(_fromI, _fromJ);
                return;

            }
            // תנועות מלך
            if (this.collision(_fromI + 1, _fromJ - 1)) {
                console.log("king can move L");
                this.direction = "l_king"
                this.drawCelForMove(_fromI, _fromJ);
                this.listinerLeftKing(_fromI, _fromJ);
            }
            if (this.collision(_fromI + 1, _fromJ + 1)) {
                console.log("king can move R");
                this.direction = "r_king"
                this.drawCelForMove(_fromI, _fromJ);
                this.listinerRightKing(_fromI, _fromJ);
            }
        }

        // אכילות
        if (this.checkEatOpponentLeft(_fromI, _fromJ) && this.checkEatOpponentRight(_fromI, _fromJ)) {
            console.log("eat in right right");
            this.direction = "lr_eat";
            this.drawCelForMove(_fromI, _fromJ);
            this.listenerLeftEat(_fromI, _fromJ);
            this.listenerRightEat(_fromI, _fromJ);
            return;
        }
        if (this.checkEatOpponentLeft(_fromI, _fromJ)) {
            console.log("eat in left");
            this.direction = "l_eat";
            this.drawCelForMove(_fromI, _fromJ);
            this.listenerLeftEat(_fromI, _fromJ);
            return;

        }
        else if (this.checkEatOpponentRight(_fromI, _fromJ)) {
            console.log("eat in right");
            this.direction = "r_eat";
            this.drawCelForMove(_fromI, _fromJ);
            this.listenerRightEat(_fromI, _fromJ);
            return;
        }
        // תנועה רגילה
        if (_fromI !== 0) {
            if (_fromI > 0) {
                if (this.collision(_fromI - 1, _fromJ - 1) && this.collision(_fromI - 1, _fromJ + 1)) {
                    console.log("rl");
                    this.direction = "lr";
                    this.drawCelForMove(_fromI, _fromJ);
                    this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1)
                    this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);
                    return;
                }
                else if (this.collision(_fromI - 1, _fromJ - 1)) {
                    console.log("L");
                    this.direction = "l";
                    this.drawCelForMove(_fromI, _fromJ);
                    this.leftListener(_fromI, _fromJ, _fromI - 1, _fromJ - 1);
                    return;
                }
                else if (this.collision(_fromI - 1, _fromJ + 1)) {
                    console.log("r");
                    this.direction = "r";
                    this.drawCelForMove(_fromI, _fromJ);
                    this.rightListener(_fromI, _fromJ, _fromI - 1, _fromJ + 1);
                    return;
                }
            }
        }
    }



    isKingRed(_i, _j) {
        return this.boardArr[_i][_j] === "kingRed";
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

    moveDown() {
        this.sound.stopMove();
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
                    if (this.isKingRed(fromI, fromJ) || toI === this.boardArr.length - 1) {
                        this.sound.king();
                        this.boardArr[toI][toJ] = "kingRed";
                    } else {
                        this.boardArr[toI][toJ] = "red";
                    }
                    
                    this.boardArr[fromI][fromJ] = "true";
                    this.boardArr[fromI + 1][fromJ - 1] = "true";
                    this.cells[fromI][fromJ].innerHTML = "";
                    this.cells[fromI + 1][fromJ - 1].innerHTML = "";
                    
                    this.counterDarkPawn--;
                    this.updaterDarkCounter();
                    this.render();
                    this.sound.playEting();
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
                    if (this.isKingRed(fromI, fromJ) || toI === this.boardArr.length - 1) {
                        this.boardArr[toI][toJ] = "kingRed";
                    } else {
                        this.boardArr[toI][toJ] = "red";
                    }
                    this.sound.playEting();

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
                    this.sound.stopAll();
                    this.sound.playMove();
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
        console.log("reder");
        const users = JSON.parse(localStorage.getItem("users")) || []; // טען או אתחל כמערך ריק
        if (users[this.indexUser]) {
            users[this.indexUser].dataGame = this.boardArr;
        } else {
            console.error("User not found in localStorage"); // בדוק שאין שגיאות
        }
        localStorage.setItem("users", JSON.stringify(users)); // שמור מחדש בלי מחיקה
        // const users = JSON.parse(localStorage.getItem("users"));
        // users[this.indexUser].dataGame = this.boardArr;
        // localStorage.removeItem("users");

        // localStorage.setItem("users", JSON.stringify(users));



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

                // this.removeRightListener();
                // this.removeLeftListener();
                if (this.myTimer === 1) {

                    if (this.boardArr[i][j] === "dark" || this.boardArr[i][j] === "kingDark") {
                        this.cells[i][j].firstElementChild.addEventListener("click", () => {
                            console.log("click:   i:" + i + ", j: " + j);
                            console.log("counter red: " + this.counterRedPawn);
                            console.log("counter my: " + this.counterDarkPawn);

                            this.sound.playClick();
                            this.resetBoard();
                            this.removeRightListener();
                            this.removeLeftListener();
                            this.removeLeftListenerEat();
                            this.removeRightListenerEat();
                            this.removeLisLeftEatKing();
                            this.removeLisRightEatKing();
                            this.cells[i][j].style.border = "2px solid white";
                            this.cells[i][j].style.borderRadius = "5px"
                            this.MoveUp(i, j);
                        });
                    }
                }
            }
        }
    }
}