class Draw {
    constructor(_cells) {
        this.cells = _cells;
    }
    drawCelForMove(_i, _j, _directions) {
        // console.log("direction:" + direction);
        const COLOR_MOVE = "rgb(10, 163, 229)";
        if (_directions) {
            console.log("Directions array:", _directions);
            for (let i = 0; i < _directions.length; i++) {
                switch (_directions[i]) {
                    case "l":
                        this.cells[_i - 1][_j - 1].style.backgroundColor = COLOR_MOVE;
                        break;
                    case "r":
                        this.cells[_i - 1][_j + 1].style.backgroundColor = COLOR_MOVE;
                        break;
                    case "l_down":
                        this.cells[_i + 1][_j - 1].style.backgroundColor = COLOR_MOVE;
                        break;
                    case "r_down":
                        this.cells[_i + 1][_j + 1].style.backgroundColor = COLOR_MOVE;
                        break;
                    case "l_eat":
                        this.cells[_i - 2][_j - 2].style.backgroundColor = COLOR_MOVE;
                        break;
                    case "r_eat":
                        this.cells[_i - 2][_j + 2].style.backgroundColor = COLOR_MOVE;
                        break;
                    case "l_eat_down":
                        this.cells[_i + 2][_j - 2].style.backgroundColor = COLOR_MOVE;
                        break;
                    case "r_eat_down":
                        this.cells[_i + 2][_j + 2].style.backgroundColor = COLOR_MOVE;
                        break;
                }

            }
        }

    }
}
export default Draw;