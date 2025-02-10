const board = document.querySelector(".board");
const drawBord = new Board(".board", 8,8);
    drawBord.fillArr();

drawBord.drawBoard();
drawBord.render();
drawBord.updaterRedCounter();
const buttons = document.querySelectorAll("button");
const home = buttons[0];
const restart = buttons[1];
home.addEventListener("click", () => {
    window.location.href="landing page.html"
});
restart.addEventListener("click", ()=>{
    window.location.reload()
})
const name = document.querySelector(".name");
name.textContent = "user name:" + localStorage.getItem("username");
const clear = document.querySelector(".clear");
clear.addEventListener("click", ()=>{
    localStorage.clear();
})
// drawBord.moveDownLeft(); 


// const pawnsDed = document.querySelector(".pawns-ded");
// pawnsDed.innerHTML = "סך הכל חיילים אדומים: <br>"+drawBord.counterRedPawn;
