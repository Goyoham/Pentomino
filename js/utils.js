

// get block type str
function getBlockType(key){
    if( typeof key === 'undefined')
    {
        console.log('undefined key');
        return;
    }
    var strArr = key.split('_');
    return strArr[strArr.length - 1];
}

function getBlockFlip(block){
    return block.scale.x > 0 ? 0 : 1;
}

function getBlockRotation(block){
    return ((block.angle + 360) / 90) % 4;
}

function getBlockState(block){
    var state = {};
    state.type = getBlockType(block.key);
    state.flip = getBlockFlip(block);
    state.rotation = getBlockRotation(block);
    return state;
}

function getBlockForm(block){
    var state = getBlockState(block);
    var form = blockForms[state.flip][state.rotation][state.type];
    return form;
}

// return (0~1). input: 1~N.
function getCenterOfAnchor(size) {
    return 0.5 + ((size % 2) * (1 / (size * 2)));
}

function getCenterPosOfBlock(block) {
    var lengthY = getBlockForm(block).length;
    var lengthX = getBlockForm(block)[0].length;
    var centerPos = {};
    centerPos.y = getCenterOfAnchor(lengthY) * lengthY;
    centerPos.x = getCenterOfAnchor(lengthX) * lengthX;
    return centerPos;
}

function IsOddX(block){
    return getBlockForm(block)[0].length % 2 === 1;
}
function IsOddY(block){
    return getBlockForm(block).length % 2 === 1;
}

function getBlockPos(block) {
    var pos = {};
    pos.x = Math.round(block.x / SIZE_ONE_BLOCK);
    pos.y = Math.round(block.y / SIZE_ONE_BLOCK);
    
    if( getBlockRotation(block) == 1){
        if( IsOddX(block) ) pos.x += 1;
    }
    else if( getBlockRotation(block) == 2){
        if( IsOddX(block) ) pos.x += 1;
        if( IsOddY(block) ) pos.y += 1;
    }
    else if( getBlockRotation(block) == 3){
        if( IsOddY(block) ) pos.y += 1;
    }
    
    return pos;
}

function getBlockPosList(block) {
    var blockPos = getBlockPos(block);
    var centerPos = getCenterPosOfBlock(block);

    var blockPosList = {};
    var lenY = getBlockForm(block).length;
    for(var y = 0; y < lenY; ++y){
        var lenX = getBlockForm(block)[y].length;
        for(var x = 0; x < lenX; ++x){
            if( getBlockForm(block)[y][x] !== 1 )
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

function CheckCollisionPosList(listA, listB){
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

function IsSameBlock(blockA, blockB){
    if (blockA.key !== blockB.key)
        return false;

    if (blockA.scale.x !== blockB.scale.x)
        return false;

    return true;
}

function CheckOverlappedBlock(myBlock, blockList) {
    var len = blockList.length;
    var myBlockPosList = getBlockPosList(myBlock);

    // log
    /*
    var blockPos = getBlockPos(myBlock);
    //console.log('pos : ' +myBlock.x+' '+myBlock.y);
    console.log('blockpos : ' +blockPos.x+' '+blockPos.y);
    console.log('roation : ' + getBlockRotation(myBlock));    
    console.log('lengthX : '+getBlockForm(myBlock)[0].length);
     for(var keyY in myBlockPosList){
        for(var keyX in myBlockPosList[keyY] ){
            console.log(keyY + ' ' + keyX);
        }
    }
    */
    // log

    // check over map
    for(var keyY in myBlockPosList){
        if( keyY < 0 || keyY >= (SCREEN_HEIGHT/SIZE_ONE_BLOCK) )
            return true;
        for(var keyX in myBlockPosList[keyY] ){
            if( keyX < 0 || keyX >= (SCREEN_WIDTH/SIZE_ONE_BLOCK) )
                return true;
        }
    }
    
    // check overlap
    for (var i = 0; i < len; ++i) {
        if (IsSameBlock(myBlock, blockList[i]))
            continue;

        if( CheckCollisionPosList(myBlockPosList, getBlockPosList(blockList[i])) )
            return true;
    }

    return false;
}