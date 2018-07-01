

/*
	AUTHOR : robert
	GLOBAL : 全局模块 RBT 对外接口 ui.select.get,全局数据ui.select.data
	RETURN : RBT.dom的实例
	DEPENDENCE : RBT.each RBT.ui.style
*/

;(function(){
	
	window.RBT = window.RBT||{};
	var dom = RBT.dom,
		style = RBT.ui.style,
		ui = RBT.namespace("RBT.ui.select");
//console.log(style)
	//ui依赖于
	function createUI( context, kuang ){
		if(!kuang.dom.length ){
			dom( context ).append([
				"<div class='kuang' style='",
				"position:absolute;",
				style.opacity(0.5),
				style.border("1px solid red","2px"),
				"'></div>"
			].join(""));
			kuang.dom = dom(".kuang").hide();
		}
	}
	
	ui.data = {
		x : 0,
		y : 0,
		w : 0,
		h : 0
	}
	
	ui.get = function( context, start, end ){
		
		var data = ui.data;
		
		var g_mouseDown = false;
		
		
		var kuang = {
			dom:dom(".kuang"),
			move:false,
			dx:0,
			dy:0
		}
		
		context = context || document.body;
			
		createUI(context,kuang);
		
		var downx = 0;
		var downy = 0;
		
		var show = true; 
		dom(context).bind("mousedown",function(e){
	
			var x = e.pageX,
				y = e.pageY;
				
			g_mouseDown = true;
			data.h = data.w = 0;
			
			kuang.dom.css({left:x+"px",top:y+"px",width:"0px",height:"0px"});
			
			//记录按下的坐标
			data.x = downx = x;
			data.y = downy = y;
			
			if(show){
				show = false;
				kuang.dom.show();
			}
			if(typeof start === "function"){
				start( e );
			}
			
		})
		
		dom(".kuang").bind("mousedown,touchstart",function(e){
			
				g_mouseDown = true;
				kuang.move = true;
				kuang.dx = parseInt(kuang.dom.css("left"),10)||0;
				kuang.dy = parseInt(kuang.dom.css("top"),10)||0;
	
		});
		
		var oldx = 0;
		var oldy = 0;
		dom(document).bind("mousemove",function(e){

				if( g_mouseDown ){
					var x=e.pageX,
						y=e.pageY;
					var movex = x - oldx;
					var movey = y - oldy;
			

					if( kuang.move ){
						data.x = movex+kuang.dx;
						data.y = movey+kuang.dy;
						kuang.dom.css({
							left : data.x + "px",
							top : data.y + "px"
						});
					}else{
						
						var w = x - downx;
						var h = y - downy;

						if(w<0){
							data.x = x;
							kuang.dom.css({
								left:x+"px"
							});
						}
						
						if(h<0){
							kuang.y = y;
							kuang.dom.css({
								left:y+"px"
							})
						}
						data.w = Math.abs(w);
						data.h = Math.abs(h);
						kuang.dom.css({
							width : data.w + "px",
							height : data.h + "px"
						});
					}
				
					oldx = x;
					oldy = y;
				}

		}).bind("mouseup",function(e){
	
				if(g_mouseDown){
					g_mouseDown=false;
					kuang.move = false;
					//得到了数据
					if(typeof end == "function"){
						end( e );	
					}
			
				}
		});
	}
})();
