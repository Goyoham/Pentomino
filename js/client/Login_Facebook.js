
window.fbAsyncInit = function() {
    FB.init({
    appId      : APP.ID,
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
    //console.log('fb');
    //checkLoginState();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_KR/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function Login_Facebook() {}
var _login_Facebook = new Login_Facebook();

Login_Facebook.prototype.checkLoginState = function() {
    if( typeof FB === 'undefined' ){
        //console.log('FB is undefined');
        return;
    }
    //console.log('check facebook login state');
    FB.getLoginStatus(function(response) {
        _login_Facebook.statusChangeCallback(response);
    });
}

Login_Facebook.prototype.name = '';
Login_Facebook.prototype.statusChangeCallback = function(response){
    if( response.status === 'connected' ){
        clientSocket.ReverifyLogin_Facebook(response);
    }
    else {
        clientSocket.Send_Logout();
    }
}

Login_Facebook.prototype.AfterLoginProcess = function(){    
    _loginManager.SetLoginType(LOGIN_TYPE.Facebook);
    FB.api('/me', function(response2) {
        _loginManager.SetUserName(response2.name);
    });
}