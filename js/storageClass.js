class Storage {
    constructor() {
        this.indexUser = this.returnIndexOfCurrentUser();
        this.counterDarkPawn = this.returnCounterDark();
        this.counterRedPawn = this.returnCounterRed();
        
        console.log("counterDarkPawn: " + this.counterDarkPawn);
        console.log("counterRedPawn: " + this.counterRedPawn);


    }
    returnIndexOfCurrentUser() {
        const usersData = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = localStorage.getItem("currentUser");
        for (let i = 0; i < usersData.length; i++) {
            if (usersData[i].username === currentUser) {
                return i;
            }
        }
        return -1;
    }

    returnCounterDark() {
        const users = JSON.parse(localStorage.getItem("users"));
        const counterDark = users[this.indexUser].pawnDied[0];
        console.log("counterDark in start game: " + counterDark);
        return counterDark;
    }
    returnCounterRed() {
        const users = JSON.parse(localStorage.getItem("users"));
        const counterRed = users[this.indexUser].pawnDied[1];
        console.log("counterRed in start game: " + counterRed);
        return counterRed;
    }

    updeteDataGameInLocalStor(boardArr) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users[this.indexUser]) {
            users[this.indexUser].dataGame = boardArr;
        } else {
            console.error("User not found in localStorage");
        }
        localStorage.setItem("users", JSON.stringify(users));
    }

    updaterRedCounter() {
        console.log("counterRedPawn after eat: " + this.counterRedPawn);
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[this.indexUser].pawnDied[1] = this.counterRedPawn;
        localStorage.setItem("users", JSON.stringify(users));

        const pawnsDed = document.querySelector(".pawns-red-ded");
        pawnsDed.style.direction = "rtl";
        pawnsDed.innerHTML = "";
        const counterRed = users[this.indexUser].pawnDied[0];
        for (let i = 0; i < 12 - this.counterRedPawn; i++) {
            pawnsDed.innerHTML += `<img src="./files/light.png" style="width: 30px;  margin: 2px 0">`;
        }
    }

    updaterDarkCounter() {
        console.log("counterDarkPawn after eat: " + this.counterDarkPawn);
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[this.indexUser].pawnDied[0] = this.counterDarkPawn;
        localStorage.setItem("users", JSON.stringify(users));

        const pawnsDed = document.querySelector(".pawns-dark-ded");
        pawnsDed.style.direction = "rtl";
        pawnsDed.innerHTML = "";

        for (let i = 0; i < 12 - this.counterDarkPawn; i++) {
            pawnsDed.innerHTML += `<img src="./files/dark.png" style="width: 30px; margin: 2px 0">`;
        }
    }

    decrementCounterRed(){
        console.log("enter to counter red");
        
        this.counterRedPawn -= 1;
        this.updaterRedCounter();
    }
    decrementCounterDark(){
        console.log("enter to decrementCounterDark");
        
        this.counterDarkPawn -= 1;
        this.updaterDarkCounter();
    }

}
export default Storage;