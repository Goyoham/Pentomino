
LOGIN_TYPE = {None: 0, Facebook: 1, Google: 2};

function Utils(){

}

_utils = new Utils();

Utils.prototype.randomRange = function(n1, n2) {
  return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
}

Utils.prototype.inArray = function(arr, val){
	var len = arr.length;
	for(var i = 0; i < len; ++i){
		if( arr[i] === val )
			return true;
	}
	return false;
}

Utils.prototype.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};