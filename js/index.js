const board = document.querySelector(".board");
const drawBord = new Board(".board", 8,8);
drawBord.fillArr();
drawBord.drawBoard();
drawBord.render();
drawBord.updaterRedCounter();
// drawBord.moveDown(); 
// const pawnsDed = document.querySelector(".pawns-ded");
// pawnsDed.innerHTML = "סך הכל חיילים אדומים: <br>"+drawBord.counterRedPawn;
