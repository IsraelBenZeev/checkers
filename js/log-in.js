let name_val, mail_val, mailAgain_val, password_val;
const container = document.querySelector(".container");


const login = document.querySelector(".log-in");
const signUp = document.querySelector(".sign-up");
const btn_enter = document.querySelector(".enter");
const back = document.querySelector(".back");
const guest = document.querySelector(".guest");
let isGuest = false;
const pawnDied = [12, 12];
let users = JSON.parse(localStorage.getItem("users")) || [];
let dataGame = new Array(8).fill(null).map(() => new Array(8).fill(null));
const enterData = () => {
    for (let i = 0; i < dataGame.length; i++) {
        for (let j = 0; j < dataGame[i].length; j++) {
            if ((j + i) % 2 == 0) {
                if (i <= 2) dataGame[i][j] = "red";
                else if (i >= 5) dataGame[i][j] = "dark";
                else if (i > 2 && i < 5) dataGame[i][j] = "true"
            }
        }
    }
}
enterData();

console.log("data Game: " + dataGame);

let isSignup = null;

let loginPage = true;
btn_enter.addEventListener("click", () => {
    loginPage = false;
    login.classList.add("hide");
    signUp.classList.remove("hide")
});
back.addEventListener("click", () => {
    signUp.classList.add("hide");
    login.classList.remove("hide")
    loginPage = true;
})

guest.addEventListener("click", () => {
    isGuest = true;
    localStorage.setItem("currentUser", "guest")
    window.location.href = "game.html";
})


const updetVal = () => {
    if (loginPage) {
        name_val = document.querySelector("#name2").value;
        password_val = document.querySelector("#password2").value;
    } else {
        name_val = document.querySelector("#name").value;
        mail_val = document.querySelector("#mail").value;
        mailAgain_val = document.querySelector("#mail_again").value;
        password_val = document.querySelector("#password").value;
    }
};
const updateIsNewUserInLocalStorage = (tr)=>{
    localStorage.setItem("isNewUser", tr);
};

const submit1 = (e) => {
    e.preventDefault(); // מונע את רענון הדף
    console.log("submit1");
    if (checkName() && checkMail()) {
        addUserToLocalStor();
        setTimeout(() => {
            updateIsNewUserInLocalStorage("false");
            localStorage.setItem("currentUser", name_val);
            window.location.href = "game.html";
        }, 500);
        
    };
}

const submit2 = (e) => {
    e.preventDefault(); // מונע את רענון הדף
    console.log("submit 2");
    if (checkAll()) {
        setTimeout(() => {
            localStorage.setItem("currentUser", name_val);
            updateIsNewUserInLocalStorage("true");
            window.location.href = "game.html";

        }, 500);
    }
};
const form = document.querySelectorAll("form");
form[0].addEventListener("submit", submit1);
form[1].addEventListener("submit", submit2);

const addUserToLocalStor = () => {
    console.log("addUserToLocalStor");
    const user = new User(name_val, mail_val, password_val, dataGame, pawnDied)
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}


const checkUserNames = (_name) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.some(item => item.username === _name);
}
const checkName = () => {
    updetVal();
    if (checkUserNames(name_val)) {
        console.log("השם קיים כבר");
        document.querySelector("#error_name").textContent = "The name entered is exist"
        return false;
    }
    if (name_val.length < 2 || name_val.length == 0) {
        console.log("name too short");
        document.querySelector("#error_name").textContent = "The name entered is too short"
        return false;
    }
    else {
        document.querySelector("#error_name").textContent = ""
        return true;
    }
}
const checkMail = () => {
    updetVal();
    if (mail_val.length == 0 || mail_val.length == 0) return false;
    if (mail_val != mailAgain_val) {
        document.querySelector("#error_mail").textContent = "The mail adresses do not match"
        return false;
    }
    else {
        document.querySelector("#error_mail").textContent = ""
        return true;
    }

};


document.querySelector("#password").addEventListener("input", () => {
    updetVal()
    let errorPassword = document.querySelector("#error_password");
    // console.log("local clear");
    if (password_val.length <= 2) {
        errorPassword.textContent = "סיסמה חלשה"
    }
    else if (password_val.length > 2 && password_val.length <= 6) {
        errorPassword.textContent = "סיסמה בינונית"
    }
    else if (password_val.length > 6) {
        errorPassword.style.color = "green"
        errorPassword.textContent = "סיסמה חזקה"
    }
    console.log(password_val);
});


const password_input = document.querySelector("#password");
const password_input2 = document.querySelector("#password2");
const iconShow = document.querySelectorAll(".iconShow");
const iconHide = document.querySelectorAll(".iconHide");

const hidePassword = () => {
    if (password_input.type === "password") {
        password_input.type = "text";
        iconShow[0].classList.add("hide");
        iconHide[0].classList.remove("hide");
        iconShow[1].classList.add("hide");
        iconHide[1].classList.remove("hide");
    }
    else if (password_input.type === "text") {
        password_input.type = "password";
        iconHide[0].classList.add("hide");
        iconShow[0].classList.remove("hide");
        iconHide[1].classList.add("hide");
        iconShow[1].classList.remove("hide");
    }
    if (loginPage && password_input2.type === "password") password_input2.type = "text"
    else if (password_input2.type === "text") password_input2.type = "password"

}
iconShow[0].addEventListener("click", hidePassword);
iconShow[1].addEventListener("click", hidePassword);
iconHide[0].addEventListener("click", hidePassword);
iconHide[1].addEventListener("click", hidePassword);

const error_name2 = document.querySelector("#error_name2")
const errorPassword2 = document.querySelector("#error_password2")
const checkAll = () => {
    updetVal();
    const usersFromLocalStor = JSON.parse(localStorage.getItem("users")) || [];
    const isUserExsist = usersFromLocalStor.some(item =>
        name_val === item.username && password_val === item.password
    );
    error_name2.textContent = "";
    errorPassword2.textContent = "";
    if (!isUserExsist) {
        if (!usersFromLocalStor.some(item => name_val === item.username)) {
            error_name2.textContent = "The username you entered does not match";
        }
        if (!usersFromLocalStor.some(item => password_val === item.password)) {
            errorPassword2.textContent = "The password you entered does not match"
        }
    }
    return isUserExsist;
    // if (localStorage.getItem("username") === name_val &&
    //     localStorage.getItem("password") === password_val) {
    //     return true;
    // }
    // else {
    //     if (localStorage.getItem("username") !== name_val) {
    //         error_name2.textContent = "The username you entered does not motch"
    //     }
    //     else error_name2.textContent = "";
    //     if (localStorage.getItem("password") !== password_val) {
    //         errorPassword2.textContent = "The password you entered does not motch"
    //     }
    //     else errorPassword2.textContent = "";
    // }
    // return false;
}
