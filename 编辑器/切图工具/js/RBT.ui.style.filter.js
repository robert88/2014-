

/*
	AUTHOR : robert
	GLOBAL : 全局模块 RBT 对外接口 ui.style
	RETURN : RBT.dom的实例
	DEPENDENCE : RBT.each
*/

;(function(){
	window.RBT = window.RBT||{};
	var ui = RBT.namespace("RBT.ui");
	var browser = RBT.browser;
	
	var opacity = ["opacity: ",0,";"];
	var raduis = ["border-raduis:", 0, ";"];
	
	if( browser.ie && browser.ie.ver < 9 ){
		opacity = ["filter:alpha(opacity=", mun, ");"];
		raduis[2] = ";behavior:url(ie-css3.htc);";
	}

	ui.style = {
		opacity : function( num ){
			
			opacity[1] = num;
			return opacity.join("");
			
		},
		border : function( str ,rad){
			
			var border = "border:" + str +";"
			
			if(typeof raduis !== "undefined"){
				raduis[1] = rad;
				return border +raduis.join("");
			}
			
			return border;

		}
	}
	
})();
