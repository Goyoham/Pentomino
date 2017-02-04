
function PatternData(){

}

patternData = new PatternData();

PatternData.prototype.patterns = {};
PatternData.prototype.patternsByLevel = {};

var _getRandomPropertyObj = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[keys.length * Math.random() << 0]];
};

var _getRandomPropertyArr = function (arr) {
    return arr[arr.length * Math.random() << 0];
};

var _getSizeFromStr = function(sizeStr){
    var split = sizeStr.split('x');
    return {width: split[0], height: split[1]};
}

PatternData.prototype.ReadData = function(){
    var numSize = 0;
    var numBlockList = 0;
    var numPatterns = 0;

    var currSize = '0x0';
    var currBlocks = '0';
    for(var i in this.data){
        var line = this.data[i];
        if( line.includes('>>') ){
            if( numSize !== 0 ){
                console.log('currSize : ' + currSize);
                console.log('numBlockList : ' + numBlockList);
                console.log('numPatterns : ' + numPatterns);
                numBlockList = 0;
                numPatterns = 0;
            }
            ++numSize;
            line = line.replace(/>/gi,'');
            currSize = line;
            if( !this.patterns.hasOwnProperty(currSize) ){
                this.patterns[currSize] = {};
                this.patternsByLevel[currSize] = [];
            }
        }
        else if( line.includes('>') ){
            ++numBlockList;
            line = line.replace(/>/gi,'');
            currBlocks = line;
            if( !this.patterns[currSize].hasOwnProperty(currBlocks) ){
                this.patterns[currSize][currBlocks] = [];
                
                var pbl = {
                    currBlocks: currBlocks
                    , numOfAnswer: 0
                };
                this.patternsByLevel[currSize].push(pbl);
            }
        }
        else{
            ++numPatterns;
            line = line.replace(/_/gi,'');
            this.patterns[currSize][currBlocks].push(line);
            //console.log(line);

            var lastIndex = this.patternsByLevel[currSize].length-1;
            this.patternsByLevel[currSize][lastIndex].numOfAnswer++;
        }
    }
    //console.log(this.patterns);

    // sort
    for(var size in this.patternsByLevel){
        this.patternsByLevel[size].sort(function (l, r){
            return l.numOfAnswer < r.numOfAnswer ? 1 : l.numOfAnswer > r.numOfAnswer ? -1 : 0;
        });
    }
    //console.log(this.patternsByLevel);
}

PatternData.prototype.minLevel = 0;
PatternData.prototype.nowLevel = 0;
PatternData.prototype.playLevel = 0;
PatternData.prototype.UpdateNextLevel = function(){
    ++this.playLevel;
    console.log('playLevel : ' + this.playLevel);
}

PatternData.prototype.getRandomPattern = function(){
    var randomPattern = {};
    var sizekeys = Object.keys(this.patterns)
    this.nowLevel = this.playLevel < sizekeys.length-1 ? this.playLevel : sizekeys.length-1;
    //this.nowLevel = ( (maxLevel-this.minLevel) * Math.random() << 0 ) + this.minLevel;
    var sizeRanKey = sizekeys[this.nowLevel];
    var size = _getSizeFromStr(sizeRanKey);
    console.log('NowLevel : ' + this.nowLevel);

    var blockkeys = Object.keys(this.patterns[sizeRanKey])
    var blockRanKey = blockkeys[blockkeys.length * Math.random() << 0];
    
    randomPattern.width = size.width;
    randomPattern.height = size.height;
    randomPattern.blockList = blockRanKey;
    randomPattern.hint = this.makeHint(size.width, _getRandomPropertyArr(this.patterns[sizeRanKey][blockRanKey]));
    randomPattern.blockListMap = this.makeBlockListMap(blockRanKey, randomPattern.hint);
    return randomPattern;
}

PatternData.prototype.getPattern = function(gameType){
    var randomPattern = {};
    var size = _getSizeFromStr(gameType);
    console.log('gameType : ' + gameType);

    var blockkeys = Object.keys(this.patterns[gameType])
    var blockRanKey = blockkeys[blockkeys.length * Math.random() << 0];
    
    randomPattern.width = size.width;
    randomPattern.height = size.height;
    randomPattern.blockList = blockRanKey;
    randomPattern.hint = this.makeHint(size.width, _getRandomPropertyArr(this.patterns[gameType][blockRanKey]));
    randomPattern.blockListMap = this.makeBlockListMap(blockRanKey, randomPattern.hint);
    return randomPattern;
}

PatternData.prototype.makeHint = function(width, blockArray){
    var result = '';
    for(var i in blockArray){
        result += blockArray[i];
        var index = i*1+1;
        if( index % width === 0 && index != blockArray.length )
            result += '_';
    }
    return result;
}

PatternData.prototype.makeBlockListMap = function(blockList, hint){
    var split = hint.split('_');
    var _getForm = function(split, type){
        var lenY = split.length;
        var lenX = split[0].length;
        var maxX = 0, minX = lenX;
        var maxY = 0, minY = lenY;
        for(var y = 0; y < lenY; ++y){
            for(var x = 0; x < lenX; ++x){
                if( split[y][x] === type ){
                    if( y < minY ) minY = y;
                    else if( y > maxY ) maxY = y;
                    if( x < minX ) minX = x;
                    else if( x > maxX ) maxX = x;
                }
            }
        }
        var form = [];
        for(var y = minY; y <= maxY; ++y){
            var line = [];
            for(var x = minX; x <= maxX; ++x){
                if( split[y][x] === type )
                    line.push(1);
                else
                    line.push(0)
            }
            form.push(line);
        }
        return form;
    }

    var blockListMap = [];
    for(var i in blockList){
        var blockType = blockList[i];
        var state = {};
        state.type = blockType;
        state.flip = 0;
        state.rotation = 0;

        // get form from split
        var form = _getForm(split, blockType);
        var state = blockMgr.getBlockStateFromForm(form, blockType);

        blockListMap.push(state);
    }
    return blockListMap;
}

PatternData.prototype.data = [
'>>5x3',//15
'>FPU',
'PPFUU_PPFFU_PFFUU',
// '>>20x3',
// '>FILNPTUVWXYZ',
// 'VVVZWWTTTFLLLLPPPXUU_VZZZYWWTFFFNNLPPXXXU_VZYYYYWTFNNNIIIIIXUU',
// 'VVVNNNFTWYYYYZPPPXUU_VLNNFFFTWWYZZZPPXXXU_VLLLLFTTTWWZIIIIIXUU',
];