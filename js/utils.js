
function Utils(){

}

var utils = new Utils();


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