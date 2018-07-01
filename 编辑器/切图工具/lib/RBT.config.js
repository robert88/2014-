
;(function(){

		window.RBT = window.RBT || {};
		RBT.config = function(str){

			str = str.replace(/\s+/g,"");
			var attr = str.split("."),
				len = attr.length,
				parent = RBT,
				illegal,
				isObj;

			for(var i=0; (( attr.length>0 )&&( i<len )); i++){

				illegal = /[^\w\$]/g.test( attr[0] );

				if( ( !attr[0] ) || ( attr[0] === "RBT" ) || illegal ){

					if( illegal ){
						alert( "'" + attr[0] + "' Illegal named!");
					}
					attr.shift();
					continue;
				}


				if( parent[ attr[0] ] ){
					
					isObj = typeof parent[ attr[0] ] !== "object";
					
					if( isObj ){
						alert("'" + attr[0] + "' is exsit and not object");
						parent[ attr[0] ] = {};
					}else{
						if( window.console ){
							console.log("'" + attr[0] + "' is exsit");
						}						
					}
				}else{
					parent[ attr[0] ] = {};
				}

				parent = parent[ attr[0] ];
				attr.shift();
			}
			return parent;
		}

	})();