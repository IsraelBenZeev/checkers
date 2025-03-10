// import { openBoard } from "./log-in.js";
const container = document.querySelector(".containerBoard");
const hamburger = document.querySelector(".hamburger");
const board = document.querySelector(".board");
const buttons2 = document.querySelector(".buttons2");
const close = document.querySelector(".close");
const openNavBarEndClose = ()=>{
    hamburger.addEventListener("click", () => {
        buttons2.style.display = "flex";
        hamburger.style.display = "none"
        board.style.opacity = "40%"
    })
    close.addEventListener("click", () => {
        buttons2.style.display = "none";
        hamburger.style.display = "flex";
        board.style.opacity = "100%"
        document.querySelector(".containerBoard").style.opacity = "100%"
    });
};
const drawName = ()=>{
    const name = document.querySelector(".name");
    name.textContent = "user name:" + localStorage.getItem("currentUser");
}
let timerGame;//= 0;
const drawTimer = ()=>{
    let second = 0;
    let minute = 0;
    if (timerGame) clearInterval(timerGame);
    timerGame = setInterval(() => {
        second++;
        if (second === 60) {
            second = 0;
            minute++;
        }
        const timer = document.querySelector(".timer");
        timer.textContent = "Timer: " + String(minute).padStart(2, '0') + ":" + String(second).padStart(2, '0');
    }, 1000);
}
const restartTimer = ()=>{
    clearInterval(timerGame);
    drawTimer();
}
const goHome = () => {
    window.location.href = "index.html"
};

const returnIndexOfCurrentUser = ()=> {
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = localStorage.getItem("currentUser");
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].username === currentUser) {
            return i;
        }
    }
    return -1;
}
const yourAccount = () => {
    const existingResults = document.querySelector(".yourResults");
    if (existingResults) {
        return; 
    }
    const users = JSON.parse(localStorage.getItem("users"));
    const indexUser = returnIndexOfCurrentUser();
    const currentUser = users[indexUser];
    console.log("index: "+window.Storage.indexUser);
    const youruserName = currentUser.username;
    const yourMail = currentUser.mail;
    const yourWinns = currentUser.wins;
    const yourLosses = currentUser.losses;
    const yourGames = currentUser.games;
    const results = document.createElement("div");
    results.className = "yourResults";
    const divName = document.createElement("div");
    divName.textContent = "name: " + youruserName;
    const divGames = document.createElement("div");
    divGames.textContent = "games: " + yourGames;
    const divWins = document.createElement("div");
    divWins.textContent = "winss: " + yourWinns;
    const divLoses = document.createElement("div");
    divLoses.textContent = "lose: " + yourLosses;
    results.append(divName, divGames, divWins, divLoses);
    const container = document.querySelector(".containerBoard");
    container.appendChild(results);
    console.log(youruserName + ", " + yourMail + ", " + yourWinns + ".");
    board.style.opacity = "0.3";
    buttons2.style.display = "none";
    // hamburger.style.display = "flex";
    document.querySelector(".containerBoard").style.opacity = "100%"
    const back = document.createElement("button");
    back.textContent = "close";
    back.className = "closeAccount";
    back.addEventListener("click", () => {
        results.className = "hide";
        board.style.opacity = "1";
        if (window.innerWidth < 681) {
            hamburger.style.display = "flex";
        }
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
            // console.log("עודכנו נתונים למשתמש:", currentUser, newData);
        }
    }
    localStorage.setItem("users", JSON.stringify(usersData));
    // window.location.reload();
};
openNavBarEndClose();
drawName();
drawTimer();
const goHome_btn = document.querySelectorAll("#goHome");
const yourAccount_btn = document.querySelectorAll("#yourAccount");
const instractions_btn = document.querySelectorAll("#instractions");
const boardResults_btn = document.querySelectorAll("#boardResult");
const restart_btn = document.querySelectorAll("#restart");

goHome_btn[0].addEventListener("click", goHome);
goHome_btn[1].addEventListener("click", goHome);
yourAccount_btn[0].addEventListener("click", yourAccount);
yourAccount_btn[1].addEventListener("click", yourAccount);
restart_btn[0].addEventListener("click",  ()=>{
    window.gameInstance.resetGame();
    restartTimer();
});
restart_btn[1].addEventListener("click",  ()=>{
    window.gameInstance.resetGame();
    restartTimer();
});

