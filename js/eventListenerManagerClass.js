class EventListenerManager {
    constructor(_cells, _boardArr, _board) {
        this.cells = _cells;
        this.boardArr = _boardArr;
        this.board = _board;
        this.move = null;
        this.opponent = null;
        this.initMove();
        this.listenersMoves = [];
        this.listenersEat = [];
        this.handler = null;
        this.initOpponent();
        // מערך חדש לשמירת המאזינים והפונקציות שלהם
        this.handlers = [];
    }
    async initMove() {
        try {
            const MoveModule = await import('./moveClass.js');
            this.move = new MoveModule.default(this.boardArr, this.cells, this.board);
        } catch (error) {
            console.error("Could not load move module:", error);
        }
    }
    async initOpponent() {
        try {

            const OpponentModule = await import('./opponentClass.js');
            this.opponent = new OpponentModule.default(this.boardArr, this.cells, this.board);
        } catch (error) {
            console.error("Could not load opponent module:", error);
        }
    }

    addListener(_i, _j, _cells, _directions, _boardAr) {
        // בדיקת אתחול
        if (!this.opponent) {
            console.error("Opponent not initialized!");
            return;
        }

        this.cells = _cells;
        this.boardArr = _boardAr;

        // קבלת כל הכיוונים האפשריים
        this.returnDirectionForLIstiner(_cells, _directions, _i, _j);

        // טיפול במהלכי תזוזה
        for (const move of this.listenersMoves) {
            const handler = () => {
                console.log("Move clicked at:", "I:", move.i, "J:", move.j);
                console.log("From position:", "I:", _i, "J:", _j);

                this.move.movePawn(_i, _j, move.i, move.j, this.boardArr, this.cells);
                this.removeListiners(_cells);

                console.log("Starting computer's turn");
                this.board.resetBoard();
                this.opponent.moveDown(this.boardArr, this.cells);
            };

            this.handlers.push({
                element: this.cells[move.i][move.j],
                handlerFunction: handler
            });
            this.cells[move.i][move.j].addEventListener("click", handler);
        }

        // טיפול במהלכי אכילה
        for (const eat of this.listenersEat) {
            const handler = () => {
                console.log("Eat move clicked at:", "I:", eat.i, "J:", eat.j);
                const diedI = (_i + eat.i) / 2;
                const diedJ = (_j + eat.j) / 2;
                this.move.moveEat(_i, _j, eat.i, eat.j, diedI, diedJ, this.boardArr, this.cells);
                this.removeListiners(_cells);
                this.board.resetBoard();
                this.opponent.moveDown(this.boardArr, this.cells);
            };

            this.handlers.push({
                element: this.cells[eat.i][eat.j],
                handlerFunction: handler
            });
            this.cells[eat.i][eat.j].addEventListener("click", handler);
        }
    }
    removeListiners(_cells) {
        this.cells = _cells;
        this.handlers.forEach(handlerInfo => {
            handlerInfo.element.removeEventListener("click", handlerInfo.handlerFunction);
        });
        this.handlers = [];
        this.listenersMoves = [];
        this.listenersEat = [];
    }
    returnDirectionForLIstiner(_cells, _directions, _i, _j) {
        this.removeListiners(_cells);

        let listener;
        console.log("I: " + _i + ", J: " + _j);
        for (let i = 0; i < _directions.length; i++) {
            switch (_directions[i]) {
                case "r":
                    listener = {
                        i: _i - 1,
                        j: _j + 1
                    };
                    this.listenersMoves.push(listener);
                    break;
                case "l":
                    listener = {
                        i: _i - 1,
                        j: _j - 1
                    };
                    this.listenersMoves.push(listener);
                    break;
                case "r_down":
                    listener = {
                        i: _i + 1,
                        j: _j + 1
                    };
                    this.listenersMoves.push(listener);
                    break;
                case "l_down":
                    listener = {
                        i: _i + 1,
                        j: _j - 1
                    };
                    this.listenersMoves.push(listener);
                    break;
                case "r_eat":
                    listener = {
                        i: _i - 2,
                        j: _j + 2
                    };
                    this.listenersEat.push(listener);
                    break;
                case "l_eat":
                    listener = {
                        i: _i - 2,
                        j: _j - 2
                    };
                    this.listenersEat.push(listener);
                    break;
                case "r_eat_down":
                    listener = {
                        i: _i + 2,
                        j: _j + 2
                    };
                    this.listenersEat.push(listener);
                    break;
                case "l_eat_down":
                    listener = {
                        i: _i + 2,
                        j: _j - 2
                    };
                    this.listenersEat.push(listener);
                    break;
            }
        }
        console.log("ddddddddddd: " + _directions);
    }
}
export default EventListenerManager;