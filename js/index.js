const board = document.querySelector(".board");
const drawBord = new Board(".board", 8,8);
drawBord.fillArr();
drawBord.drawBoard();
drawBord.render();