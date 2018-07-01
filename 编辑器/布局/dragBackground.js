	function handleFileSelect(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var files;
		if(evt.dataTransfer){
			files = evt.dataTransfer.files; 
		}else{
			files=evt.target.files;
		}
		//alert(window.location.search);
		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
			output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
						f.size, ' bytes, last modified: ',f.lastModifiedDate.toLocaleDateString(),
						f.lastModifiedDate.toLocaleTimeString(), '</li>');
			var reader = new FileReader();  
			reader.onload = (function(theFile) {
					return function(e) {
						showCutBg(theFile.name);
					}
			})(f);	 	
			reader.readAsDataURL(f); 
		}
	}  
	
	//window.requestFileSystemopacity   = window.requestFileSystem | | window.webkitRequestFileSystem ;
	function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		
		// Explicitly show this is a copy.
		evt.dataTransfer.dropEffect = 'copy'; 
	}
	
	function showCutBg( name ){
		g_imgName = name;
		var img = [
			'<img class="thumb" src="',
			escape(g_imgPath+g_imgName),
			'" title="', 
			escape(g_imgName),
			'"/>'
		].join('');
		
		$(".showlayout").html("");
		
		$(".step0").html("").append(img);
		
		$(".thumb").hide().bind("load",function(){
			var $img = $(".thumb"),
				xload = $img.css("width"),
				yload = $img.css("height");
				
			$(".showlayout").css({
				width : xload,
				height : yload ,
				backgroundImage : "url("+escape(g_imgPath+g_imgName)+")"
			});
			$("body").append("<div class='getBgSize'  style='position:absolute;left:"+xload+";top:"+yload+"'>getbg</div>")
			//console.log($(".showlayout").css("background-image"));	
			
			g_cut=true;
			$(".getBgSize").on("click",function(e){
				var $layout = $(".showlayout"),
					w = $layout.width(),
					h = $layout.height(),
					x = $layout.offset().left,
					y = $layout.offset().top;		
				
				creatHTML(e, w, h, x, y);
			});	
		});
	}
