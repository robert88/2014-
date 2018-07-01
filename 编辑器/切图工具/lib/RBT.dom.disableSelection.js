	
/*
	AUTHOR : robert
	GLOBAL : 全局模块 RBT 对外接口 dom
	RETURN : RBT.dom的实例
	DEPENDENCE : RBT.dom ,RBT.each
*/

	;(function(){

		window.RBT = window.RBT || {};
		var dom = RBT.dom;
		var extend = RBT.extend
		
		var event = ("onselectstart" in document)?"selectstart":"mousedown";
		var empty = function(){}
		extend(dom,{
			disableSelection:function(){
				this.bind(event, empty);
		});

	})();