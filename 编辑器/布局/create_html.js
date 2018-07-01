		//提交之后矩形参考线归0
		function afterSlecte(){
					$(".queding").hide();
					$(".quxiao").hide();
					$(".qiege").hide();
					$(".kuang").css({width:"0px", height:"0px"})
		}
		function getParentPosition(elem){
			var x = 0, y = 0,
				parent = elem.parentNode;
				while(parent){
				
					if(parent.style.position === 'absolute' || parent.style.position === 'relative'){
						x += $(parent).offset().left;
						y += $(parent).offset().top;
					}
				}
				return {x : x, y : y}
		}
		function creatHTML(e, w, h, x, y){
			var  len,
				covers = [],
				panels = []
				liStr = [],
				temp_css = [],
				temp_css_position = "",
				src = escape( g_imgPath + g_imgName ),
				tab = "\t",
				enter = "\n";
			
			//获取网页名称
			var reg = /PAGE_(\d{4}).jpg/.exec( g_imgName );
			g_pageIdx = "page"+((reg&&reg[1])||"0000");

			//基本架构
			var ui=["<div id='bg_1024'>",
				enter + tab + tab + tab,
				"<div class='hide uidata'></div>",
				enter + tab + tab + tab,
				"<div class='ui'></div>",
				enter + tab + tab + tab,
				"<div class='btn_ctl play'></div>",
				enter + tab + tab,
				"</div>"
			].join("");
			
			//添加到网页中变化成dom格式
			if($(".outHtml").html()==""){
				$(".outHtml").html(ui);
			}
			
			if(($("#bg_1024.bg").length>0)&&(newWindow)&&(!newWindow.closed)){

				len = Math.round($("#bg_1024 .ui div").length/2);
				
				if( confirm( len ) ){
				
						//添加css样式
					temp_css.push(
						tab,
						"#bg_1024 .p"+len+"{",
						"left:" + ( x - g_offsetx ) + "px;",
						"top:" + ( y - g_offsety ) + "px;",
						"width:" + w + "px;",
						"height:" + h + "px;",
						"}" + enter
					);
					for(var i = 0; i<len+1; i++){
						temp_css_position += ".p"+i+",";
					}
					
					g_css[0] = [
						enter + tab + "*{margin:0px;padding:0px;}" + enter,
						tab + ".hide{display:none;}" + enter,
						tab + ".cover{background:#fff;}" + enter,
						tab + "#bg_1024.bg,#bg_1024 .bg{background-image:url(" + src + ");}" + enter,
						tab + "#bg_1536.bg,#bg_1536 .bg{background-image:url(" + src.substr(0,src.indexOf(".jpg")) + "_150.jpg);}" + enter,
						tab + "#bg_2048.bg,#bg_2048 .bg{background-image:url(" + src.substr(0,src.indexOf(".jpg")) + "_200.jpg);}" + enter,
					].join("");
					
					g_css[1] = (tab + temp_css_position+".btn_ctl{position:absolute;}" + enter);
					g_css.push( temp_css.join("") );

					covers.push(
					
						//after 会将其后面的回车之前插入
						enter + tab + tab + tab+ tab,
						"<div class='p" + len + " cover'></div>"
					);

					var tempCover  = $("#bg_1024 .ui").find(".cover");
					if(tempCover.length > 0){
						tempCover.eq(tempCover.length-1).after( covers.join(""));
					}else{
						$("#bg_1024 .ui").append(covers.join(""));
					}
					
					panels.push(
						"<div class='hide bg p" + len + " panel" + len + "'",
						" style='background-position:-" + x + "px -" + y + "px;'></div>",
						enter + tab + tab + tab
					);
					
					var tempanel  = $("#bg_1024 .ui").find(".bg");
					if( tempanel.length > 0 ){
					
						//tab 是最后添加的3个tab所以这个就必须补充一个tab
						$("#bg_1024 .ui").append( tab + panels.join("") );
					}else{
						$("#bg_1024 .ui").append(enter + tab + tab + tab + tab + panels.join("") );
					}
					
					
					liStr.push(
						"zoom:0.5;",
						"background-image:url(" + src + ");",
						"background-position:-" + x + "px -" + y + "px;",
						"",
						"width:" + w + "px;",
						"height:" + h + "px'"
					);
					
					//插入选中符顺便把边框去除
					$(".showinfo").append("<li class='panel" + len + "' style='"+liStr.join("")+"'> class='panel"+len+"'</li>").find(".border").removeClass("border");
				}

			}else{
			
				$("#bg_1024").css({
					width : w + "px",
					height : h + "px",
					overflow : "hidden",
					backgroundPosition : "-" + x + "px -" + y + "px"
				}).addClass("bg");

				$(".uidata").html(
					[
						"width: " + ( 100*w/1024 ) + " ",
						"height: " + ( 100*h/1536 ) + " ",
						"x: " + ( 100*x/1024 ) + " ",
						"y: " + ( 100*y/1536 ) + " "
					].join("")
				);

				g_offsetx = x
				g_offsety = y;
				
				$(".showinfo li").css({
					backgroundImage : "url(" + src + ")",
					backgroundPosition : "-" + x + "px -" + y + "px",
					width : w + "px",
					height : h + "px",
					zoom : 0.5
				}).html("class=bg_1024");;

			}
			
			g_ui=$(".outHtml").html();
			afterSlecte();
			checkNewWindow(w,h,src);
	}
	
	function makeNewWindow(w,h){
		newWindow = window.open("page.html","newWindow","height="+h+",width="+w+",scrollbars=yes,toolbar=yes,menubar=yes,titlebar=yes");
	}
	
	function checkNewWindow(w,h,src){
		// 测试调试窗口是否存在
		var tab = "\t",
			enter = "\n";
		if((!newWindow)||(newWindow.closed)){
			makeNewWindow(w,h);
			window.onbeforeunload = function (e){ 
					e = e || window.event;
					
					if((e.clientX>window.document.body.clientWidth) && (e.clientY < 0) || e.altKey){ 
						return "是否关闭文件";
					}else{ 
						return e.clientX+" "+window.document.body.clientWidth+" "+e.clientY+ " "+e.altKey; 
					} 
					
			}

			//debugger;
			var newContent = [];
			newContent.push(
				"<!DOCTYPE html><html><head>" + enter,
				"<meta http-equiv='content-Type' content='text/html;charset=utf-8'>" + enter,
				"<title>" + g_pageIdx + "</title>" + enter,
				"<link href='../../commonCss/common.css' rel='stylesheet' type='text/css' />" + enter,
				"<script type='text/javascript' src='../../commonJs/jquery-1.9.1.min.js'></script>" + enter,
				"<script type='text/javascript' src='../../commonJs/jquery-ui-1.10.3.custom.min.js'></script>" + enter,
				"<script type='text/javascript' src='../../commonJs/jquery.ui.touch-punch.js'></script>" + enter,
				"<script type='text/javascript' src='../../commonJs/RBT.browser.js'></script>" + enter,
				"<script type='text/javascript' src='../../commonJs/RBT.style.js'></script>" + enter,
				"<script type='text/javascript' src='../../commonJs/RBT.alert.js'></script>" + enter,
				"<script type='text/javascript' src='../../commonJs/RBT.localStorage.js'></script>" + enter,
				"<script type='text/javascript' src='../../commonJs/RBT.resize.js'></script>" + enter,
				"<style>" + enter,
					tab + "*{margin:0px;padding:0px;}" + enter,
					tab + ".hide{display:none;}" + enter,
					tab + "#bg_1024.bg,#bg_1024 .bg{background-image:url(" + src + ");}" + enter,
				g_css.length > 0 ? tab + g_css.join("") + enter : "",
				tab + ".btn_ctl{left:0px;top:0px;}" + enter,
				"</style><head>" + enter,
				"<body>" + enter,
					tab + "<div class='" + g_pageIdx + "'>" + enter,
						tab + tab + g_ui + enter,
					tab + "</div>" + enter,
				"</body></html>"
			);
			newWindow.document.write(newContent.join(""));
		}else{
			newWindow.document.getElementsByClassName(g_pageIdx)[0].innerHTML="";
			newWindow.document.getElementsByClassName(g_pageIdx)[0].innerHTML =enter + tab + tab + g_ui + enter;
			newWindow.document.getElementsByTagName("style")[0].innerHTML = g_css.join("") + enter;
		}

	}
