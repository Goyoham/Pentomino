// block manager
function BlockMgr(){
    // members
    /*
    var shadowBlock = 0; // following block like a shadow
    var dragMovement = 0;
    var blockList = [];
    */
};

var blockMgr = new BlockMgr();

// members ------------------------------------------------------------------------------------
BlockMgr.prototype.shadowBlock = 0; // following block like a shadow
BlockMgr.prototype.lastClickedBlock = 0;
BlockMgr.prototype.dragMovement = 0;
BlockMgr.prototype.blockList = [];

// static members ------------------------------------------------------------------------------------
BlockMgr.prototype.blockName = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
BlockMgr.prototype.BLOCK_CNT = 12; // kind
BlockMgr.prototype.BLOCK_VOLUME = 5;
BlockMgr.prototype.SIZE_ONE_BLOCK = 20;
BlockMgr.prototype.blockForms;
BlockMgr.prototype.blockForm = {
    F: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 1, 0],
    ],
    I: [
        [1],
        [1],
        [1],
        [1],
        [1],
    ],
    L: [
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 1],
    ],
    N: [
        [0, 1],
        [0, 1],
        [1, 1],
        [1, 0],
    ],
    P: [
        [1, 1],
        [1, 1],
        [1, 0],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    U: [
        [1, 0, 1],
        [1, 1, 1],
    ],
    V: [
        [0, 0, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    W: [
        [0, 0, 1],
        [0, 1, 1],
        [1, 1, 0],
    ],
    X: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    Y: [
        [0, 1],
        [1, 1],
        [0, 1],
        [0, 1],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ],
}

// functions utils ------------------------------------------------------------------------------------
BlockMgr.prototype._makeFlippedForm = function(blockForm){
    // make flippedForm
    var flippedForm = {};
    for( var blockType in blockForm ){
        //console.log(blockType);
        var lenY = blockForm[blockType].length;
        flippedForm[blockType] = [];
        for( var y = 0; y < lenY; ++y ) {
            flippedForm[blockType].push([]);
            lenX = blockForm[blockType][y].length;
            for( var x = 0; x < lenX; ++x ){
                flippedForm[blockType][y].push(blockForm[blockType][y][lenX-x-1]);
            }
            //console.log(flippedForm[blockType][y]);
        }
    }
    return flippedForm;
}

BlockMgr.prototype._makeRotatedForm = function(blockForm){
    // make rotatedForm to right 90
    var rotatedForm = {};
    for( var blockType in blockForm ){
        //console.log(blockType);
        var lenX = blockForm[blockType][0].length;
        rotatedForm[blockType] = [];
        for( var x = 0; x < lenX; ++x ){
            rotatedForm[blockType].push([]);
            lenY = blockForm[blockType].length;
            for( var y = 0; y < lenY; ++y ) {
                rotatedForm[blockType][x].push(blockForm[blockType][lenY-y-1][x]);
            }
            //console.log(rotatedForm[blockType][x]);
        }
    }
    return rotatedForm;
}

// get block type str
BlockMgr.prototype._getBlockType = function(key){
    if( typeof key === 'undefined')
    {
        console.log('undefined key');
        return;
    }
    var strArr = key.split('_');
    return strArr[strArr.length - 1];
}

BlockMgr.prototype._getBlockFlip = function(block){
    return block.scale.x > 0 ? 0 : 1;
}

BlockMgr.prototype._setBlockFlip = function(block){
    block.scale.x *= -1;
}

BlockMgr.prototype._getBlockRotation = function(block){
    return ((block.angle + 360) / 90) % 4;
}

BlockMgr.prototype._getBlockState = function(block){
    var state = {};
    state.type = this._getBlockType(block.key);
    state.flip = this._getBlockFlip(block);
    state.rotation = this._getBlockRotation(block);
    return state;
}

// return (0~1). input: 1~N.
BlockMgr.prototype._getCenterOfAnchor = function(size) {
    return 0.5 + ((size % 2) * (1 / (size * 2)));
}

BlockMgr.prototype._CheckCollisionPosList = function(listA, listB){
    for(var keyY in listA){
        if( listB.hasOwnProperty(keyY) === false )
            continue;
        for(var keyX in listA[keyY]){
            if( listB[keyY].hasOwnProperty(keyX) === false )
                continue;
            return true;
        }
    }
    return false;
}

BlockMgr.prototype._IsSameBlock = function(blockA, blockB){
    if (blockA.key !== blockB.key)
        return false;

    if (blockA.scale.x !== blockB.scale.x)
        return false;

    return true;
}

BlockMgr.prototype._setAnchor = function(block){
    var w = block.width / this.SIZE_ONE_BLOCK;
    var h = block.height / this.SIZE_ONE_BLOCK;
    w = this._getCenterOfAnchor(w);
    if( this._getBlockFlip(block) === 1)
        w = 1 - w;
    h = this._getCenterOfAnchor(h);
    block.anchor.setTo(w, h);
}

// functions members ------------------------------------------------------------------------------------
BlockMgr.prototype.InitBlockForms = function(){
    var flippedForm = this._makeFlippedForm(this.blockForm);
    var originForm = this._makeFlippedForm(flippedForm);
    this.blockForms = [[],[]];
    for(var i = 0; i < 4; ++i){
        this.blockForms[0].push(originForm);
        this.blockForms[1].push(flippedForm);
        //console.log('origin ' + (i+1));
        originForm = this._makeRotatedForm(originForm);
        //console.log('flipped ' + (i+1));
        flippedForm = this._makeRotatedForm(flippedForm);
    }
}

BlockMgr.prototype.createAllBlocks = function() {
    var sumX = 20;
    var sumY = 100;
    for (var i = 0; i < this.BLOCK_CNT * 2; ++i) {
        var block = this.createBlock(this.blockName[i % this.BLOCK_CNT], i >= this.BLOCK_CNT);
        block.x = 80 + sumX * (i % this.BLOCK_CNT);
        block.y = 80 + sumY * (i % 2);
        if (i >= this.BLOCK_CNT) {            
            block.x -= 20;
            block.y += 320;
        }
        this.blockList.push(block);
    }
}

BlockMgr.prototype.createRandomBlocks = function(num){
    if( num < 0 || num > this.BLOCK_CNT )
        num = this.BLOCK_CNT;

    var makeBlockIndex = [];
    for(var i = 0; i < num;){
        var ran = utils.randomRange(0, this.BLOCK_CNT-1);
        if( utils.inArray(makeBlockIndex, ran) )
            continue;
        makeBlockIndex.push(ran);
        ++i
    }

    for (var i = 0; i < num;) {
        var index = makeBlockIndex[i];
        var block = this.createBlock(this.blockName[index], false);
        block.y = 400;
        while(this.CheckOverlappedBlock(block, this.blockList)) {
            if( block.x > SCREEN_WIDTH ){
                block.x = 0;
                block.y += blockMgr.SIZE_ONE_BLOCK;
            }
            else{
                block.x += blockMgr.SIZE_ONE_BLOCK;
            }
        }
        this.blockList.push(block);
        ++i;
    }
}

BlockMgr.prototype.createBlock = function(blockType, bFlip) {
    // real block
    var block = game.add.sprite(0, 0, 'whole_' + blockType);
    if( bFlip === true )
        this._setBlockFlip(block);

    // find anchor to rotate
    this._setAnchor(block);
    // allow input
    block.inputEnabled = true;
    // allow drag
    block.input.enableDrag(false, true);
    // SIZE_ONE_BLOCK
    //block.input.enableSnap(this.SIZE_ONE_BLOCK, this.SIZE_ONE_BLOCK, false, true);

    // events
    block.events.onDragStart.add(this.onDragStart, this);
    block.events.onDragUpdate.add(this.onDragUpdate, this);
    block.events.onDragStop.add(this.onDragStop, this);
    block.events.onInputDown.add(this.onInputDown, this);
    block.events.onInputUp.add(this.onInputUp, this);

    // input work as perfectly pixel clicked
    block.input.pixelPerfectOver = true;
    block.input.pixelPerfectClick = true;
    //block.input.useHandleCursor = true;

    return block;
}

BlockMgr.prototype.eraseBlocks = function(){
    var len = this.blockList.length;
    for(var i = 0; i < len; ++i){
        this.blockList[i].kill();
    }
    this.blockList = [];
    this.lastClickedBlock = 0;
    this.shadowBlock = 0;
}

BlockMgr.prototype.onDragStart = function(block, pointer) {
    //console.log('onDragStart');
    this.dragMovement = 0;
}

BlockMgr.prototype.onDragUpdate = function(block, pointer) {
    //console.log('onDragUpdate block X:' + block.x + ' Y:' + block.y);
    this.dragMovement += 1;

    if (this.shadowBlock !== 0) {
        beforeX = this.shadowBlock.x;
        beforeY = this.shadowBlock.y;
        this.shadowBlock.x = this.GetPosShadow(block.x);
        this.shadowBlock.y = this.GetPosShadow(block.y);
        
        if (this.shadowBlock.x == beforeX
            && this.shadowBlock.y == beforeY)
        {
            return;
        }

        if (this.CheckOverlappedBlock(this.shadowBlock, this.blockList)) {
            this.shadowBlock.x = beforeX;
            this.shadowBlock.y = beforeY;
        }
        // log
        //var shadowPos = getBlockPos(this.shadowBlock);
        //console.log('this.shadowBlock:'+this.shadowBlock.x + ' ' + this.shadowBlock.y + ' ' + shadowPos.x + ' ' + shadowPos.y);
    }
}

BlockMgr.prototype.onDragStop = function(block, pointer) {
    //console.log('onDragStop');
    this.dragMovement = 0;

    createGameMgr.fillGameBoardArray(this.blockList);
    // log
    /*
    var myBlockPosList = this.getBlockPosList(block);
    console.log('----');
    for(var keyY in myBlockPosList){
        for(var keyX in myBlockPosList[keyY] ){
            console.log(keyY + ' ' + keyX);
        }
    }
    */
}

BlockMgr.prototype.onInputDown = function(block, pointer) {
    //console.log('onInputDown : '+block.key);
    this.lastClickedBlock = block;
    // shadow
    this.shadowBlock = game.add.sprite(0, 0, block.key);
    this.shadowBlock.alpha = 0.5;
    this.shadowBlock.angle = block.angle;
    this.shadowBlock.scale = block.scale;
    this.shadowBlock.anchor.setTo(block.anchor.x, block.anchor.y);
    this.shadowBlock.x = block.x;
    this.shadowBlock.y = block.y;
}

BlockMgr.prototype.onInputUp = function(block, pointer) {
    //console.log('onInputUp');
    if (this.dragMovement <= 2) {
        this.rotateBlock(block);
    }

    if (this.shadowBlock !== 0) {        
        block.x = this.shadowBlock.x;
        block.y = this.shadowBlock.y;
        this.shadowBlock.kill();
        this.shadowBlock = 0;
    }
}

BlockMgr.prototype.GetPosShadow = function(blockPos) {
    var diff = blockPos % this.SIZE_ONE_BLOCK;
    if (diff < this.SIZE_ONE_BLOCK / 2) {
        return blockPos - diff;
    }
    else {
        return blockPos + this.SIZE_ONE_BLOCK - diff;
    }
}

BlockMgr.prototype.rotateBlock = function(block){
    //console.log('rotate');
    if (this.shadowBlock !== 0) {
        beforeX = this.shadowBlock.x;
        beforeY = this.shadowBlock.y;
        this.shadowBlock.x = this.GetPosShadow(block.x);
        this.shadowBlock.y = this.GetPosShadow(block.y);
        this.shadowBlock.angle += 90;
        if (this.CheckOverlappedBlock(this.shadowBlock, this.blockList)) {
            this.shadowBlock.x = beforeX;
            this.shadowBlock.y = beforeY;
            this.shadowBlock.angle -= 90;
        }
        else {
            block.angle += 90; // rotate
        }
    }
}

BlockMgr.prototype.getBlockForm = function(block){
    var state = this._getBlockState(block);
    var form = this.blockForms[state.flip][state.rotation][state.type];
    return form;
}

BlockMgr.prototype.getBlockPos = function(block) {
    var pos = {};
    pos.x = Math.round(block.x / this.SIZE_ONE_BLOCK);
    pos.y = Math.round(block.y / this.SIZE_ONE_BLOCK);
    
    if( this._getBlockRotation(block) == 1){
        if( this.IsOddX(block) ) pos.x += 1;
    }
    else if( this._getBlockRotation(block) == 2){
        if( this.IsOddX(block) ) pos.x += 1;
        if( this.IsOddY(block) ) pos.y += 1;
    }
    else if( this._getBlockRotation(block) == 3){
        if( this.IsOddY(block) ) pos.y += 1;
    }
    
    return pos;
}

BlockMgr.prototype.getCenterPosOfBlock = function(block) {
    var lengthY = this.getBlockForm(block).length;
    var lengthX = this.getBlockForm(block)[0].length;
    var centerPos = {};
    centerPos.y = this._getCenterOfAnchor(lengthY) * lengthY;
    centerPos.x = this._getCenterOfAnchor(lengthX) * lengthX;
    return centerPos;
}

BlockMgr.prototype.IsOddX = function(block){
    return this.getBlockForm(block)[0].length % 2 === 1;
}

BlockMgr.prototype.IsOddY = function(block){
    return this.getBlockForm(block).length % 2 === 1;
}

BlockMgr.prototype.getBlockPosList = function(block) {
    var blockPos = this.getBlockPos(block);
    var centerPos = this.getCenterPosOfBlock(block);

    var blockPosList = {};
    var lenY = this.getBlockForm(block).length;
    for(var y = 0; y < lenY; ++y){
        var lenX = this.getBlockForm(block)[y].length;
        for(var x = 0; x < lenX; ++x){
            if( this.getBlockForm(block)[y][x] !== 1 )
                continue;
            var realPosX = x + blockPos.x - centerPos.x;
            var realPosY = y + blockPos.y - centerPos.y;
            //if( blockType === 'I' && block.scale.x > 0){
            //    console.log(realPosY + ' ' + realPosX);
            //}
            if( blockPosList.hasOwnProperty(realPosY) === false ){
                blockPosList[realPosY] = {};
            }
            blockPosList[realPosY][realPosX] = true;
        }
    }
    return blockPosList;
}

BlockMgr.prototype.CheckOverlappedBlock = function(myBlock, blockList) {
    var len = blockList.length;
    var myBlockPosList = this.getBlockPosList(myBlock);

    // log
    /*
    var blockPos = getBlockPos(myBlock);
    //console.log('pos : ' +myBlock.x+' '+myBlock.y);
    console.log('blockpos : ' +blockPos.x+' '+blockPos.y);
    console.log('roation : ' + this._getBlockRotation(myBlock));    
    console.log('lengthX : '+this.getBlockForm(myBlock)[0].length);
    
    for(var keyY in myBlockPosList){
        for(var keyX in myBlockPosList[keyY] ){
            console.log(keyY + ' ' + keyX);
        }
    }
    */
    // log
    // check over map
    for(var keyY in myBlockPosList){
        if( keyY < 2 || keyY >= (SCREEN_HEIGHT/blockMgr.SIZE_ONE_BLOCK) )
            return true;
        for(var keyX in myBlockPosList[keyY] ){
            if( keyX < 0 || keyX >= (SCREEN_WIDTH/blockMgr.SIZE_ONE_BLOCK) )
                return true;
        }
    }
    
    // check overlap
    for (var i = 0; i < len; ++i) {
        if (this._IsSameBlock(myBlock, blockList[i]))
            continue;

        if( this._CheckCollisionPosList(myBlockPosList, this.getBlockPosList(blockList[i])) )
            return true;
    }

    return false;
}

BlockMgr.prototype.FlipLastClickedBlock = function(){
    if( this.lastClickedBlock === 0 )
        return;
    if( typeof this.lastClickedBlock === 'undefined' )
        return;
    this._setBlockFlip(this.lastClickedBlock);
    if (this.CheckOverlappedBlock(this.lastClickedBlock, this.blockList)) {
        this._setBlockFlip(this.lastClickedBlock);
        return;
    }
    this._setAnchor(this.lastClickedBlock);
}