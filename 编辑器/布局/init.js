$(document).ready(function(){
	$("#selectPath").bind("change",function(){
		g_imgPath = $(this).val();
	})
	var step0 = ["<div id='drop_zone'>",
		"添加背景图(拖动到页面内，或者通过按钮选择)",
		"</div><input type='file' id='getBg' onchange='handleFileSelect(event)'>"
	].join("");
	
	if(window.File && window.FileReader && window.FileList && window.Blob) {  
		$(".showlayout").html("<span style='color:#008000'>Great success! All the File APIs are supported.</span>");  
	} else {  
		$(".showlayout").html('<span style="color:red">The File APIs are not fully supported in this browser.</span>');  
	}
	
	$("body").append("<div class='step0'>" + step0 + "</div>");
	var move = {x:0,y:0}
	//ie 暂时不考虑 attachEvent
	document.addEventListener('dragover', handleDragOver, false);
	document.addEventListener('drop', handleFileSelect, false);
	
	$(".showlayout,.kuang").bind("mousedown",function(e){
			e.stopPropagation();
			e.preventDefault();
			
			g_mousedown = true;
			var x =e.pageX, y = e.pageY;

			if(e.target != $(".kuang")[0]){	
				$(".kuang").css("top",y+"px");
				$(".kuang").css("left",x+"px");
				afterSlecte();
			}
			
			var oldL=parseInt($(".kuang").css("left"),10)||0,
				oldT=parseInt($(".kuang").css("top"),10)||0;
			
			g_DownX=x;
			g_DownY=y;
			
			$(".kuang").data("evt", e.target).data("oldleft", oldL).data("oldtop", oldT);

	});
	$(document).bind("mousedown",function(e){
			var x=e.pageX,
				y=e.pageY;
			g_DownX=x;
			g_DownY=y;
	})
	.bind("mousemove",function(e){
			var x=e.pageX,
				y=e.pageY;

			if( g_mousedown && g_cut ){	
			
				//如果是选中了框，移动框
				if( $(".kuang").data("evt") === $(".kuang")[0] ){
					$(".kuang").css({
						left:(x-g_DownX+$(".kuang").data("oldleft"))+"px",
						top:(y-g_DownY+$(".kuang").data("oldtop"))+"px"
					});
					
				//如果是选中了框，改变框的大小
				}else{
					$(".kuang").css({
						width:(x-g_DownX)+"px",
						height:(y-g_DownY)+"px"
					});
				}
			}
	}).bind("mouseup",function(e){
			var x=e.pageX;
			var y=e.pageY;
			var $kuang = $(".kuang");
			var left = parseInt($kuang.css("left"),10);
			var top = parseInt($kuang.css("top"),10);
			var width = $kuang.width();
			var height = $kuang.height();
			if(g_mousedown){
				g_mousedown=false;	
				if(height){
					$(".queding").css({left:(left+width)+"px",top:(top+height)+"px"}).show();									
					$(".quxiao").css({left:(left+width+40)+"px",top:(top+height)+"px"}).show();	
					$(".qiege").css({left:(left+width+80)+"px",top:(top+height)+"px"}).show();	
				}				
			}
	
	//添加微调功能
	}).bind("keydown",function(e){

		switch(e.keyCode){
		
			//enter +
			case 13:
				$(".queding").trigger("click");
			break;

			//right +
			case 39:
				if( e.shiftKey){

					var $kuang = $(".kuang"),
						x = parseInt($kuang .css("left"),10)||0;
							
					$kuang .css("left",( x + 1 ) + "px");
				}
			break;
			
			//left -
			case 37:
				if( e.shiftKey){
					var $kuang = $(".kuang"),
						x = parseInt($kuang .css("left"),10)||0;
					$kuang .css("left",( x - 1 ) + "px");
				}
			break;	
			
			//top -
			case 38:
				if( e.shiftKey){
					var $kuang = $(".kuang"),
						y = parseInt($kuang .css("top"),10)||0;
					$kuang .css("top",(y - 1 ) + "px");
				}
			break;

			//down +
			case 40:
				if( e.shiftKey){
					var $kuang = $(".kuang"),
						y = parseInt($kuang .css("top"),10)||0;
					$kuang .css("top",(y + 1 ) + "px");
				}
			break;
		}
	});
	
	$(".queding").on("click",function(e){
			var w, h, x, y, $kuang = $(".kuang"),
				w=$kuang.width();
				h=$kuang.height();
				x=$kuang.offset().left;
				y=$kuang.offset().top;					
				//偶数化
				w = w % 2 ?(w+1) : w;
				h = h % 2 ?(h+1) : h;
				x = x % 2 ?(x+1) : x;
				y = y % 2 ?(y+1) : y;
				creatHTML( e, w, h, x, y )

	});	
	$(".qiege").on("click",function(e){
			var w, h, x, y, $kuang = $(".kuang"),
				w=$kuang.width();
				h=$kuang.height();
				x=$kuang.offset().left;
				y=$kuang.offset().top;					
				//偶数化
				w = w % 2 ?(w+1) : w;
				h = h % 2 ?(h+1) : h;
				x = x % 2 ?(x+1) : x;
				y = y % 2 ?(y+1) : y;
				cutImage( e, w, h, x, y )

	});	
	$(".quxiao").bind("click",function(e){
			afterSlecte();

	});
	$(".showinfo").bind("mousedown",function(e){
		var panelLi = /panel(\d+)/g.exec(e.target.className),
			downIdx,
			getTime =+ new Date();
			
		if(panelLi){
			downIdx = panelLi[1];
		}
		
		$(this).data("downTime",getTime).data("downIdx", downIdx);
	}).bind("mouseup",function(){
		var $this = $(this),
			downTime =  $this.data("downTime"),
			upTime = + new Date();
			
		if((upTime - downTime) > 1000){
			var idx = $this.data("downIdx");
			alert(idx)
			if(typeof idx !== "undefined"){
				$this.find(".panel" + idx).addClass("border");
				g_insertBody = ".panel" + idx;
			}
			
		}
	})
});
