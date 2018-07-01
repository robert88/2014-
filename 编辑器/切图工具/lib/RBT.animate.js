/*mm constructor*/
	RBT.animate = RBT.animate ||{};

	;(function(){
			//依赖
			var request = RBT.request;
			var system = RBT.browser.system;

			RBT.animate = function ( o ){
				if(!(this instanceof RBT.animate)){
					return new RBT.animate( o );
				}
				
				/*dynamic data*/
			
				//audio source
				this.defaults = {
					audio : document,
					
					//contain type #bg_1024, #bg_1536, #bg_2048
					type : "",
					
					//animate param
					frames : [],
					mergFrames : [],
					
					//if not set , this param is "" that autoplay with no control.
					ctrType : "",
					
					//if not set , this param is ture that play end will back first view UI.
					playReturnFlag : true,
					
					//if not set , this param is false that play end will hide play button.
					noPlayAgain : false,
					
					backEbook : false,
					
					//this param is delay when play end play button style will change.
					playReturnTime : 2000,
					
				/*static data*/		
				
					mobile : false,
					
					//scan start index of 0 end index of 2;
					start : 0,
					end : 2,

					//mergFrames has played scan index.
					hasPlayed : -1,
					perPlayed : -1,	
				
					//play current time and persent time. and current play status.
					curPlayTime : 0,
					perPlayTime : 0,
					status : "ready",

					//control time without audio control
					offsetTime : 0,	
					
					//control timer
					run : "",	
					animateTimer : "undefined",
					delayTimer:[],
					ctrTimer : "undefined",	
					
					//audio and animate Synchronization status.
					animateStatus : "ok",
					
					//auto play start time
					perDateTime :0,
					perOffsetTime:0
				}
				$.extend(this ,this.defaults, o);
				function Animate(){
					this.id = "";
					this.effect = "";
					this.time = 0;
					this.delay =0;
				}

				var that = this,
					$contain = $( this.type );
				var isConsole = window.console&&window.console.log,
					isPlay = this.audio.play;

				var mobile = this.mobile;
				/*check run environment please load RBT.browser.js*/

				try{
					mobile = system.iphone || system.ipad || system.nokiaN || system.winMobile || system.macMobile;
				}catch(e){
					alert(e);
				}

			/*play status*/
				this.checkEnd = function(){
							if(that.ctrType=="audio"){
							var curTime = that.audio.currentTime,
								length = that.audio.duration;
								if( mobile ){
									if( curTime >= (length-0.1) ){
										that.audio.pause();
										
										//that.audio.currentTime = 0;
										that.status="stop";
										
									}	
								}else if( that.audio.ended ){
								
									if( curTime !== 0 ){
										that.audio.pause();
										
										//that.audio.currentTime=0; 
										//	bug:is will case play audio again
										that.status="stop";
									}
									
								}
							}
							return that;
						};
				this.play=function(){
							if(that.ctrType=="audio"){
							
							//can use setInterval beacause you can not stop it 
							//iso playBay trigger user

								var nomal;
								var mobilePass = (that.trigger === "user");

								if(mobile){
									nomal = (that.audio.networkState==1&&that.audio.readyState==0||that.audio.ended);
								}else{
									nomal = (that.audio.networkState==1&&that.audio.readyState==4||that.audio.ended);
								}
								if(nomal&&( (!mobile)||(mobile&&mobilePass) )){
									if(isPlay){
										that.audio.play();							
									}
									that.status="play";
								}

								if(that.status == "play"){
									that.audioHandler();
									return;
								}
								setTimeout(function(){that.play();},200);
							}else{
								that.status="play";
								that.audioHandler();
							}
							return that;
						};		
				this.pause=function(){
							if(that.ctrType=="audio"){
								if(that.status == "play"){
									if(isPlay){
										that.audio.pause();
									}
									that.status="pause";
								}
							}else{
									that.status="pause";
							}
							return that;
						};
				this.stop=function(){
							if(that.ctrType=="audio"){
								if(that.audio.readyState === 4){
									if(isPlay){
										that.audio.pause();
										that.audio.currentTime=0;							
									}
									that.status="stop";
								}
							}else{
								that.status="stop";
							}
							return that;
						};
						
			/*data handler*/
			
				this.clrData=function(){
				
					if((that.end !== 1 )||(that.offsetTime !== 0 )||(that.hasplayed !== -1)){
						that.offsetTime = 0;
						that.curPlayTime = 0;
						that.perPlayTime = 0;	

						that.start = 0;
						that.end = 2 ;
						if(that.end > that.frames.length){
							that.end = that.frames.length;
						}
						that.hasplayed = -1;
						that.perPlayed = -1;
					}
				};	

					
			/*animation run and get*/
			
				this.runAnimate=function(idx){
				
					//switch(effect[0]){//qt webkit don't support this statement
					that.delayTimer.push(
						setTimeout(
							function(){
								effect = that.mergFrames[idx].effect.split(",");
								$obj = $contain.find(that.mergFrames[idx].id);
								for(var i=0; i<effect.length; i++){
									effect[i] = $.trim( effect[i] );
								}
								if(effect[0] in RBT.animate){
									RBT.animate[effect[0]]($obj,effect);
								}else{
									if(isConsole)console.log ("error:"+effect[0]+" is not request!");
								}				
							},
						that.mergFrames[idx].delay)
					)

				};
				
				this.getAnimate=function(){
					var repeat, interval, effect, time,
						aniParam, animate, animates,
						dlyParam, delay, delays, temp, animateDelay, tempTime;
					var m = 0;
					var frames = that.frames;
					
					//Reference to an array (read and write)
					var mergFrames = that.mergFrames;
					
					if(that.end > frames.length){
						that.end= frames.length;
						
					}
					
					//init mergFrames
					for(var i=0; i<frames.length; i++){
						if((!frames[i])&&(isConsole)){
							console.log("error:check frames index = "+i);
						}
						animateDelay = parseFloat(frames[i].animateDelay,10)||0;
						time = frames[i].curFrame;
						repeat = frames[i].repeatTimes || 1;
						interval = frames[i].repeatIntervalTime || 0;
						aniParam = frames[i].animateObj;
						dlyParam = frames[i].delayTime;
						animates = aniParam.split(",");
						delays = dlyParam.split(",");
						if((animates.length!==delays.length)&&(isConsole)){
							console.log("warning:the animate is not set ,please check animates = delays");
						}
						effect = frames[i].effect || "fade,200";
						for(var j=0; j<animates.length; j++){
						
							// delays[j] is string or undefined
							delay = RBT.animate.covNum( delays[j] );
							animate = animates[j];
							
							for(var n=0; n<repeat; n++ ){
								mergFrames[m] = new Animate();
								mergFrames[m].effect =  effect;
								mergFrames[m].id = animate;		
								mergFrames[m].delay = animateDelay;		
							
								// accuracy is 300ms
								mergFrames[m].time = Math.floor((time*1+delay*1+interval*n)/300)*300;
								m++;
							}
						}
					}

					// sort mergFrames by time
					for(i=0; i<mergFrames.length-1; i++){
						for(j=i+1; j<mergFrames.length; j++){
							if(mergFrames[i].time > mergFrames[j].time){
								temp = mergFrames[i];
								mergFrames[i] = mergFrames[j];
								mergFrames[j] = temp;
							}
						}
					}

					//if(isConsole)console.log(mergFrames);				
				}();
				
			/*animate contrl*/
			
				this.stopAnimate=function(){
					that.run = "";
					that.stop();
					that.clrData();
					return that;
				};		
				
				this.startAnimate=function(){
					that.perOffsetTime = that.offsetTime;
					that.perDateTime = +new Date();
					
					$contain.show();
					that.run = that.type;
					if(that.backEbook&&(that.status ==="stop")){
						$contain.find(".ui").show();
					}
					that.play();
					that.animation();	
					that.trigger="";
					return that;
				};		
				
				this.pauseAnimate=function(){
					return that.pause();
				};
				
				this.updateUi=function(){
					var type = that.type.substring(1),
					$ui = $contain.find(".ui");
					$contain.hide();
					$ui.html($ui.data(type+"_html"));
					return that;
				};
				this.stopTimer=function(){
					if(that.ctrTimer !== "undefined"){
						window.clearTimeout( that.ctrTimer );
						that.ctrTimer = "undefined";
					}
					if(that.animateTimer !== "undefined"){
						window.clearTimeout( that.animateTimer );
						that.animateTimer = "undefined";
					}
					return that;
				};
				
		 
				this.audioHandler=function(){

					var $bnt = $contain.find(".btn_ctl"),
						bntClass = $bnt.attr("class")
					
					var playFlag = /play/g.test( bntClass ),
						pauseFlag = /pause/g.test( bntClass ),
						endFlag = /end/g.test( bntClass );
						
			//play
					if( that.status === "play" ){
						if( that.ctrType === "button" ){
							if( !playFlag ){
								$bnt.addClass("play").removeClass("end").removeClass("pause");
							}
						}else{
							if( !pauseFlag ){
								$bnt.addClass("pause").removeClass("play").removeClass("end");
							}
							
							//auto play control
							that.offsetTime = Math.round(((+new Date()) - that.perDateTime)/100) + that.perOffsetTime;
						}

			//stop
					}else if( that.status === "stop" ){
						if( !endFlag ){
							$bnt.addClass("end").removeClass("play").removeClass("pause");
						}
						
						that.stopTimer();
						that.clrData();
						
						//back init UI (Progressive display do not back)
						if(that.playReturnFlag){
							that.updateUi();
							$contain.show();
						}
						
						if( that.noPlayAgain ){
							$bnt.hide();
						}
							if(that.backEbook){
								setTimeout(function(){
									that.updateUi();
									$contain.show();
									$contain.find(".ui").hide();
									$contain.addClass("bg");
								},that.playReturnTime);

							}
						return;
						
			//pause
					}else if( that.status === "pause" ){
						if( that.ctrType !== "button" ){
							if( !playFlag ){
								$bnt.addClass("play").removeClass("pause").removeClass("end");
							}
						}
					}
					if((that.run === that.type)&&(that.status !== "stop")){
						that.ctrTimer=setTimeout(function(){that.audioHandler();},50);
					}
				};
				
			/*  timer2 animate run delect */
			
				this.animation=function(){	
					var canPlay, curTime, perTime, backTime, ctrType;
					
					that.checkEnd();
					var supportAudio = (that.ctrType=="audio")&&(isPlay)
					if(supportAudio){
					
						//audio control
						curTime = that.curPlayTime = parseInt(that.audio.currentTime*100,10)*10;
					}else{	
					
						//no control
						curTime = that.curPlayTime = that.offsetTime*100;
					}	
					
					perTime = that.perPlayTime;
					ctrType = that.ctrType;
					
					if(curTime !== perTime){
					
						//time adjusting module 
						if((curTime - perTime) > 300){	
							
							//audio time unit is 1.00000000s
							backTime = parseFloat( perTime, 10 )/1000;
							if( supportAudio ){
							
								//audio must start
								if( backTime > 0.1 ){
								
									//adjust 10ms
									backTime -= 0.01;
								}
								
								that.audio.currentTime = backTime;
								curTime = parseInt(that.audio.currentTime*100,10)*10;		
								that.animateStatus = "";
							}
						}else{
							if( that.animateStatus !== "ok"){
								that.animateStatus = "ok";
							}
						}
						
						//	close sound (Mute)
						if( supportAudio ){
							if( that.animateStatus !== "ok" ){
								that.audio.muted = true;
							}else{
								that.audio.muted = false;
							}
						}
						//	scan row frame
						for(var i=that.start; i<that.end; i++){
							canPlay = curTime - that.mergFrames[i].time;
							
							//curTime Increased every 50ms, 100ms when the time interval to 100ms that play
							if(canPlay > -99){
								that.hasPlayed = i;	
								
								//	advance scan row end
								if((that.hasPlayed !== that.perPlayed)&&(that.end < that.mergFrames.length)){
									that.end++;
									that.perPlayed = that.hasPlayed;
								}
								
								//	run animate
								that.runAnimate(i);
								//control is not audio must stopAnimate by manual control

								if( ctrType !== "audio"){	
									if(i === (that.mergFrames.length-1)){
										that.start++;
										setTimeout(function(){that.stopAnimate();},that.playReturnTime);
										return;
									}
								}
								
								//	check end and timeout advance scan row start
								if( i === that.start ){	
									that.start++;
								}
							}
						}
					}
					
					//	record current Time
					that.perPlayTime = curTime;		

					if(that.run === that.type){
						that.animateTimer=setTimeout(function(){that.animation();},17);
					}
				};
				
			/*play control*/
				$contain.find(".btn_ctl").bind("click",changePlay);
						
				function changePlay(){
					if( mobile ){
						that.audio.preload = "none";
						that.trigger = "user";
					}
				//back init UI 
					if(( that.status === "stop" )&&( !that.playReturnFlag )){
						that.updateUi();
						$contain.show();
					} 
					
				//Progressive display
					if( that.ctrType === "button" ){
			
					//set play animate time
						if( that.status !== "stop" ){	
							that.offsetTime = that.mergFrames[that.start].time/100;					
						}else{
							if(that.delayTimer){
								for(var i=0;i<that.delayTimer.length;i++ ){
									window.clearTimeout( that.delayTimer[i] );
								}
								that.delayTimer.length = 0;
							}
							that.stopAnimate();
							that.startAnimate();
						}
						
				//paly and pause
					}else{		
						if(that.status !== "play" ){
							that.startAnimate();
						}else{
							that.pauseAnimate();
						}
					}
				}
			}
			
			/*pulic mothed*/
			$.extend(RBT.animate , {
			
					covNum : function(str){
								return parseInt(str,10)||0;
					},
				/*animation base effect*/
				
					fade : function(a,effect){
							if(effect.length<2){throw("fade param error!")}
							var speed = parseFloat(effect[1],10);
							a.fadeToggle(speed);
					},
					move_v : function(a,effect){
						if(effect.length<3){throw("move_v param error!")}
						var offset = parseFloat(effect[1],10),
						speed = parseFloat(effect[2],10);
						a.animate({top:offset},speed);
					},
					move_h : function(a,effect){
						if(effect.length<3){throw("move_h param error!")}
						var offset = parseFloat(effect[1],10),
						speed = parseFloat(effect[2],10);
						a.animate({left:offset},speed);
					},
					clip_v : function(a,effect){
						if(effect.length<2){throw("clip_v param error!")}
						var speed = parseFloat(effect[1],10),
							invert = effect[2],
							offset = a.height();
							
						a.css("height","0px");
						if(invert){
							that.clip($a[0],speed,"right","left");
						}else{
							a.show().animate({height:offset},speed);
						}
					},
					clip_h : function(a,effect){
						if(effect.length<2){throw("clip_h param error!")}
							var speed = parseFloat(effect[1],10) || 1000,
							offset = parseFloat(effect[2],10) || a.width();
							a.css("width","0px").show().animate({width:offset},speed);
					}
			})

			if(!(window.console&&console.log)){
				window.console = {};

				var jsfile = request("alert.js");

				jsfile.onload = function(){
					if(window.consoleAllow){
						window.console.log = showAlert;
						
					}else{
						window.console.log =function(){};
					}
				};
			}
	}());
