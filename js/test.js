

var list = {};
var k = 10;
if( k in list )
	console.log('true');
else
	console.log('false');
if( list.hasOwnProperty(k) )
	console.log('true');
else
	console.log('false');
list[k] = 10;
if( k in list )
	console.log('true');
else
	console.log('false');
if( list.hasOwnProperty(k) )
	console.log('true');
else
	console.log('false');
console.log('end');