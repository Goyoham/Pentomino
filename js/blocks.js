
// block
var blockName = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var BLOCK_CNT = blockName.length;
var SIZE_ONE_BLOCK = 20;

var shadow = 0; // following shadow block

var blockForms;
var blockForm = {
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

function makeFlippedForm(blockForm){
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

function makeRotatedForm(blockForm){
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

function InitBlockForms(){
    var flippedForm = makeFlippedForm(blockForm);
    var originForm = makeFlippedForm(flippedForm);
    blockForms = [[],[]];
    for(var i = 0; i < 4; ++i){
        blockForms[0].push(originForm);
        blockForms[1].push(flippedForm);
        //console.log('origin ' + (i+1));
        originForm = makeRotatedForm(originForm);
        //console.log('flipped ' + (i+1));
        flippedForm = makeRotatedForm(flippedForm);
    }
}

// create blocks
var blockList = [];
function createAllBlocks() {
    var sumX = 40;
    var sumY = 100;
    for (var i = 0; i < BLOCK_CNT * 2; ++i) {
        var block = createBlock(blockName[i % BLOCK_CNT], i >= BLOCK_CNT);
        block.x = 60 + sumX * (i % BLOCK_CNT);
        block.y = 80 + sumY * (i % 2);
        if (i >= BLOCK_CNT) {            
            block.x -= 20;
            block.y += 400;
        }
        blockList.push(block);
    }
}

// create block
function createBlock(blockType, bFlip) {
    // real block
    var block = game.add.sprite(0, 0, 'whole_' + blockType);
    if( bFlip === true )
        block.scale.x *= -1;

    // find anchor to rotate
    var w = block.width / SIZE_ONE_BLOCK;
    var h = block.height / SIZE_ONE_BLOCK;
    w = getCenterOfAnchor(w);
    if( getBlockFlip(block) === 1)
        w = 1 - w;
    h = getCenterOfAnchor(h);
    block.anchor.setTo(w, h);
    // allow input
    block.inputEnabled = true;
    // allow drag
    block.input.enableDrag(false, true);
    // SIZE_ONE_BLOCK
    //block.input.enableSnap(SIZE_ONE_BLOCK, SIZE_ONE_BLOCK, false, true);

    // events
    block.events.onDragStart.add(onDragStart, this);
    block.events.onDragUpdate.add(onDragUpdate, this);
    block.events.onDragStop.add(onDragStop, this);
    block.events.onInputDown.add(onInputDown, this);
    block.events.onInputUp.add(onInputUp, this);

    // input work as perfectly pixel clicked
    block.input.pixelPerfectOver = true;
    //block.input.useHandleCursor = true;

    return block;
}

var dragMovement;
function onDragStart(block, pointer) {
    //console.log('onDragStart');
    dragMovement = 0;
}

function onDragUpdate(block, pointer) {    
    //console.log('onDragUpdate block X:' + block.x + ' Y:' + block.y);
    dragMovement += 1;

    if (shadow !== 0) {
        beforeX = shadow.x;
        beforeY = shadow.y;
        shadow.x = GetPosShadow(block.x);
        shadow.y = GetPosShadow(block.y);
        
        if (shadow.x == beforeX
            && shadow.y == beforeY)
        {
            return;
        }

        if (CheckOverlappedBlock(shadow, blockList)) {
            shadow.x = beforeX;
            shadow.y = beforeY;
        }
        // log
        //var shadowPos = getBlockPos(shadow);
        //console.log('shadow:'+shadow.x + ' ' + shadow.y + ' ' + shadowPos.x + ' ' + shadowPos.y);
    }
}

function GetPosShadow(blockPos) {
    var diff = blockPos % SIZE_ONE_BLOCK;
    if (diff < SIZE_ONE_BLOCK / 2) {
        return blockPos - diff;
    }
    else {
        return blockPos + SIZE_ONE_BLOCK - diff;
    }
}

function onDragStop(block, pointer) {
    //console.log('onDragStop');
    dragMovement = 0;
}

function onInputDown(block, pointer) {
    /*
    if( blockList[lastBlockToTop].key !== block.key)
    {
        block.input.enabled = false;
        return;
    }
    */
    //console.log('onInputDown : '+block.key);
    // shadow
    shadow = game.add.sprite(0, 0, block.key);
    shadow.alpha = 0.5;
    shadow.angle = block.angle;
    shadow.scale = block.scale;
    shadow.anchor.setTo(block.anchor.x, block.anchor.y);
    shadow.x = block.x;
    shadow.y = block.y;
}

function rotateBlock(block){
    //console.log('rotate');
    if (shadow !== 0) {
        beforeX = shadow.x;
        beforeY = shadow.y;
        shadow.x = GetPosShadow(block.x);
        shadow.y = GetPosShadow(block.y);
        shadow.angle += 90;
        if (CheckOverlappedBlock(shadow, blockList)) {
            shadow.x = beforeX;
            shadow.y = beforeY;
            shadow.angle -= 90;
        }
        else {
            block.angle += 90; // rotate
        }
    }
}

function onInputUp(block, pointer) {
    //console.log('onInputUp');
    if (dragMovement <= 2) {
        rotateBlock(block);
    }

    if (shadow !== 0) {        
        block.x = shadow.x;
        block.y = shadow.y;
        shadow.kill();
        shadow = 0;
    }
}