// class Board {
//     constructor(_parent, _row, _col) {
//         this.parent = _parent;
//         this.row = _row;
//         this.col = _col;
//         this.boardArr = Array(this.row).fill().map(() => Array(this.col).fill(null));
//         this.selectedCell = null;
//     }

//     render() {
//         document.querySelector(this.parent).innerHTML = "";
        
//         for (let i = 0; i < this.row; i++) {
//             for (let j = 0; j < this.col; j++) {
//                 let cel = document.createElement("div");
//                 cel.classList = "cell";
                
//                 if ((i + j) % 2 == 0) {
//                     cel.classList = "cell cell-dark";
                    
//                     // הוספת כלים לפי המיקום
//                     if (i <= 2) {
//                         this.boardArr[i][j] = 'red';
//                         let pawnRed = document.createElement("img");
//                         pawnRed.src = "../files/pawn-red.png";
//                         pawnRed.alt = "pawn light";
//                         pawnRed.classList = "pawn pawn-light";
//                         cel.appendChild(pawnRed);
//                     }
//                     else if (i >= 5) {
//                         this.boardArr[i][j] = 'dark';
//                         let pawnDark = document.createElement("img");
//                         pawnDark.src = "../files/pawn-dark.png";
//                         pawnDark.alt = "pawn dark";
//                         pawnDark.classList = "pawn pawn-dark";
//                         cel.appendChild(pawnDark);
//                     }

//                     cel.addEventListener("click", () => {
//                         this.handleCellClick(i, j, cel);
//                     });
//                 }
//                 else {
//                     cel.classList = "cell cell-light";
//                 }
                
//                 document.querySelector(this.parent).appendChild(cel);
//             }
//         }
//     }

//     handleCellClick(i, j, cel) {
//         if (this.selectedCell) {
//             // בדיקה אם התזוזה חוקית
//             if (this.isValidMove(this.selectedCell, {i, j})) {
//                 // העברת הכלי
//                 this.movePiece(this.selectedCell, {i, j});
//                 this.selectedCell = null;
//                 document.querySelectorAll('.cell-selected').forEach(cell => {
//                     cell.classList.remove('cell-selected');
//                 });
//             }
//         }
//         else if (this.boardArr[i][j]) {
//             this.selectedCell = {i, j};
//             cel.classList.add('cell-selected');
//         }
//     }

//     isValidMove(from, to) {
//         // בדיקת תזוזה באלכסון
//         return Math.abs(from.i - to.i) === 1 && Math.abs(from.j - to.j) === 1;
//     }

//     movePiece(from, to) {
//         // העברת הכלי במערך
//         this.boardArr[to.i][to.j] = this.boardArr[from.i][from.j];
//         this.boardArr[from.i][from.j] = null;
//         // רינדור מחדש של הלוח
//         this.render();
//     }
// }