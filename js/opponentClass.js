class Opponent {
    constructor(_boardArr, _cells, _board, _storage) {
        this.boardArr = _boardArr;
        this.cells = _cells;
        this.board = _board;
        this.storage = _storage;
    }
    windowVictory = () => {
        console.log("instrction entered");
        const victory = document.createElement("div");
        victory.className = "victory";
        const container = document.querySelector(".container");
        container.appendChild(victory);
        const board = document.querySelector(".board");
        board.style.display = "none";

        const colors = ['#FFD700', '#FF6347', '#32CD32', '#00BFFF', '#FF1493'];
        for (let i = 0; i < 20; i++) {
            const fireworks = document.createElement("div");
            fireworks.className = "fireworks";

            fireworks.style.top = `${Math.random() * 80}%`;
            fireworks.style.left = `${Math.random() * 80}%`;
            // בחירת גודל אקראי בין 1 ל-5
            const size = Math.random() * 15 + 5; // גודל אקראי בין 1 ל-5
            fireworks.style.width = `${size}px`;
            fireworks.style.height = `${size}px`;
            // זמן השהייה אקראי בין 0 ל-2 שניות
            const delay = Math.random() * 2; // זמן השהייה
            fireworks.style.animationDelay = `${delay}s`;
            fireworks.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            victory.appendChild(fireworks);
        }
        const title = document.createElement("div");
        title.textContent = "YOU WINNER!!!!"
        victory.appendChild(title);

        const backHome = document.createElement("button");
        backHome.textContent = "go home";
        const playAgain = document.createElement("button");
        playAgain.textContent = "play again"
        victory.append(backHome, playAgain);
        backHome.addEventListener("click", () => {
            window.location.href = "./index.html";
        });
        playAgain.addEventListener("click", () => {
            // board.storage
        });


    }


    isKingDark(_i, _j) {
        return this.boardArr[_i][_j] === "kingDark";
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
    moveDown(_boardArr, _cells) {
        this.boardArr = _boardArr;
        this.cells = _cells;
        // this.sound.stopMove();
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
                console.log("יש אכילה בשמאל");

                const fromI = currentPawn.i;
                const fromJ = currentPawn.j;
                const toI = fromI + 2;
                const toJ = fromJ - 2;

                setTimeout(() => {
                    if (this.isKingRed(fromI, fromJ) || toI === this.boardArr.length - 1) {
                        if (!(this.isKingRed(fromI, fromJ)) && toI === this.boardArr.length - 1) this.board.sound.playKing()
                        this.boardArr[toI][toJ] = "kingRed";

                    } else {
                        this.boardArr[toI][toJ] = "red";
                        this.board.sound.playEating();
                    }

                    this.boardArr[fromI][fromJ] = "true";
                    this.boardArr[fromI + 1][fromJ - 1] = "true";
                    this.cells[fromI][fromJ].innerHTML = "";
                    this.cells[fromI + 1][fromJ - 1].innerHTML = "";

                    this.board.sound.playEating()

                    if (this.storage) this.storage.decrementCounterDark();
                    else console.log("המחלקה עוד לא נוצרה");

                    this.board.turnsManagement.changeTurn("you");

                    this.board.render(this.boardArr, this.cells);
                }, 1000);

                return;
            }
            else if (this.isRedCanEatRight(currentPawn.i, currentPawn.j)) {
                console.log("יש אכילה בימין");
                const fromI = currentPawn.i;
                const fromJ = currentPawn.j;
                const toI = fromI + 2;
                const toJ = fromJ + 2;

                setTimeout(() => {
                    if (this.isKingRed(fromI, fromJ) || toI === this.boardArr.length - 1) {
                        if (!(this.isKingRed(fromI, fromJ)) && toI === this.boardArr.length - 1) {
                            this.board.sound.playKing();
                        }
                        this.boardArr[toI][toJ] = "kingRed";
                    } else {
                        this.boardArr[toI][toJ] = "red";
                        this.board.sound.playEating();
                    }
                    this.boardArr[fromI][fromJ] = "true";
                    this.boardArr[fromI + 1][fromJ + 1] = "true";
                    this.cells[fromI][fromJ].innerHTML = "";
                    this.cells[fromI + 1][fromJ + 1].innerHTML = "";

                    if (this.storage) this.storage.decrementCounterDark();
                    else console.log("המחלקה עוד לא נוצרה");
                    this.board.turnsManagement.changeTurn("you");

                    this.board.render(this.boardArr, this.cells);
                }, 1000);
                return;
            }
        }
        const kingMoved = this.moveKingRedUp(this.boardArr, this.cells);
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
            this.board.victory();
            console.log("אין לאן לזוז");
            this.board.turnsManagement.changeTurn("you");
            const users = JSON.parse(localStorage.getItem("users"));
            users[this.board.storage.indexUser].wins++;
            users[this.board.storage.indexUser].games++;
            localStorage.setItem("users", JSON.stringify(users));
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
                    if ((!this.isKingRed(fromI, fromJ)) && fromI + 1 === this.boardArr.length - 1) {
                        this.board.sound.playKing();
                    }

                } else {
                    this.boardArr[fromI + 1][fromJ - 1] = "red";
                    this.board.sound.playMove();
                }
                this.board.turnsManagement.changeTurn("you");
                this.board.render(this.boardArr, this.cells);
            }, 1000);
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
                    if ((!this.isKingRed(fromI, fromJ)) && fromI + 1 === this.boardArr.length - 1) {
                        this.board.sound.playKing();
                    }
                } else {
                    this.boardArr[fromI + 1][fromJ + 1] = "red";
                    this.board.sound.playMove();
                }
                this.board.turnsManagement.changeTurn("you");
                this.board.render(this.boardArr, this.cells);

            }, 1000);
            return;
        }

    }

    moveKingRedUp(_boardArr, _cells) {
        this.boardArr = _boardArr;
        this.cells = _cells;
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
        let existKings = kingsCanMove.length > 0;

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

                this.board.sound.playEating();

                this.board.render(this.boardArr, this.cells);

                this.board.turnsManagement.changeTurn("you");
                // this.myTimer = 1;
            }, 1000);
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

                this.board.turnsManagement.changeTurn("you");

                this.board.sound.playEating();

                this.board.render(this.boardArr, this.cells);
                // this.myTimer = 1;
            }, 1000);
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

                this.board.turnsManagement.changeTurn("you");
                this.board.render(this.boardArr, this.cells);
            }, 1000);
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

                this.board.turnsManagement.changeTurn("you");
                this.board.render(this.boardArr, this.cells);
            }, 1000);
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

}
export default Opponent;