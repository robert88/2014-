;(function(){
	window.RBT = window.RBT||{};
	var dom = RBT.dom,
		g_startCode = ["\n<!--robert--start--auto cut image-->"],
		g_endCode = ["<!--robert--end--auto cut image-->\n"],
		g_count = 0,
		g_code = [],
		g_ui = RBT.namespace("RBT.ui");
		
	function getCanvas( img, w, h, x, y ){

		var c = dom("#cvs");

		if(!c.length){
			var cavas = document.createElement("canvas");
			cavas.width = w;
			cavas.height = h;
			cavas.id ="cvs";
			cavas.style.display ="none";
			dom("body").append(cavas);
			c = dom("#cvs");
		}

		c[0].width = w;
		c[0].height = h;

		var cvs =c[0].getContext("2d");
		cvs.drawImage(img,x,y,w,h,0,0,w,h);

		var dos=c[0].toDataURL("image/png");
		
		return dos;

	}
	function createCode( file, w, h, x, y ){
		
		var name = file.name.slice(5,file.name.indexOf(".jpg"));
		var page = "-1450"
		var path = (parseInt(name,10)||0)+2;
		var g_code0 = [
			"<div class='resizable draggable ui-widget-content main_object' index='' style='z-index: 1; position: absolute; top: ",
			y - 7,
			"px; left: ",
			x - 9,
			"px; width: ",
			w,
			"px; height: ",
			h,
			"px;' zindex='1'><div type='PROMPT' template='3' teacher_version=''>",
			"<fieldset style='border:1px solid transparent;padding-top:0px;padding-left:0px;' background-color=''>",
			"<span class='prompt_image' style='white-space: nowrap; position: absolute; top: ",
			"-33",
			"px; left: ",
			"-75",
			"px'><img src='/activity/-1000/",
			page,
			"/",
			path,
			"/ICON_ANS.png' class='image' onclick='show_prompt(this)' style='cursor: pointer;'>",
			"</span><label class='text' style='display:none;'><img src='/activity/-1000/",
			page,
			"/",
			path,
			"/ANS_",
			g_count,
			".png'></label></fieldset></div></div>"
		];
		
		g_code.push( g_code0.join("") );

	}
	function showCodeUi(x,y){
		if( !dom("#cutImageInfo").length ){
			var div = document.createElement("div");
			div.style.position ="absolute"
			div.style.left = (x+10) +"px";
			div.style.top = y+"px"
			div.id="cutImageInfo"
			dom("body").append(div)
		}
		if( !dom( "#cutCode" ).length ){
			dom( "#cutImageInfo" ).append("<textarea id='cutCode' style='width:300px;height:200px;'></textarea><br>");
		}
		if( !dom( "#base64" ).length ){
			dom( "#cutImageInfo" ).append("<textarea id='base64' style='width:300px;height:200px;'></textarea><br>");
		}
	}
	g_ui.cutImage = function( img, file, w, h, x, y ){
		w = Math.round(w);
		h = Math.round(h);
		x = Math.round(x);
		y = Math.round(y);
		g_count++;
		
		var imgSrc = getCanvas( img, w, h, x, y );

		createCode( file, w, h, x, y )
		
		showCodeUi( img.width, 0 )

		dom( "#base64" ).html( imgSrc );
		dom( "#cutCode" ).html( g_startCode.concat( g_code.concat( g_endCode ) ).join("\n") );
		
		dom( "#cutImageInfo" ).append("<img src='"+imgSrc+"'><br>width:"+w+"height:"+h+"x:"+x+"y:"+y+"<br>ANS_"+g_count+".png<br>")
		window.location.href =  imgSrc.replace("image/png","image/octet-stream");

	}

})();

