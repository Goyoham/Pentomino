
function startGoogleLogin() {
    console.log('start');
    gapi.load('auth2', function() {
        _login_Google.auth2 = gapi.auth2.init({
            client_id: '28649472276-9vuhrqgns7ud6gv156mmudaa9n21nnu1.apps.googleusercontent.com',
            scope: 'profile'
        });

        _login_Google.auth2.isSignedIn.listen(_login_Google.signinChangedListener);
    });
}

function Login_Google() {}
var _login_Google = new Login_Google();
Login_Google.prototype.auth2;
Login_Google.prototype.onClickedLogin = false;
Login_Google.prototype.saveName = '';

Login_Google.prototype.signinChangedListener = function(isSignIn){
    //console.log('signinChangedListener:'+isSignIn);
    if( isSignIn === true ){
        if( this.onClickedLogin !== true )
            return;
        this.VerifyToLoginProcess();
        this.onClickedLogin = false;
    }
    else{
        clientSocket.Send_Logout();
    }
}

Login_Google.prototype.signIn = function(){
    //console.log(_login_Google.auth2);
    if( typeof _login_Google.auth2 === 'undefined' )
    {
        startGoogleLogin();
        return;
    }
    _login_Google.auth2.signIn();
    if( _login_Google.auth2.isSignedIn.get() === true )
        _login_Google.VerifyToLoginProcess();
    else
        this.onClickedLogin = true;
}

Login_Google.prototype.signOut = function(){
    _login_Google.auth2.signOut().then(function () {
        //console.log('google signed out.');
        clientSocket.Send_Logout();
    });
}

Login_Google.prototype.VerifyToLoginProcess = function(){
    //console.log('send verify1');
    var googleUser = _login_Google.auth2.currentUser.get();
    if( typeof googleUser === 'undefined ')
        return;
    var profile = googleUser.getBasicProfile();
    if( typeof profile === 'undefined ')
        return;
    var data = {};
    data.id_token = googleUser.getAuthResponse().id_token;
    data.id = profile.getId();
    //console.log('send verify2');
    clientSocket.ReverifyLogin_Google(data);

    this.saveName = profile.getName();
}

Login_Google.prototype.AfterLoginProcess = function(){
    _loginManager.SetLoginType(LOGIN_TYPE.Google);
    _loginManager.SetUserName(this.saveName);
}