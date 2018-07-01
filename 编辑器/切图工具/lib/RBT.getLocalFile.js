;(function(){
	window.RBT = window.RBT || {};
	var g_file = RBT.namespace( "RBT.data.files" );
	var dom = RBT.dom;
	
	function selectByDropOrInput( e ){
		
			var files,
				output = [],
				reader,
				f;
	
		if( e.dataTransfer ){
			files = e.dataTransfer.files; 
		}else{
			files=e.target.files;
		}
				
		for (var i=0; f=files[i]; i++) {

			reader = new FileReader();
			//readAsBinaryString
			//readAsText()
			//readAsArrayBuffer
			
			g_file.lastModify = f.lastModifiedDate;
			g_file.name = f.name;
			g_file.type = f.type;
			g_file.relativePath = f.webkitRelativePath;
			g_file.size = f.size;
			

			reader.readAsDataURL( f );
			
			reader.onload = (function( theFile ) {
					return function( e ) {
						g_file.data = e.srcElement.result;
						if( typeof g_file.callback === "function" ){
							g_file.callback( g_file );
						}

					}
			})( f );
		}
	
	}
	function handleFileSelect( e ) {
		e.stopPropagation();
		e.preventDefault();
		if( document.domain ){
			selectByDropOrInput( e );
		}
	}
	
	function handleDragOver( e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy'; 
	}
	
	//单独分离this使用下面方法
	dom.prototype.getFile = function( fn ){
		
		//this表示RBT.$实例对象
		for(var i=0; i<this.length;i++){
			if(this[i].tagName === "INPUT"){
				
				//bind会处理数组对象
				this.bind.call([ this[i] ], "change", handleFileSelect)
			}else{
				this.bind.call([ this[i] ], "drop", handleFileSelect);
				this.bind.call([ this[i] ], "dragover", handleDragOver);
			}
		}

		g_file.callback = fn;
		return this;
		
	}
})();