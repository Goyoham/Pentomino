
function TextMessage(){
	
}

textMessage = new TextMessage();

TextMessage.prototype.textContent;
TextMessage.prototype.textClear;
TextMessage.prototype.timerDisappear;

TextMessage.prototype.enabledText = false;

TextMessage.prototype.createText = function(){
	// message text
	this.textContent = game.add.text(game.world.centerX, 80, '', { font: "20px Arial", fill: "#ff0044", align: "center" });
    this.textContent.anchor.set(0.5);
    this.timerDisappear = game.time.create(false);    

    // clear text
    this.textClear = game.add.bitmapText(60*3, 230*3, 'font_desyrel', '', 64*3);

	this.enabledText = true;
}

TextMessage.prototype.terminateText = function(){
	this.enabledText = false;

	this.textContent.kill();
	this.textClear.kill();
}

TextMessage.prototype.setTextMessage = function(msg){
	this.timerDisappear.stop();
	this.textContent.text = msg;
	this.timerDisappear.loop(3000, this.onTimerDisappear, this);
	this.timerDisappear.start();
}

TextMessage.prototype.clearTextMessage = function(){
	this.textContent.text = '';
}

TextMessage.prototype.onTimerDisappear = function(){
	this.clearTextMessage();
}

TextMessage.prototype.updateClearText = function(){
	if( this.enabledText === false )
		return;

	if( createGameMgr.isClear )
   		this.textClear.text = 'CLEAR!!';
	else
		this.textClear.text = '';
}