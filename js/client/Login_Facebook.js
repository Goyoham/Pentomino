
window.fbAsyncInit = function() {
    FB.init({
    appId      : APP.ID,
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
    console.log('fb');
    checkLoginState();
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

function checkLoginState() {
    if( typeof FB === 'undefined' ){
        console.log('FB is undefined');
        return;
    }
    console.log('check facebook login state');
    FB.getLoginStatus(function(response) {
        _login_Facebook.statusChangeCallback(response);
    });
}

Login_Facebook.prototype.isLogin = false;
Login_Facebook.prototype.name = '';
Login_Facebook.prototype.statusChangeCallback = function(response){
    if( response.status === 'connected' ){
        console.log('logined from facebook');
        console.log(response);
        FB.api('/me', function(response2) {
            _login_Facebook.name = response2.name;
            console.log('name:'+name);
            mainPage.SetLoginUserData();
        });
        clientSocket.ReverifyLogin_Facebook(response);
        this.isLogin = true;
    }
    else {
        clientSocket.LoginOut_Facebook();
        this.isLogin = false;
        _login_Facebook.name = '';
        mainPage.RemoveLoginUserData();
    }
}