
function MainPage(){};

var mainPage = new MainPage();

MainPage.prototype.BUTTON_GAP = 270;
MainPage.prototype.PADDING_Y = 350;
MainPage.prototype.CALUMN_CNT = 4;
MainPage.prototype.btnName = ['btn_board1', 'btn_board2'];
MainPage.prototype.boardList = [
    '5x3', '5x4', '5x5', '6x5',
    '7x5', '8x5', '9x5', '10x5',
    '11x5', '10x3', '10x4', '10x6',
    '12x5', '15x3', '15x4'/*, '20x5'*/
    ];

MainPage.prototype.style = { font: '48px Arial', fill: '#ffffff', align: 'center'};
MainPage.prototype.ObjectList = [];
MainPage.prototype.ObjectLogin = [];
MainPage.prototype.currGameType = '';
MainPage.prototype.ready = false;

MainPage.prototype.ShowMainPage = function(){
    this.ObjectList = [];
    for( var i in this.boardList){
        var x = (i % this.CALUMN_CNT) * this.BUTTON_GAP;
        var y = parseInt(i / this.CALUMN_CNT) * this.BUTTON_GAP + this.PADDING_Y;
        var type = (1*i+parseInt(i / this.CALUMN_CNT)) % this.btnName.length;
        var button = game.add.button(x, y, this.btnName[type], this.onUpBoard, this, 0, 0, 1);
        button.variable = this.boardList[i];
        button.scale.set(3);

        var clearData = clientData.GetMyClearDataStr(button.variable);
        var text = game.add.text(x+(this.BUTTON_GAP/2), y+(this.BUTTON_GAP/2), button.variable+'\n'+clearData, this.style);
        text.anchor.set(0.5);
        text.stroke = !clientData.IsAllCleared(button.variable) ? '#c4c4ff' : '#FF565C';
        text.strokeThickness = 25;
        text.setShadow(2, 2, '#333333', 2, true, true);

        this.ObjectList.push(button);
        this.ObjectList.push(text);
    }

    // title
    {
        var clearData = clientData.GetMyClearDataStr(0, true);
        var text = game.add.text(50, this.PADDING_Y - 310, 'Pentomino888', 
            { font: '96px Arial', fill: '#ffffff', align: 'center'});
        text.stroke = '#FFB2FB';
        text.strokeThickness = 25;
        text.setShadow(2, 2, '#333333', 2, true, true);
        this.ObjectList.push(text);
    }

    // total
    {
        var clearData = clientData.GetMyClearDataStr(0, true);
        var ranking = '';
        if( clientData.MyRanking > 0 ){
            ranking = '   Rank: '+clientData.MyRanking;
        }            
        var text = game.add.text(53, this.PADDING_Y - 180, 'Total : ' + clearData + ranking, this.style);
        text.stroke = '#6AD8C4';
        text.strokeThickness = 30;
        text.setShadow(2, 2, '#333333', 2, true, true);
        this.ObjectList.push(text);
    }

    // login / logout
    {
        if( _loginManager.GetLoginType() != LOGIN_TYPE.None ){
            var button = game.add.button(0, this.PADDING_Y-75, _loginManager.GetLogoutButtonName(), this.onLogOut, this, 0, 0, 1);
            button.scale.set(1.5);
            button.x = SCREEN_WIDTH - button.width - 10;
            this.ObjectList.push(button);
        }
        else{
            var button_fb = game.add.button(0, this.PADDING_Y-90, 'btn_login_fb', this.onLogin_fb, this, 0, 0, 1);
            button_fb.scale.set(2);
            button_fb.x = SCREEN_WIDTH - button_fb.width - 10;
            this.ObjectList.push(button_fb);

            var button_gl = game.add.button(0, this.PADDING_Y-90, 'btn_login_gl', this.onLogin_gl, this, 0, 0, 1);
            button_gl.scale.set(0.57);
            button_gl.x = SCREEN_WIDTH - button_gl.width - 10 - button_fb.width - 10;
            this.ObjectList.push(button_gl);
        }
    }

    { // btn_rankPage
        var btn_ranking = game.add.button(0,  20, 'btn_ranking', this.onUpRankingPage, this, 0, 0, 1);
        btn_ranking.scale.set(2);
        btn_ranking.x = SCREEN_WIDTH - btn_ranking.width-10;
        this.ObjectList.push(btn_ranking);
    }

    this.SetLoginUserData();
}

MainPage.prototype.CloseMainPage = function(){
    //console.log('CloseMainPage');
    this.RemoveLoginUserData();
    for(var i in this.ObjectList){
        this.ObjectList[i].kill();
    }    
    this.ObjectList = [];
}

MainPage.prototype.SetLoginUserData = function(){
    this.RemoveLoginUserData();
    var clearData = clientData.GetMyClearDataStr(0, true);
    var text = game.add.text(55, this.PADDING_Y - 80, 'Welcome! '+_loginManager.GetUserName()+'!',
        { font: '36px Arial', fill: '#ffffff', align: 'center'});
    //text.x = SCREEN_WIDTH/2 - text.width/2 - 190;
    text.stroke = '#728AFF';
    text.strokeThickness = 25;
    text.setShadow(2, 2, '#333333', 2, true, true);
    this.ObjectLogin.push(text);
}

MainPage.prototype.RemoveLoginUserData = function(){
    for(var i in this.ObjectLogin){
        this.ObjectLogin[i].kill();
    }
    this.ObjectLogin = [];
}

MainPage.prototype.onUpBoard = function(button){
    //console.log('on button ' + button.variable);
    this.currGameType = button.variable;
    // this.CloseMainPage();
    // choicePage.ShowChoicePage();
    _gameState.SetState(state.ChoicePage);
}

MainPage.prototype.onLogOut = function(){
    switch( _loginManager.GetLoginType() ){
        case LOGIN_TYPE.Facebook:
            FB.logout(function(response){
                _login_Facebook.statusChangeCallback(response);
            });
        break;

        case LOGIN_TYPE.Google:
            _login_Google.signOut();
        break;
    }
}

MainPage.prototype.onLogin_fb = function(){
    if( _loginManager.GetLoginType() !== LOGIN_TYPE.None )
        return;
    
    FB.login(function(response){
        _login_Facebook.statusChangeCallback(response);
    });    
}

MainPage.prototype.onLogin_gl = function(){
    if( _loginManager.GetLoginType() !== LOGIN_TYPE.None )
        return;
    _login_Google.signIn();
}

MainPage.prototype.onUpRankingPage = function(){
    _gameState.SetState(state.RankingPage);
}