//try{
	window.RBT = window.RBT ||{};

	;(function(){
	/*start*/

		var showID = 0;
		RBT.alert = {
			show:function(){
				var opt = {
					elem:null,
					src:"",
					x:400,
					y:300,
					width:0,
					height:0,
					id:showID,
					contain:$("body")
				}
				$.extend(opt, arguments[0]);
				
				if(opt.src){
					if((!opt.elem)||opt.elem.nodeType!==1){
						opt.elem = new Image();
					}
					opt.elem.src = opt.src;
				}

				if($("#RBT_ALERT_WORD"+opt.id).length === 0){

					RBT.sytle("#RBT_ALERT_WORD"+opt.id+"{ position:absolute;display:none;z-index:1002;left:"+opt.x+"px;top:"+opt.y+"px;}");
					opt.contain.append("<div id ='RBT_ALERT_WORD"+opt.id+"' ></div>");
					$("#RBT_ALERT_WORD"+opt.id).html(opt.elem);
					showID++;
				}

				$("#RBT_ALERT_WORD"+opt.id).css({left:opt.x,top:opt.y}).show();					
			},
			hide:function(id){
				id = id ||0;
				$("#RBT_ALERT_WORD"+id).hide();
			},
			getType:function(tar){
				if(tar.constructor === Array){
					return "array";
				}
				return typeof tar;
			},
			page:(function(){
				var body = document.documentElement || document.body;

				return {
					top:body.scrollTop,
					left:body.scrollLeft,
					width:self.innerWidth||body.clientWidth,
					height:self.innerHeight||body.clientHeight
				}
			}())
		}
	/*end*/
	}());
//}catch(e){
//	alert("RBT.alert.js"+e);
//}