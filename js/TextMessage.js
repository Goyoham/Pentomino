
function TextMessage(){
	
}

textMessage = new TextMessage();

TextMessage.prototype.textContent;
TextMessage.prototype.textClear;
TextMessage.prototype.texthint;
TextMessage.prototype.timerDisappear;

TextMessage.prototype.createText = function(){
	// message text
	this.textContent = game.add.text(game.world.centerX, 80, '', { font: "20px Arial", fill: "#ff0044", align: "center" });
    this.textContent.anchor.set(0.5);
    this.timerDisappear = game.time.create(false);    

    // clear text
    this.textClear = game.add.bitmapText(60, 230, 'font_desyrel', '', 64);

	// hint text
	this.texthint = game.add.text(115, 40, '', { font: "20px Arial", fill: "#FFFFFF", align: "center" });
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
	if( createGameMgr.isClear )
   		this.textClear.text = 'CLEAR!!';
	else
		this.textClear.text = '';
}

TextMessage.prototype.updateHintText = function(usedHint){
	this.texthint.text = '<Used Hint:'+usedHint+'>';
}