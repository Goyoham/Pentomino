
function ChoicePage(){

};

var choicePage = new ChoicePage();

ChoicePage.prototype.btnName = ['btn_play1', 'btn_play1'];
ChoicePage.prototype.playList = [
    'Play Official Game', 
    'Play Hard Mode'
    ];
ChoicePage.prototype.style = { font: '64px Arial', fill: '#ffffff', align: 'center'};
ChoicePage.prototype.ObjectList = [];

ChoicePage.prototype.ShowChoicePage = function(){
    var y = 300;
    for(var i in this.playList){
        y += 300;
        var button = game.add.button(game.world.centerX, y, this.btnName[i], this.onUpButton, this, 0, 0, 1);
        button.variable = i*1;
        button.scale.x = 9;
        button.scale.y = 2;
        button.anchor.set(0.5);

        var text = game.add.text(button.x, button.y, this.playList[i], this.style);
        text.anchor.set(0.5);
        text.stroke = '#c4c4ff';
        text.strokeThickness = 25;
        text.setShadow(2, 2, '#333333', 2, true, true);

        this.ObjectList.push(button);
        this.ObjectList.push(text);
    }

    var btn_back = game.add.button(0, 0, 'btn_back', this.onUpBack, this, 0, 0, 1);
    btn_back.scale.set(2);
    btn_back.x = SCREEN_WIDTH - btn_back.width;
    this.ObjectList.push(btn_back);

    var clearData = clientData.GetMyClearDataStr(mainPage.currGameType, true);
    var text_info = game.add.text(game.world.centerX, 300, mainPage.currGameType+'\nOfficial : '+clearData, 
        { font: '72px Arial', fill: '#ffffff', align: 'center'});
    text_info.anchor.set(0.5);
    text_info.stroke = '#d8b356';
    text_info.strokeThickness = 40;
    text_info.setShadow(2, 2, '#333333', 2, true, true);
    this.ObjectList.push(text_info);
}

ChoicePage.prototype.CloseChoicePage = function(){
    for(var i in this.ObjectList){
        this.ObjectList[i].kill();
    }
    this.ObjectList = [];
}

ChoicePage.prototype.onUpButton = function(button){
    switch( button.variable )
    {
        case 0:            
            // play official game
            // this.CloseChoicePage();
            // createGameMgr.ShowGamePage();
            _gameState.SetState(state.GamePage);
        break;

        case 1:
            // play hard mode
        return;
    }
}

ChoicePage.prototype.onUpBack = function(button){
    // this.CloseChoicePage();
    // mainPage.ShowMainPage();
    _gameState.SetState(state.MainPage);
}