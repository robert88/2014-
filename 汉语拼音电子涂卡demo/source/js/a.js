
/*存儲可以播放audio 的id*/
var playArray=[];
/*特效索引*/
var playElect=[];
/*流水線幾時*/
var timer=[];
var timerOut=[];
/*特效對象*/
var paly=[];
var autoPly=0;
var isIpad;
var dog=new Object();
function data(){
	this.index=0;
	this.type='';
	this.images=[];
	this.speed=0;
	this.times=0;
	this.id=[];
	this.delaySound=0;
	this.delayEffect=0;
	this.startset=0;
	this.endset=0;
	
}
$(document).ready(function(){
	document.onfocus=function(){return false;};
	document.ondragstart=function(){return false;};
	document.onselect=function(){return false;};
	document.onselectstart=function(){return false;};

	for(var i=0;i<5;i++){
		paly[i]=new data();
	}
	paly[0]={index:0,type:"flash",id:["#letter1"],times:3};
	paly[1]={index:1,type:"mask2",id:["letter1","letter3","letter4"],speed:1,delaySound:1000,delayEffect:1500};
	paly[2]={index:2,type:"mask3",id:["text_play_h0"],speed:1,delaySound:1000,delayEffect:1000,startset:10,endset:100};
	paly[3]={index:3,type:"mask1",id:["text_play_h1"],speed:1,delaySound:1000,delayEffect:10,startset:40};
	paly[4]={index:4,type:"mask3",id:["text_play_h2"],speed:1,delaySound:1000,delayEffect:1000,startset:10,endset:100};
	paly[5]={index:5,type:"mask1",id:["text_play_h3"],speed:1,delaySound:1000,delayEffect:10,startset:40};
	paly[6]={index:6,type:"mask3",id:["kao_play_z"],speed:1,delaySound:50,delayEffect:700,startset:10,endset:100};
	var isIpad=navigator.userAgent.toLowerCase().match(/ipad/);
	communicateToParent("autoplay");
	if(autoPly>0){
		playsound('0','a1');
		autoPly=0;
	}
	
	var perImage2=[];
	var basicURL2 = "images/";
	var perData2=["playsound0_h.png","tuka1_h.png","tuka2_h.png","tuka3_h.png","tuka0.png","zoom0.png","zoom1.png","xia_h.png","shang_h.png","a_play_01.png","a_play_02.png","a_play_03.png","a_play_04.png","a_play_h_01.png","a_play_h_02.png","a_play_h_03.png","a_play_h_04.png","a_bg.png","a_font.png","a_kao.png","a_kao_h.png","kaobn.png","kaobn1.png","a_kao.png","a_kao_h.png","kaobn_h.png","playsound_h.png","left_h.png","right.png","right_h.png",];
	for(var i=0;i<perData2.length;i++){
		perImage2[i] = new Image();
		perImage2[i].src = basicURL2 + perData2[i];
	}
	
	var startTimer=setInterval(function(){
	var n=0;
		for(i=0;i<5;i++){
			if(getId("a"+i).readyState!==4){
				n++;
				//alert(getId("a"+i).readyState);
			}
		}
/*if(n==5){
			clearInterval(startTimer);
		} */
	},17);

});
/*檢測自動播放*/
function communicateToParent(str){
	if(str=="autoplay"){
		if(sessionStorage){
			autoPly=sessionStorage.autoPlyFlg;
			if(sessionStorage.autoPlyFlg>0){
				sessionStorage.autoPlyFlg--;
			}
		}else{//ie
			if(parent.communicate){
				autoPly=parent.autoPlayFlage;
				parent.communicate("autoplay");
			}
		}
	}else{/*放大縮小處理*/
		$("#zoom_bg").toggle();
		$("#zoom-1").toggle();
		$("#letter1").toggleClass("zoom_tx");
		$("#letter0").toggleClass("zoom_tx");
		if(sessionStorage){
			sessionStorage.times=1;
			sessionStorage.zoomflage=str;
		}else{//ie
			if(parent.communicate){
				parent.communicate(str);//0
			}
		}
	}
}
/*獲取id*/
function getId(obj){
	return document.getElementById(obj);
}
/*顯示和隱藏*/
function troggleNav(){
	var len=arguments.length;
	for(var i=0;i<len;i++){
		$(arguments[i]).toggle();
	}
}
/*播放聲音和效果*/
function playsound(){
	stopALL();
	var len=arguments.length;
	var j=0;
	playElect=arguments[0].split(/[^0-9]+/);
	for(i=0;i<playElect.length;i++){
		playElect[i]=parseInt(playElect[i],10);
		//alert("leixin:"+(typeof playElect[i])+"zhi:"+playElect[i])
	}
	if(playElect.length){
		setTimeout(function(){
			effectHandle(playElect[0]);
		},paly[playElect[0]].delayEffect);
	}
	
	if(len>=2){
		for(var i=1;i<len;i++){
			if(getId(arguments[i]).play){
				playArray[j]=arguments[i];
				j++;
			}
		}
		if(playArray.length){
				setTimeout(function(){
					getId(playArray[0]).play();
					timer[0]=setInterval(function(){checkend();},20);
				},paly[playElect[0]].delaySound)
		}
	}
}

/*動畫效果*/
function effectHandle(idx){
	switch(paly[idx].type){
		case "flash":
			flashEffect(idx);
		break;
		case "mask0":
			mask0(idx);
		break;
		case "mask1":
			mask1(idx);
		break;
		case "mask2":
			mask2(idx);
		break;		
		case "mask3":
			mask3(idx);
		break;
	}
}
/*播放流水線處理*/
function checkend(){
var len,lentotal;
	if(playArray.length){
	len=getId(playArray[0]).currentTime;
	lentotal=getId(playArray[0]).duration;
		if(getId(playArray[0]).ended||(len>=lentotal-0.1)){//bug: android is not set currentTime when pause or end
		try{
			getId(playArray[0]).pause();
			getId(playArray[0]).currentTime=0;/*bug:if you donot set this you are only play once*/
		}catch(e){}
		//	console.log("playArray[0] "+playArray[0]+"  playArray[0].length "+playArray.length)
		// alert("playArray[0] "+playArray[0]+"  playArray[0].length "+playArray.length)
			playArray.shift();
		//	console.log("playArray[] "+playArray[0]+"  playArray[].length "+playArray.length)
			playElect.shift();
			if(playArray.length){
				timerOut[0]=setTimeout(function(){getId(playArray[0]).play();},paly[playElect[0]].delaySound);
				timerOut[1]=setTimeout(function(){effectHandle(playElect[0]);},paly[playElect[0]].delayEffect);
			}
		}
	}else{
		clearInterval(timer[0]);
	}
}
/*停止所有播放的聲音*/
function stopALL(){
	for(var i=1;i<timerOut.length;i++){
		clearTimeout(timerOut[i]);
	}
	for(i=1;i<timer.length;i++){
		clearInterval(timer[i]);
	}
	timerOut.length=0;//清除timeout
	timer.length=0;//清除
	toAllClip();//停止動畫
	
	for(i=0;i<5;i++){
		if(getId("a"+i).duration&&(getId("a"+i).duration!==Infinity)){
			getId("a"+i).currentTime=0;
			getId("a"+i).pause();
		}
	}

}
/*閃動效果*/
	var showTimer=[];
	var hideTimer=[];
function flashEffect(idx){

	toAllClip();
	for(var j=0;j<paly[idx].times;j++){
		for(var i=0;i<paly[idx].id.length;i++){
			$(paly[idx].id[i]).css("clip" ,"rect(0px,"+$(paly[idx].id[i]).width()+"px,"+$(paly[idx].id[i]).height()+"px,0px)") ; 
			setTimeout("$('"+paly[idx].id[i]+"').show();",200*j+500*j);
			setTimeout("$('"+paly[idx].id[i]+"').hide();",500*(j+1));
		}
	}
}
/*遮罩效果*/
function mask0(idx){
	if(paly[idx].type=="mask0"){
		var obj=getId(paly[idx].id[0]);
		obj.style.clip = "rect(" + 0 + "px,"  + 0 + "px,"  + 0 + "px,"  + 0 + "px)" ; 
		$("#"+paly[idx].id[0]).show();
		var speed=paly[idx].speed;
		toAllClip(obj,speed,1,"right",1);
	}else{
		cwxbox.box.show("effect error F100");
	}
}
/*遮罩效果2*/
function mask1(idx){
	if(paly[idx].type=="mask1"){
		var obj=getId(paly[idx].id[0]);
		obj.style.clip = "rect(" + 0 + "px,"  + 0 + "px,"  + 0 + "px,"  + 0 + "px)" ; 
		$("#"+paly[idx].id[0]).show();
		var speed=paly[idx].speed;
		toAllClip(obj,speed,1,"right",1,paly[idx].startset);
	}else{
		cwxbox.box.show("effect error F101");
	}
}/*遮罩效果2*/
function mask2(idx){
var objs=[];
	if(paly[idx].type=="mask2"){
		for(var i=0;i<paly[idx].id.length;i++){
			objs[i]=getId(paly[idx].id[i]);
			//alert(paly[idx].id[i])
			objs[i].style.clip = "rect(" + 0 + "px,"  + 0 + "px,"  + 0 + "px,"  + 0 + "px)" ;
			$("#"+paly[idx].id[i]).show();
		}
		timerOut[2]=setTimeout((function(){toAllClip(objs[0],1.2,1,'right',1,20);}),1);
		timerOut[3]=setTimeout((function(){clearTimeout(timerOut[2]);toAllClip(objs[1],1.3,1,'right',1);}),1000);
		timerOut[4]=setTimeout((function(){clearTimeout(timerOut[3]);toAllClip(objs[2],0.7,1,'right',1,50);}),4500);
	}else{
		cwxbox.box.show("effect error F101");
	}
}
/*遮罩效果3*/
function mask3(idx){
	if(paly[idx].type=="mask3"){
		var obj=getId(paly[idx].id[0]);
		obj.style.clip = "rect(" + 0 + "px,"  + 0 + "px,"  + 0 + "px,"  + 0 + "px)" ; 
		$("#"+paly[idx].id[0]).show();
		var speed=paly[idx].speed;
		toAllClip(obj,speed,1,"right",1,paly[idx].startset,paly[idx].endset);
	}else{
		cwxbox.box.show("effect error F101");
	}
}
/*界面切換*/
var perIdx=0;
function changeinnerFrame(){
	var idx=arguments[0];
	if(idx!=perIdx){
		$("#nav"+perIdx).toggleClass("ct_nav_h"+perIdx);
		$("#nav"+perIdx).toggleClass("ct_nav"+perIdx);
		$("#nav"+idx).toggleClass("ct_nav"+idx);
		$("#nav"+idx).toggleClass("ct_nav_h"+idx);
		perIdx=idx;
		stopALL();
		hideALL();
		for(var i=1;i<arguments.length;i++){
			$(arguments[i]).show();
		}
	}
}

/*隱藏所有可控對象*/
function hideALL(){
/*zoom*/
$("#zoomshow").hide();
$("#zoom-1").hide();
//$("#zoom_bg").hide();
/*圖卡*/
$("#py_sd").hide();
$("#letter1").hide();
$("#letter0").hide();
/*看圖發音*/
$("#letter21").hide();
$("#letter22").hide();
$("#letter3").hide();
$("#letter4").hide();
$("#py_sd1").hide();
/*煉四聲*/
$("#py_sd2").hide();
$("#lianxi").hide();
$("#text_play").hide();
/*考考*/
$("#kaokao").hide();
$("#text_bg").hide();
}

/*遮罩效果處理程序*/
function toAllClip(obj,speed,flag,deriction,times,offset,endset){
	var mask_num,mask_t=0;
	if(offset){
		mask_num=offset;
	}else{
		mask_num=0;
	}//開始的位置

	clearInterval(timer[1]);
	if(flag){
		var w=obj.style.width.match(/\d+/g)||obj.offsetWidth;
		var h=obj.style.height.match(/\d+/g)||obj.offsetHeight;
		timer[1]=setInterval(function(){
			if(endset){
				if(mask_num>=endset){
					clearInterval(timer[1]);
					mask_num=0;mask_t=0;
				}
			}
			switch(deriction){
				case "left":
					mask_num-=speed;
					if(mask_num>0){
						if(times&&(mask_t>times)){
							clearInterval(timer[1]);
							mask_num=0;mask_t=0;
						}
						obj.style.clip = "rect(" + 0 + "px,"  + w + "px,"  + h + "px,"  + mask_num + "px)" ; 
					}else{
						mask_t++;
						mask_num=w;
					}
					break;
				case "right":
					mask_num+=speed;
					if(mask_num<=w){
						if(times&&(mask_t>=times)){
							clearInterval(timer[1]);
							mask_num=0;mask_t=0;
						}
						obj.style.clip = "rect(" + 0 + "px,"  + mask_num + "px,"  + h + "px,"  + 0 + "px)" ; 
					}else{
						mask_t++;
						mask_num=0;
					}
					break;
				case "top":
					mask_num-=speed;
					if(mask_num>0){
						if(times&&(mask_t>times)){
							clearInterval(timer[1]);
							mask_num=0;mask_t=0;
						}
						obj.style.clip = "rect(" + mask_num + "px,"  + w + "px,"  + h+ "px,"  + 0 + "px)" ; 
					}else{
						mask_t++;
						mask_num=h;
					}
				break;
				case "bottom":
					mask_num+=speed;
					if(mask_num<=h){
						if(times&&(mask_t>=times)){
							clearInterval(timer[1]);
							mask_num=0;mask_t=0;
						}
						obj.style.clip = "rect(" + 0 + "px,"  + w + "px,"  + mask_num + "px,"  + 0 + "px)" ; 
					}else{
						mask_t++;
						mask_num=0;
					}
					break;
			}
		},17);
	}
}