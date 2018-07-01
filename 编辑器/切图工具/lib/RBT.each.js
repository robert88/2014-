;(function(){
	window.RBT = window.RBT || {};
	
	RBT.each = function( str, fn ){
		if( str.constructor === Array && Array.prototype.forEach ){
			str.forEach( fn )
		}else if( str.length ){
			for( var i=0; i<str.length; i++ ){
				if( fn.call( this, str[i], i ) ){
					break;
				}
			}
		}

	}

})();