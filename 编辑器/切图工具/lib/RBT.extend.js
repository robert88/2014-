
;(function(){
	window.RBT = window.RBT || {};
	RBT.extend = function( ){
		var cope,deep,target,src;
		var len = arguments.length;
		var i = 0;
		if(len==1){
			target = this;
		}else{
			if(typeof arguments[0] === "boolean"){
				deep = true;
				target = arguments[1];
				i = 2;
			}else{
				target = arguments[0];
				i = 1;
			}
		}
		
		for(;i<len;i++){
			src = arguments[i];
			for(var j in src){
				if(deep&&(typeof src[j] ==="object")&&(!src[j].nodeType)){
					target[j] = arguments.callee(deep,target[j]||{},src[j])
				}else{
					target[j] = src[j];
				}
			}
		}
		return target;
	}
	
})();