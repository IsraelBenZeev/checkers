const board = document.querySelector(".board");
const game = new Board(".board", 8, 8);
// drawBord.fillArr();

game.drawBoard();
// drawBord.render();
// drawBord.updaterRedCounter();
// drawBord.updaterDarkCounter();

let second = 0;
let minute = 0;
const startTimer = () => {
    const timerGame = setInterval(() => {
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
    window.location.href = "index.html"
};
const restart = () => {
    window.location.reload()
};
const hamburger = document.querySelector(".hamburger");
const buttons2 = document.querySelector(".buttons2");
const yourAccount = ()=>{
    const existingResults = document.querySelector(".yourResults");
    if (existingResults) {
        return; // אם החלון קיים, צא מהפונקציה
    }
    const users = JSON.parse(localStorage.getItem("users"));
    const currentUser = users[game.storage.indexUser];
    const youruserName = currentUser.username;
    const yourMail = currentUser.mail;
    const yourWinns = currentUser.wins;
    const yourLosses = currentUser.losses;
    const yourGames = currentUser.games;
    const results = document.createElement("div");
    results.className = "yourResults";
    const divName = document.createElement("div");
    divName.textContent = "name: "+youruserName;
    const divGames = document.createElement("div");
    divGames.textContent = "games: "+yourGames;
    const divWins = document.createElement("div");
    divWins.textContent ="winss: "+ yourWinns;
    const divLoses = document.createElement("div");
    divLoses.textContent = "lose: "+yourLosses;
    results.append(divName, divGames, divWins, divLoses);
    const container = document.querySelector(".container");

    container.appendChild(results);
    console.log(youruserName +", "+yourMail+", "+yourWinns+".");
    buttons2.style.display = "none";
    hamburger.style.display = "flex";
    document.querySelector(".container").style.opacity = "100%"
    const back = document.createElement("button");
    back.textContent = "close";
    back.className = "closeAccount";
    back.addEventListener("click", ()=>{
        results. className = "hide";
    });
    results.appendChild(back);
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



const clearLocalStore = () => {
    console.log("מתחיל איפוס משחק");
    resetData();
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = localStorage.getItem("currentUser");
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].username === currentUser) {
            usersData[i].dataGame = newData;
            usersData[i].pawnDied[0] = 12;
            usersData[i].pawnDied[1] = 12;
            console.log("עודכנו נתונים למשתמש:", currentUser, newData);
        }
    }
    localStorage.setItem("users", JSON.stringify(usersData));
    window.location.reload();
    // drawBord.render(); 

};

const close = document.querySelector(".close");
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