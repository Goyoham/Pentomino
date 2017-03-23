
function RankingPage(){}
rankingPage = new RankingPage();

RankingPage.prototype.ObjectList = [];

RankingPage.prototype.ShowRankingPage = function(){
    clientSocket.SendRankingListByPageReq(1);

    { // back
        var btn_back = game.add.button(0, 0, 'btn_back', this.onUpBack, this, 0, 0, 1);
        btn_back.scale.set(2);
        btn_back.x = SCREEN_WIDTH - btn_back.width;
        this.ObjectList.push(btn_back);
    }

    // {
    //     var text = game.add.text(game.world.centerX, game.world.centerY/3*2, 'loading...',
    //     { font: '72px Arial', fill: '#ffffff', align: 'center'});
    //     text.stroke = '#6AD8C4';
    //     text.strokeThickness = 30;
    //     text.anchor.set(0.5);
    //     text.setShadow(2, 2, '#333333', 2, true, true);
    //     this.ObjectList.push(text);
    // }
}

RankingPage.prototype.CloseRankingPage = function(){
    for(var i in this.ObjectList){
        this.ObjectList[i].kill();
    }
    this.ObjectList = [];
}

RankingPage.prototype.onUpBack = function(button){
    _gameState.SetState(state.MainPage);
}

RankingPage.prototype.ShowRankingList = function(data){
    if( _gameState.GetState() !== state.RankingPage )
        return;
    
    //console.log(data.rankingList);
    var yPadding = 300;
    var yTerm = 100;
    for( var index in data.rankingList )
    {
        var rankingData = data.rankingList[index];
        var text = game.add.text(50, yPadding, 
        rankingData.ranking + '    ' + rankingData.name + ' / ' + rankingData.TotalClearedNum + clientData.GetPercentStr(rankingData.TotalClearedNum),
        { font: '50px Arial', fill: '#ffffff', align: 'center'});
        text.stroke = '#000000';
        text.strokeThickness = 10;
        text.setShadow(2, 2, '#000000', 2, true, true);
        this.ObjectList.push(text);
        yPadding += yTerm;
    }
}