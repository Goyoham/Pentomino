
function MainPage(){

};

var mainPage = new MainPage();

MainPage.prototype.BUTTON_GAP = 270;
MainPage.prototype.CALUMN_CNT = 4;
MainPage.prototype.btnName = ['btn_board1', 'btn_board2'];
MainPage.prototype.boardList = [
    '5x3', '5x4', '5x5', '6x5',
    '7x5', '8x5', '9x5', '11x5',
    '10x3', '10x4', '10x5', '10x6',
    '12x5', '15x3', '15x4'/*, '20x5'*/
    ];

MainPage.prototype.style = { font: '48px Arial', fill: '#ffffff', align: 'center'};
MainPage.prototype.ObjectList = [];
MainPage.prototype.currGameType = '';

MainPage.prototype.ShowMainPage = function(){
    this.ObjectList = [];
    var paddingY = 200;
    for( var i in this.boardList){
        var x = (i % this.CALUMN_CNT) * this.BUTTON_GAP;
        var y = parseInt(i / this.CALUMN_CNT) * this.BUTTON_GAP + paddingY;
        var type = (1*i+parseInt(i / this.CALUMN_CNT)) % this.btnName.length;
        var button = game.add.button(x, y, this.btnName[type], this.onUpBoard, this, 0, 0, 1);
        button.variable = this.boardList[i];
        button.scale.set(3);

        var clearData = clientData.GetMyClearDataStr(button.variable);
        var text = game.add.text(x+(this.BUTTON_GAP/2), y+(this.BUTTON_GAP/2), button.variable+'\n'+clearData, this.style);
        text.anchor.set(0.5);
        text.stroke = '#c4c4ff';
        text.strokeThickness = 25;
        text.setShadow(2, 2, '#333333', 2, true, true);

        this.ObjectList.push(button);
        this.ObjectList.push(text);
    }

    // total
    var clearData = clientData.GetMyClearDataStr(0, true);
    var text = game.add.text(100, paddingY - 100, 'total : '+clearData, this.style);
    text.stroke = '#ccc4cc';
    text.strokeThickness = 25;
    text.setShadow(2, 2, '#333333', 2, true, true);
    this.ObjectList.push(text);
}

MainPage.prototype.CloseMainPage = function(){
    for(var i in this.ObjectList){
        this.ObjectList[i].kill();
    }
    this.ObjectList = [];
}

MainPage.prototype.onUpBoard = function(button){
    console.log('on button ' + button.variable);
    this.currGameType = button.variable;
    this.CloseMainPage();
    choicePage.ShowChoicePage();
}