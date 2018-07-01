
/*文檔加載完畢*/
/*drag data*/
globalData=[];
autoPlayFlage=0;
var perDragIdx=0;
var curDragIdx=0;
var tragflage=0;
var dragObjs=[];
var mX;
var mY;
/*navigator*/
var navObj=[];
var perIdx=0;

var s; 
$(document).ready(function(){
	document.onfocus=function(){return false;};
	document.ondragstart=function(){return false;};
	document.onselect=function(){return false;};
	document.onselectstart=function(){return false;};
	var ua = navigator.userAgent.toLowerCase();
	s = ua.match(/msie ([\d])/);
	if(s){if(parseInt(s[1],10)<=8){alert("您的浏览器为ie"+s[1]+".0请升级到8.0以上浏览器。");}}
	navInit();
	Darginit();
	setInterval(showzoom,100);
	if(sessionStorage){
		sessionStorage.autoPlyFlg=0;
		sessionStorage.zoomflage=1;
		sessionStorage.times=0;
	}
	$( "#sortable" ).sortable();
	$( "#sortable" ).disableSelection();
});

/*drag text*/
function dragObj(){
	this.text="";
	this.id="";
	this.color="";
	this.top=0;
	this.left=0;
	this.width=0;
	this.height=0;
}
/*拖放功能*/
function Darginit(){

	$(function() { 
		$("#sortable").sortable({ opacity: 0.5, cursor: 'pointer',
		stop://當刪除了播放文件時：
			function(event,ui){
				var className,hasId,tempIndex;
				if(ui.position.top<-60){
					hasId=$(ui.item).attr("id");
					hasIdx=-1;
					if(hasId){
						hasIdx=hasId.lastIndexOf("_t");//特殊韻母
					}
					if(hasIdx!=-1){
						class_Name=hasId.slice(0,hasIdx);
					}else{
						class_Name=$(ui.item).text();
					}
					$("."+class_Name+"_a").toggleClass(class_Name+"");
					$("."+class_Name).toggleClass(class_Name+"_a");
					ui.item.remove();
					tempIndex=globalData.indexOf(class_Name);//全局變量為字符串對象
					globalData.splice(tempIndex,1);//刪除全局變量
				}
				/*when sortable is empty update first bg*/
				if($("#sortable li").length===0){
					$("#bottomBg").css("z-index","3");
				}else{
					$("#sortable li").css("color","black");
					$("#sortable li:first").css("color","red");
					$("#bottomBg").css("z-index","0");
				}
			},
		update:/*順序發生改變時，全局變量的順序也發生改變*/
			function(event,ui){
				var lis,hasId,hasIdx,class_Name;
				lis=$("#sortable li");
				for(var i=0;i<lis.length;i++){
					/*get text*/
					hasIdx=-1;
					hasId=$(lis[i]).attr("id");
					if(hasId){
						hasIdx=hasId.lastIndexOf("_t");
					}
					if(hasIdx!=-1){
					console.log(hasId+" "+i);
						class_Name=hasId.slice(0,hasIdx);
					}else{
						class_Name=$(lis[i]).text();
					}
					/*update data*/
					globalData[i]=class_Name;
					/*update color*/
				}
				$("#sortable li").css("color","black");
				$("#sortable li:first").css("color","red");
				document.getElementById("contain").src=globalData[0]+".html";
			},
			tolerance:"pointer",
		}); 
	}); 
}
/*拼音導航*/
function nav(){
	this.index=0;
	this.id="";
	this.navId="";
	this.navBg=new Image();
	this.navBg_h=new Image();
	this.bg=new Image();
}
/*改變拼音導航背景*/
function changeBg(idx){
	if(perIdx!=idx){
		$(navObj[perIdx].id).hide();
		$(navObj[perIdx].navId).css("background-image","url("+navObj[perIdx].navBg_h.src+")");
		$(navObj[idx].navId).css("background-image","url("+navObj[idx].navBg.src+")");
		$("#md2").css("background-image","url("+navObj[idx].bg.src+")");
		$(navObj[idx].id).show();
		perIdx=idx;
	}

}
/*加載拼音導航圖片*/
function navInit(){
	for(var i=0;i<4;i++){
		navObj[i]=new nav();
		navObj[i].id="#text"+i;
		navObj[i].navId="#nav"+i;
		navObj[i].navBg.src="images/nav"+i+".png";
		navObj[i].navBg_h.src="images/nav_h"+i+".png";
		navObj[i].bg.src="images/nav_bg"+i+".gif";
	}
}
/*添加播放文件*/
function changeClass(e,str,txt,txtpad){
	e=e||window.event;
	var text="";
	var oldDate0=globalData[0];
	var fast=document.getElementById("fast");
	if(fast){
		$("#sortable").empty();//firefox is lower when ul is empty.
	}
	var lis=$("#sortable li");
	var oldLen=lis.length;
	if(txt){/*特殊韻母處理*/
		text=txt;
	}else{
		text=str;
	}
	/*刪除重複的字母*/
	for(var i=0;i<oldLen;i++){
		if($(lis[i]).text()==text||($(lis[i]).attr("id")==(str+"_t"))){
			$(lis[i]).remove();
			globalData.splice(i,1);
			/*update target style*/
			$(e.target).toggleClass(str);
			$(e.target).toggleClass(str+"_a");
			break;
		}
	}
	var newLen=$("#sortable li").length;
	/*添加：8個字符且沒有重複*/
	if((newLen<9)&&(newLen==oldLen)){
		if(txt&&txtpad){/*特殊韻母iu-iou，ui-uei*/
			$("#sortable").append("<li id='"+str+"_t'>"+text+"<div style='position:relative;'><small style='font-size:16px;font-family:times,courier,arial;position:absolute;top:-10px;left:18px;'>("+txtpad+")</small><div></li>");
		}else if(txt){/*特殊韻母2*/
			$("#sortable").append("<li id='"+str+"_t'>"+text+"</li>");
		}else{				
			$("#sortable").append("<li>"+text+"</li>");
		}
		globalData.push(str);
		/*update target style*/
		$(e.target).toggleClass(str);
		$(e.target).toggleClass(str+"_a");
	}
	/*update li sytle*/
	if($("#sortable li").length>0){
		$("#sortable li").css("color","black");
		$("#sortable li:first").css("color","red");
		$("#bottomBg").css("z-index","0");
	}else{
		$("#bottomBg").css("z-index","3");
	}
	if(globalData[0]!==oldDate0){
		document.getElementById("contain").src=globalData[0]+".html";
	}
}
/*單擊改變iframe*/
var perId="hdPic0";
function changeIframe(dir,id){
	var temp=[];
	if(dir){/*列印切換*/
		if(id!=perId){
			if(id=="hdPic0"){
				$("#hdPic0").addClass("hdclass1");
				$("#hdPic0").removeClass("hdclass0");
				$("#hdPic1").addClass("hdclass2");
				$("#hdPic1").removeClass("hdclass3");
				if(perOSD){
					document.getElementById("contain").src=perIframeIdx+".html";
				}
				changeOSD(perOSD);
			}else{
				document.getElementById("contain").src=dir;
				$("#hdPic0").addClass("hdclass0");
				$("#hdPic0").removeClass("hdclass1");
				$("#hdPic1").addClass("hdclass3");
				$("#hdPic1").removeClass("hdclass2");
				changeOSD(1);
			}
			perId=id;
		}
	}else{/*主頁和播放界面切換*/
		$("#ct_ctn .data").empty();//清空副本
		for(var i=0;i<globalData.length;i++){
			if(globalData[i]=="iu-iou"||globalData[i]=="ui-uei"){
				$("#ct_ctn .data").append("<li onclick=\"changeinnerFrame('"+globalData[i]+"','"+i+"')\" class='red"+i+"'>"+globalData[i].slice(0,globalData[i].indexOf('-'))+"<div style='position:relative;'><small style='font-size:16px;font-family:times,courier,arial;position:absolute;top:-10px;'>("+globalData[i].slice((globalData[i].indexOf('-')+1),globalData[i].length)+")</small><div></li>");
			}else{
				$("#ct_ctn .data").append("<li onclick=\"changeinnerFrame('"+globalData[i]+"','"+i+"')\" class='red"+i+"'>"+globalData[i]+"</li>");
			}
		}
		if(globalData.length){
			document.getElementById("contain").src=globalData[0]+".html";
			perIframeIdx=globalData[0];
			changeOSD(2);
			perOSD=2;
			$(".red0").css("color","red");
		}
	}
}

/*iframe 之間的切換*/
var perObjIdx;
var perIframeIdx="";
function changeinnerFrame(frameIdx,objIdx){
			clearTimer();
			document.getElementById("contain").src=frameIdx+".html";
			if(perObjIdx!=objIdx){
				$(".red"+perObjIdx).css("color","black");
				$(".red0").css("color","black");
				$(".red"+objIdx).css("color","red");
				perObjIdx=objIdx;
				perIframeIdx=frameIdx;/*記錄當前url，切換時要用到*/
			}
}
/*清除恢復*/
function clearALLcolor(){
		for(var i=0;i<globalData.length;i++){
			$(".red"+i).css("color","black");
		}
}
/*主界面切換*/
var perOSD=0;
function changeOSD(idx,back){
	clearTimer();
	if(back){
		perOSD=0;
	}
	switch(idx){
		case 0:
			$("#indexMiddle").show();
			$("#md").hide();
			$("#indexBm").hide();
		break;
		case 1:
			$("#indexMiddle").hide();
			$("#md").show();
			$("#indexBm").hide();
		break;
		case 2:
			$("#indexMiddle").hide();
			$("#md").show();
			$("#indexBm").show();
		break;
		default:
		break;
	}
}
/*自動播放*/
autoPlayTimer=[];
function autoplay(){
	autoPlayFlage=0;
	/*clear timer*/
	clearTimer();
	/*auto play*/
	if(globalData.length){
		for( i=0;i<globalData.length;i++){
			autoPlayTimer[i]=setTimeout("document.getElementById('contain').src='"+globalData[i]+".html';clearALLcolor();$('.red"+i+"').css('color','red');",3000*i);
			autoPlayFlage++;
		}
		autoPlayTimer[i]=setTimeout(function(){sessionStorage.autoPlyFlg=autoPlayFlage=0;},3000*i-2500);
	}
	if(sessionStorage){
		sessionStorage.autoPlyFlg=autoPlayFlage;
	}//更新sub frame的數據
}
	/*clear timer*/
function clearTimer(){
	for(var i=0;i<autoPlayTimer.length;i++){
		clearTimeout(autoPlayTimer[i]);
	}
	autoPlayTimer.length=0;
}
/*communication sub iframe*/
function communicate(str){
	if(str==="autoplay"){
		if(autoPlayFlage>0){
			autoPlayFlage--;
		}
	}else if(str==="zoomout"){
			$("#md").css("top","-60px");
			$("#md").css("height","540px");
			$("#contain").css("height","620px");
			$("#indexBm").hide();
	}else if(str==="zoomin"){
			$("#md").css("top","0px");
			$("#md").css("height","520px");
			$("#contain").css("height","550px");
			$("#indexBm").show();
	}
}
function showzoom(){
	if(sessionStorage){
		if(sessionStorage.times==1){
			if(sessionStorage.zoomflage=="zoomout"){
				$("#md").css("top","-80px");
				$("#md").css("height","540px");
				$("#contain").css("height","620px");
				$("#indexBm").hide();
			}else if(sessionStorage.zoomflage=="zoomin"){
				$("#md").css("top","0px");
				$("#md").css("height","520px");
				$("#contain").css("height","550px");
				$("#indexBm").show();
			}
		}
		sessionStorage.times=0;
	}
}