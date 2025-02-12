let name_val, mail_val, mailAgain_val, password_val;
const container = document.querySelector(".container");


const login = document.querySelector(".log-in");
const signUp = document.querySelector(".sign-up");
const btn_enter = document.querySelector(".enter");
const back = document.querySelector(".back");

let loginPage = false;
btn_enter.addEventListener("click", () => {
    loginPage = true;
    signUp.classList.add("hide");
    login.classList.remove("hide")
});
back.addEventListener("click", () => {
    login.classList.add("hide");
    signUp.classList.remove("hide")
    loginPage = false;
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

const submit = (e) => {
    e.preventDefault(); // מונע את רענון הדף
    if (!loginPage && checkName() && checkMail()) {
        window.location.href = "index2.html";
        updatLocalStor();
    }
    else if (loginPage && checkAll()) {
        window.location.href = "index.html";
    }
};
const form = document.querySelectorAll("form");
form[0].addEventListener("submit", submit);
form[1].addEventListener("submit", submit);

const updatLocalStor = () => {
    localStorage.setItem("username", name_val);
    localStorage.setItem("mail", mail_val);
    localStorage.setItem("password", password_val);

}

const checkName = () => {
    updetVal();
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
    if (localStorage.getItem("username") === name_val &&
        localStorage.getItem("password") === password_val) {
        return true;
    }
    else {
        if (localStorage.getItem("username") !== name_val) {
            error_name2.textContent = "The username you entered does not motch"
        }
        else error_name2.textContent = "";
        if (localStorage.getItem("password") !== password_val) {
            errorPassword2.textContent = "The password you entered does not motch"
        }
        else errorPassword2.textContent = "";
    }
    return false;
}



