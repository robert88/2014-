	/*animation efffect*/
	window.RBT = window.RBT ||{};
	
	$.extend(RBT.animate, {
			clip:function( a, effect ){
						if( effect.length < 4 ){throw("clip param error!")}
						var speed = parseFloat(effect[1],10),
						deriction = effect[2],
						mask_num = 0,
						obj = a[0],
						mask_t = 0;
						if(obj){
							var w = a.width(),
								h = a.height();
							speed = w/speed*17;
							obj.mask_timer=setInterval(function(){
								if(deriction==="left"){
										mask_num += speed;
										if(mask_num < w){
											obj.style.clip = "rect(" + 0 + "px,"  + w + "px,"  + h + "px,"  + mask_num + "px)" ; 
										}else{
											obj.style.clip = "rect(" + 0 + "px,"  + w + "px,"  + h + "px,"  + w + "px)" ; 
											clearInterval(obj.mask_timer)
											obj.mask_timer = null;
										}
								}else if(deriction==="right"){
										w -= speed;
										if(w>0){
											obj.style.clip = "rect(" + 0 + "px,"  + w+ "px,"  + h + "px,"  + 0 + "px)" ; 
										}else{
											obj.style.clip = "rect(" + 0 + "px,"  + 0+ "px,"  + h + "px,"  + 0 + "px)" ; 
											clearInterval(obj.mask_timer)
											obj.mask_timer = null;
										}
								}else if(deriction==="down"){
										mask_num += speed;
										if(mask_num<h){
											obj.style.clip = "rect(" + mask_num + "px,"  + w + "px,"  + h + "px,"  + 0 + "px)" ; 
										}else{
											obj.style.clip = "rect(" + h + "px,"  + w + "px,"  + h + "px,"  + 0 + "px)" ; 
											clearInterval(obj.mask_timer)
											obj.mask_timer = null;
										}
								}else if(deriction==="up"){
										h -= speed;
										if(h>0){
											obj.style.clip = "rect(" + 0 + "px,"  + w + "px,"  + h + "px,"  + 0 + "px)" ; 
										}else{
											obj.style.clip = "rect(" + 0 + "px,"  + w + "px,"  + 0 + "px,"  + 0 + "px)" ; 
											clearInterval(obj.mask_timer)
											obj.mask_timer = null;
										}
								}
							},17);
						}

			},
			toggle:function(a,effect){
					if(effect.length<2){throw("toggle param error!")}
					var speed = parseFloat(effect[1],10);
					a.toggle(speed);
			},
			move_h_up:function(a,effect){
					if(effect.length<3){throw("move_h_up param error!")}
					var offset = parseFloat(effect[1],10),
						speed = parseFloat(effect[2],10),
						l = a.css("left"),
						t = this.covNum(l);
					a.animate({left:(offset+t)+"px"},speed);
			},
			clip_h_left:function(a,effect){
					if(effect.length<3){throw("clip_h_left param error!")}
					var offset = parseFloat(effect[1],10),
						speed = parseFloat(effect[2],10),
						w = a.width();

					a.animate( {width:( offset+w )+"px" }, speed);
			},
			toggleClass:function(a,effect){
					if(effect.length<3){throw("toggleClass param error!")}
					var class1 = effect[1],
						class2 = effect[2];
					a.removeClass(class1).addClass(class2);
			},
			slantMove:function(a,effect){
					if(effect.length<4){throw("slantMove param error!")}
					var x = effect[1],
					y = effect[2],
					speed = parseFloat(effect[3],10);
					a.animate({top:y,left:x},speed);
			},
			round:function(a,effect){
					if(effect.length<5){throw("round param error!")}
					var offset = parseFloat(effect[1],10),
						offsetX = parseFloat(effect[2],10),
						offsetY = parseFloat(effect[3],10),
						speed = parseFloat(effect[4],10),
						skew = parseFloat(effect[5],10)||0;
					var transformParam = [  "rotate(",offset,"deg) scale(1) ",
										"skew(",skew,"deg) ",
										"translate(",offsetX,"px,",offsetY,"px)"
									 ].join(""),
						transform = {
									"transform":transformParam,
									"-webkit-transform":transformParam,
									"-ms-transform":transformParam,
									"-moz-transform":transformParam,
									"-o-transform":transformParam
									};
									
					var transitionParam = "All "+speed+"ms ease",
						transition = {
									"transition":transitionParam,
									"-webkit-transition":transitionParam,
									"-moz-transition":transitionParam,
									"-o-transition":transitionParam
									};
					a.css(transform).css(transition);
			},
			filp:function(a,effect){
					if(effect.length<2){throw("filp param error!")}
					var $bb = a.data("bookdata");
				   if((!$bb && (effect[1] !== "init"))||(effect[1] === "init")){
				   
						$bb = a.bookblock(
							{
								speed : parseFloat(effect[2],10),
								current : effect[3],
								previous : effect[4],
								shadows : false
							} 
						);
						a.data("bookdata", $bb);
				   }
					if((effect[1] === "next")||(effect[1] === "prev")){
						a.bookblock( effect[1] );
					}
			}
	})