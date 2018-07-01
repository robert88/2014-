/*
*电子特殊需求
*最小化的时候关闭电子书中所有动画
*/
	try{
		function browserVisibilitychange(flag){
				$("iframe").each(function(){
					try{
						var aniObj = this.contentWindow.RBT.resize.aniObj;
						if(aniObj){
							if(flag){
								if(aniObj.status==="pause"){
									aniObj.startAnimate();
								}
							}else{
								if(aniObj.status==="play"){
									aniObj.pauseAnimate();
								}
							}						
						}
	
					}catch(e){
						showAlert(e);
					}
				})
		}
	}catch(e){
	;
	}
/*
*load iframe
*/
try{
	;(function(){
		//缓冲加载计时和检测uidata计时
		var timer1 = [];
		var timer2 = [];
		//检测uidata计时并且

		function getUiData($iframe,idx){

			var uidata = RBT.localStorage.getItem("uidata"),
				regStr = "\\s*(-?\\d+\\.?\\d+)\\s*",
				round = Math.round;
			if(uidata){
				clearTimeout(timer2[idx]);
				RBT.alert.hide(idx);
				if((new RegExp("width:"+regStr+"height:"+regStr+"x:"+regStr+"y:"+regStr)).exec(uidata)){
					var width = round( RegExp["$1"]*10.24 ),
						height = round( RegExp["$2"]*15.36 ),
						x = round( RegExp["$3"]*10.24 ),
						y = round( RegExp["$4"]*15.36 );

					$iframe.css({
						width : width + "px",
						height : height + "px",
						left : x + "px",
						top : y + "px",
						zIndex: "1"
					}).show();	
					RBT.localStorage.removeItem("uidata");
				}
			}else{
				timer2 = setTimeout(function(){
					getUiData($iframe,idx);
				},17);
			}

		}

		//单击加载
		$(".iframe").bind("click", function(e) {

			RBT.localStorage.removeItem("uidata");

			var $this = $( this ),
				idx = 0,
				$body =  $("body"),
				$iframe,
				len,
				uidata;

			if(/RBTLoadIframe(\d+)/g.exec($this.attr("class"))){
				idx = RegExp["$1"];
			};

			iframes = ["<iframe frameborder='0' scrolling='no' src='iframe/",
						(idx*1+1),
						"/index.html' id='RBTnewIframe",
						idx,
						"' style='position:absolute; display:none;'></iframe>"
					].join("");

			$iframe = $body.find("#RBTnewIframe"+idx);

			len = $iframe.length;

			if( len === 0 ){
				
				$this.css("z-index","1001");
					RBT.alert.show({
						src:"commonCss/loading.gif",
						x:parseInt($this.css("left"),10)||0 + $this.width(),
						y:parseInt($this.css("top"))||0 + $this.height(),
						id:idx
					});
				
				$iframe = $body.append(iframes).find("#RBTnewIframe"+idx);	
				getUiData($iframe,idx);
			}else{
				$this.css("z-index","1");
				$iframe.remove();
				clearTimeout(timer1[idx]);
				RBT.alert.hide(idx);
			}
		});


	}());
}catch(e){
	alert(e);
}