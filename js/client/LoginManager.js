
function LoginManager() {}
var _loginManager = new LoginManager();

LoginManager.prototype.loginType = LOGIN_TYPE.None;
LoginManager.prototype.name = '';

LoginManager.prototype.SetLoginType = function(loginType){
    this.loginType = loginType;
}

LoginManager.prototype.GetLoginType = function(){
    return this.loginType;
}

LoginManager.prototype.GetLogoutButtonName = function(){
    switch( this.GetLoginType() ){
        case LOGIN_TYPE.Facebook: return 'btn_logout_fb';
        case LOGIN_TYPE.Google: return 'btn_logout_gl';
        default:
            return '';
    }
}

LoginManager.prototype.SetUserName = function(name){
    this.name = name;    
    mainPage.SetLoginUserData();
    clientSocket.SendLoginedUserInfoNot(name);
}

LoginManager.prototype.GetUserName = function(){
    return this.name;
}

LoginManager.prototype.ReconnectedServer = function(){
    switch( this.GetLoginType() ){
        case LOGIN_TYPE.Facebook:
            _login_Facebook.checkLoginState();
            console.log('reconnect facebook');
        break;

        case LOGIN_TYPE.Google:
            _login_Google.VerifyToLoginProcess();
            console.log('reconnect google');
        break;

        default:
            _gameState.SetState(state.MainPage);
    }
}