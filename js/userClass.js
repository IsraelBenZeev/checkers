class User {
    constructor (_userName, _mail, _password, _dataGame, _pawnDied){
        this.username = _userName;  
        this.mail = _mail;
        this.password = _password;
        this.dataGame = _dataGame;
        this.pawnDied = _pawnDied;
        this.wins = 0;
        this.losses = 0;
        this.games = 0;

    }   
}