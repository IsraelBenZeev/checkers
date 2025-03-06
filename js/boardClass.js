const COLOR_BOARD_DARK = "rgb(41, 88, 108)";
const COLOR_MOVE = "rgb(10, 163, 229)";

class Board {
    constructor(_parent, _row, _col) {
        this.parent = _parent;
        this.row = _row;
        this.col = _col;
        this.cells = Array(this.row).fill().map(() => Array(this.col).fill(null));
        this.boardArr = Array(this.row).fill().map(() => Array(this.col).fill(null));

        this.pawnClickHandler = null;
        this.storage = null;
        this.initTurnsManagement().then(() => this.initStorage()).then(() => {
            console.log("boardArr: " + this.boardArr);
            console.log("fill arr");
            this.fillArr();
            console.log("boardArr aftere fil arr: " + this.boardArr);
            this.render(this.boardArr, this.cells);
            this.storage.updaterDarkCounter();
            this.storage.updaterRedCounter();
        });

        this.direction = null;
        this.myTimer = 1;
        this.computerDelay = 300;
        this.turnsManagement = null;
        this.initTurnsManagement();
        this.sound = null;
        this.initSound();
        this.moveChecker = null;
        this.initMoveChecker();
        this.draw = null;
        this.initDraw();
        this.eventListenerManager = null;
        this.initEventListenerManager();
        this.move = null;
        this.initMove();
    }

    async initSound() {
        try {
            const SoundModule = await import('./soundClass.js');
            this.sound = new SoundModule.default("./files/sounds/click.wav", "./files/sounds/eat.mp3", "./files/sounds/move2.mp3", "./files/sounds/king.wav");
        } catch (error) {
            console.error("Could not load sound module:", error);
        }
    }
    async initStorage() {
        try {
            const StorageModule = await import('./storageClass.js');
            this.storage = new StorageModule.default();
        } catch (error) {
            console.error("Could not load storage module:", error);
        }
    }
    async initMoveChecker() {
        try {
            const MoveCheckerModule = await import('./moveChecker.js')
            this.moveChecker = new MoveCheckerModule.default(this.boardArr);
        } catch (error) {
            console.error("Could not load moveCheker module:", error);
        }
    }

    async initDraw() {
        try {
            const DrawModule = await import('./drawClass.js');
            this.draw = new DrawModule.default(this.cells);
        } catch (error) {
            console.error("Could not load draw module:", error);
        }
    }
    async initEventListenerManager() {
        try {
            const EventListenerManagerModule = await import('./eventListenerManagerClass.js');
            this.eventListenerManager = new EventListenerManagerModule.default(this.cells, this.boardArr, this);
        } catch (error) {
            console.error("Could not load EventListenerManager module:", error);
        }
    }
    async initMove() {
        try {
            const MoveModule = await import('./moveClass.js');
            this.move = new MoveModule.default(this.boardArr, this.cells, this);
        } catch (error) {
            console.error("Could not load move module:", error);
        }
    }
    async initTurnsManagement() {
        try {
            const TurnsManagementModule = await import('./turnsManagementClass.js');
            this.turnsManagement = new TurnsManagementModule.default("you");
        } catch (error) {
            console.error("Could not load TurnsManagement module:", error);
        }
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

    fillArr() {
        const usersData = JSON.parse(localStorage.getItem("users"));
        console.log("user:" + usersData[this.storage.indexUser].username);
        console.log("data:" + usersData[this.storage.indexUser].dataGame);
        this.boardArr = usersData[this.storage.indexUser].dataGame;
    }
    victory() {
        if (this.counterRedPawn === 0) {
            this.resetBoard();
            // this.updeteDataGameInLocalStor();
            // this.updetePawnDiedInLocalStor();

            setTimeout(() => {
                console.log("you won!!!!!!!!!!");
                window.location.href = "./victory.html";
            }, 1500)
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

    render(_boardAr, _cells) {
        console.log("enter to reder");
        this.boardArr = _boardAr;
        this.cells = _cells;
        this.storage.updeteDataGameInLocalStor(this.boardArr);
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

                if (this.boardArr[i][j] === "dark" || this.boardArr[i][j] === "kingDark") {
                    const pawnElement = this.cells[i][j].firstElementChild;

                    pawnElement.removeEventListener("click", this.pawnClickHandler);

                    this.pawnClickHandler = () => {
                        if (this.turnsManagement.returnTurnYou()) {
                            console.log("turn in first: " + this.turnsManagement.turn);
                            console.log("click:   i:" + i + ", j: " + j);
                            console.log("counter red: " + this.counterRedPawn);
                            console.log("counter my: " + this.storage.counterDarkPawn);

                            this.sound.playClick();
                            this.resetBoard();
                            this.cells[i][j].style.border = "2px solid white";
                            this.cells[i][j].style.borderRadius = "5px"
                            const directions = this.moveChecker.whereCanMove(i, j, this.boardArr);
                            this.draw.drawCelForMove(i, j, directions);
                            this.eventListenerManager.addListener(i, j, this.cells, directions, this.boardArr);
                            // this.turnsManagement.turn = "opponent";
                        }
                    };
                    pawnElement.addEventListener("click", this.pawnClickHandler);
                }
            }
        }
    }
}
