const board = document.querySelector(".board");
const drawBord = new Board(".board", 8,8);
    drawBord.fillArr();

drawBord.drawBoard();
drawBord.render();
drawBord.updaterRedCounter();
const home = () => {
    window.location.href="landing page.html"
};
const restart = ()=>{
    window.location.reload()
};
const clearLocalStore = ()=>{
    localStorage.clear();
};


const hamburger = document.querySelector(".hamburger");
const close = document.querySelector(".close");
const buttons2 = document.querySelector(".buttons2");
hamburger.addEventListener("click",()=>{
    buttons2.style.display = "flex";
    hamburger.style.display = "none"
})
close.addEventListener("click", ()=>{
    buttons2.style.display = "none";
    hamburger.style.display = "flex";

})
// drawBord.moveDownLeft(); 


// const pawnsDed = document.querySelector(".pawns-ded");
// pawnsDed.innerHTML = "סך הכל חיילים אדומים: <br>"+drawBord.counterRedPawn;
const name = document.querySelector(".name");
name.textContent = "user name:" + localStorage.getItem("username");