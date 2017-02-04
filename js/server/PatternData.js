
var fs = require('fs');
function PatternData(){}
_patternData = new PatternData();

PatternData.prototype.data = [];
PatternData.prototype.patterns = {};
PatternData.prototype.patternsByLevel = {};
PatternData.prototype.NumOfPattern = {}; // size당 pattern 수 데이터
PatternData.prototype.TotalNumOfPattern = 0; // 전체 pattern 수

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

PatternData.prototype.Init = function(){
    this.ReadFile();
    this.ReadData();
}

PatternData.prototype.ReadFile = function(){
    this.data = [];
    var readList = [
        '5x3',  '5x4',  '5x5',  '6x5',
        '7x5',  '8x5',  '9x5',  '10x3',
        '10x4', '10x5', '10x6', '11x5',
        '12x5', '15x3', '15x4', //'20x3',
    ];

    for(var n in readList)
    {
        var file = fs.readFileSync('./data/'+readList[n]+'.txt', 'utf8');
        var lines = file.split('\r\n');
        for(var i in lines){
            if(lines[i].length == 0)
                break;
            this.data.push(lines[i]);
        }
    }
}

PatternData.prototype.ReadData = function(){
    var numSize = 0;
    var numBlockList = 0;
    var numPatterns = 0;

    var currSize = '0x0';
    var currBlocks = '0';
    console.log('-- start -------------------');
    for(var i in this.data){
        var line = this.data[i];
        if( line.includes('>>') ){
            if( numSize !== 0 ){
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
            this.NumOfPattern[currSize] = numPatterns;
        }
    }
    //console.log(this.patterns);

    // sort
    for(var size in this.patternsByLevel){
        this.patternsByLevel[size].sort(function (l, r){
            return l.numOfAnswer < r.numOfAnswer ? 1 : l.numOfAnswer > r.numOfAnswer ? -1 : 0;
        });
    }

    var num = 1;
    for(var i in this.NumOfPattern){
        console.log(num++ + ')\t' + i + '\t' + this.NumOfPattern[i]);
        this.TotalNumOfPattern += (this.NumOfPattern[i]*1);
    }
    console.log('TotalNumOfPattern : ' + this.TotalNumOfPattern);
    console.log('-- end -------------------');
}

PatternData.prototype.nowLevel = 0;
PatternData.prototype.playLevel = 0;
PatternData.prototype.getRandomPattern = function(){
    var randomPattern = {};
    var sizekeys = Object.keys(this.patterns)
    this.nowLevel = this.playLevel < sizekeys.length-1 ? this.playLevel : sizekeys.length-1;
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

    var blockkeys = Object.keys(this.patterns[gameType])
    var blockRanKey = blockkeys[blockkeys.length * Math.random() << 0];
    
    randomPattern.width = size.width;
    randomPattern.height = size.height;
    randomPattern.blockList = blockRanKey;
    randomPattern.hint = this.makeHint(size.width, _getRandomPropertyArr(this.patterns[gameType][blockRanKey]));
    randomPattern.blockListMap = this.makeBlockListMap(blockRanKey, randomPattern.hint);
    return randomPattern;
}

PatternData.prototype.GetNumOfPattern = function(sizeStr){
    if( !this.NumOfPattern.hasOwnProperty(sizeStr) )
        return 0;
    return this.NumOfPattern[sizeStr];
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