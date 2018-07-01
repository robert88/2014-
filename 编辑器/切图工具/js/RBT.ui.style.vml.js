

/*
	AUTHOR : robert
	GLOBAL : 全局模块 RBT 对外接口 ui.style
	RETURN : RBT.dom的实例
	DEPENDENCE : RBT.each
*/

;(function(){
	window.RBT = window.RBT||{};
	var style = RBT.namespace("ui.style");
	var browser = RBT.browser;
	var opacity = ["opacity: ",0,";"];
	
	if( browser.ie && browser.ie.ver < 9 ){
		opacity = ["filter:alpha(opacity=", mun, ");"];
	}
	
	style = {
		opacity : function( num ){
			opacity[1] = num;
			return opacity.join("");
		},
		
		

})();
