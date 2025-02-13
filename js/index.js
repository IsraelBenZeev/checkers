const board = document.querySelector(".board");
const drawBord = new Board(".board", 8, 8);
drawBord.fillArr();

drawBord.drawBoard();
drawBord.render();
drawBord.updaterRedCounter();
let second = 0;
let minute = 0;
const startTimer = () => {
    this.timerGame = setInterval(() => {
        second++;
        if (second === 60) {
            second = 0;
            minute++;
        }
        const timer = document.querySelector(".timer");
        timer.textContent = "Timer: " + String(minute).padStart(2, '0') + ":" + String(second).padStart(2, '0');
    }, 1000);
}
startTimer();
const home = () => {
    window.location.href = "landing page.html"
};
const restart = () => {
    window.location.reload()
};
const newData = new Array(8).fill().map(() => Array(8).fill(null));
const resetData = () => {
    for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < newData[i].length; j++) {
            if ((j + i) % 2 == 0) {
                if (i <= 2) newData[i][j] = "red";
                else if (i >= 5) newData[i][j] = "dark";
                else if (i > 2 && i < 5) newData[i][j] = "true"
            }
        }
    }
}
resetData();

const clearLocalStore = () => {
    console.log("מתחיל איפוס משחק");
    
    resetData();
    
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = localStorage.getItem("currentUser");
    
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].username === currentUser) {
            usersData[i].dataGame = newData;
            console.log("עודכנו נתונים למשתמש:", currentUser, newData);
        }
    }
    localStorage.setItem("users", JSON.stringify(usersData));
    window.location.reload();
    // drawBord.render(); 

};

const hamburger = document.querySelector(".hamburger");
const close = document.querySelector(".close");
const buttons2 = document.querySelector(".buttons2");
hamburger.addEventListener("click", () => {
    buttons2.style.display = "flex";
    hamburger.style.display = "none"
    document.querySelector(".container").style.opacity = "40%"
})
close.addEventListener("click", () => {
    buttons2.style.display = "none";
    hamburger.style.display = "flex";
    document.querySelector(".container").style.opacity = "100%"
})
// drawBord.moveDownLeft(); 


// const pawnsDed = document.querySelector(".pawns-ded");
// pawnsDed.innerHTML = "סך הכל חיילים אדומים: <br>"+drawBord.counterRedPawn;
const name = document.querySelector(".name");
name.textContent = "user name:" + localStorage.getItem("currentUser");