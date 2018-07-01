

var g_newImage = new Image();
function cutImage( e, w, h, x, y ){
	w = Math.round(w);
	h = Math.round(h);
	x = Math.round(x);
	y = Math.round(y);
	var src =escape( g_imgPath + g_imgName );
	var $cvs = $("#cvs");
	if($("#cutImage").length){
		alert("图片剪切同名")
	}
	if(!$cvs.length){
		$("body").append("<canvas class='hide' id='cvs' width="+w+" height="+h+"></canvas>");
		$cvs = $("#cvs");
	}
	
	if(!g_newImage.load){
		g_newImage.src = escape( g_imgPath + g_imgName );
		g_newImage.onload =function(){
			$cvs[0].width = w;
			$cvs[0].height = h;
			cutImageByCanvas(g_newImage,x,y,w,h,$cvs);
			g_newImage.load =true;
		}
	}else{
		$cvs[0].width = w;
		$cvs[0].height = h;
		cutImageByCanvas(g_newImage,x,y,w,h,$cvs);
	}
	
}
var cutCode=["<!--robert--layout----auto cut image-->\n"];
var cutTime = 0;
function cutImageByCanvas(img,x,y,w,h,$cvs){
	cutTime++;
	var c=$cvs[0].getContext("2d");
	c.drawImage(img,x,y,w,h,0,0,w,h);
	var name = g_imgName.slice(5,g_imgName.indexOf(".jpg"));

	var path = (parseInt(name,10)||0)+2;
	var div1 = ["<div class='resizable draggable ui-widget-content main_object' index='' style='z-index: 1; position: absolute; top: ",
	y-7,
	"px; left: ",
	x-9,
	"px; width: ",
	w,
	"px; height: ",
	h,
	"px;' zindex='1'>"
	]
	var div2 =[
	" <div type='PROMPT' template='3' teacher_version=''>",
	"<fieldset style='border:1px solid transparent;padding-top:0px;padding-left:0px;' background-color=''>",
	"<span class='prompt_image' style='white-space: nowrap; position: absolute; top: ",
	"-33",
	"px; left: ",
	"-75",
	"px'>",
	"<img src='/activity/-1000/-1449/",
	path,
	"/ICON_ANS.png' class='image' onclick='show_prompt(this)' style='cursor: pointer;'>",
	"</span>"
	]
	var activityImg = [
	"<label class='text' style='display:none;'>",
	"<img src='/activity/-1000/-1449/",
	path,
	"/ANS_411",
	"_",
	cutTime,
	".png",
	"'>",
	"</label>",
	"</fieldset>",
	"</div>",
	"</div>"
	]
	cutCode.push(div1.concat(div2,activityImg).join(""))
	var src=$cvs[0].toDataURL("image/png").replace("image/png","image/octet-stream");
	if(!$("#cutImageInfo").length){
		$("body").append("<div id='cutImageInfo' style='position:absolute;left:"+(img.width+10)+"px;top:0px;'></div>")
	}
	if(!$("#cutCode").length){
		$("#cutImageInfo").append("<textarea id='cutCode' style='width:300px;height:200px;'></textarea><br>");
	}
	//if(!$("#renname").length){
	//	$("#cutImageInfo").append("<hr><textarea id='renname' style='width:300px;height:200px;'></textarea><br>");
	//}
	//$("#renname").val(cutCode)
	$("#cutCode").val(cutCode.join("\n"));
	$("#cutImageInfo").append("<img src='"+src+"'><br>width:"+w+"height:"+h+"x:"+x+"y:"+y+"<br>ANS_"+name+"_"+cutTime+".png<br>")
	window.location.href =  src;
}
	