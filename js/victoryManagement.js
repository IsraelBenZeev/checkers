export const windowVictory = () => {
    console.log("instrction entered");
    const victory = document.createElement("div");
    victory.className = "victory";
    const container = document.querySelector(".container");
    container.appendChild(victory);
    const board = document.querySelector(".board");
    board.style.display = "none";

    const colors = ['#FFD700', '#FF6347', '#32CD32', '#00BFFF', '#FF1493'];
    for (let i = 0; i < 50; i++) {
        const fireworks = document.createElement("div");
        fireworks.className = "fireworks";

        fireworks.style.top = `${Math.random() * 80}%`;
        fireworks.style.left = `${Math.random() * 80}%`;
        // בחירת גודל אקראי בין 1 ל-5
        const size = Math.random() * 15 + 5; // גודל אקראי בין 1 ל-5
        fireworks.style.width = `${size}px`;
        fireworks.style.height = `${size}px`;
        // זמן השהייה אקראי בין 0 ל-2 שניות
        const delay = Math.random() * 2; // זמן השהייה
        fireworks.style.animationDelay = `${delay}s`;
        fireworks.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        victory.appendChild(fireworks);
    }
    document.querySelector(".pawns-dark-ded").style.display = "none";
    document.querySelector(".pawns-red-ded").style.display = "none";
    document.querySelector(".hamburger").style.display = "none";
    document.querySelector(".buttons2").style.display = "none";
    victory.style.opacity = "1.0";
    const title = document.createElement("div");
    title.textContent = "YOU WINNER!!!!"
    victory.appendChild(title);

    const backHome = document.createElement("button");
    backHome.textContent = "go home";
    const playAgain = document.createElement("button");
    playAgain.textContent = "play again"
    victory.append(backHome, playAgain);
    backHome.addEventListener("click", ()=>{
        window.location.href = "./index.html";
    });
    playAgain.addEventListener("click", ()=>{

    });


}
