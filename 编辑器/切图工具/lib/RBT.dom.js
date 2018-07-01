
/*
	AUTHOR : robert
	GLOBAL : 全局模块 RBT 对外接口 dom
	RETURN : RBT.dom的实例
	DEPENDENCE : RBT.each，RBT.extend
*/

;(function(){
	window.RBT = window.RBT || {};
	var each = RBT.each;
	var extend = RBT.extend;
	
	RBT.dom = function( ){
		var dom,
			arg = arguments;
			
		if( !( this instanceof arg.callee ) ){
			return new arg.callee(arg);
		}
		arg = arguments[0];
		
		for(var i=0; i<arg.length; i++){
			
			dom = this.find( arg[i] );
			if(typeof dom.length !== "undefined"){
				for(var j=0; j<dom.length; j++){
					Array.prototype.push.call( this, dom[j]);
				}
				
			}else{
				Array.prototype.push.call( this, dom);
			}
		}
		return this;
	};

	//提前检测代码优化
	var g_listner = "";
	var g_type = "";
	if( window.addEventListener ){
		g_listner = "addEventListener";
	}else if(window.attachEvent){
		g_listner = "attachEvent";
		g_type = "on";
	}
	
	var g_touch =/touchstart|touchend|touchmove/g;
	
	//添加事件监听
	function bind( e, fn, keep ){
		
		//如果设置了keep，那就允许默认行为 和事件传播
		if(!keep){
			e.stopPropagation();
			e.preventDefault();			
		}
		
		//支持平板touch事件
		if(g_touch.test(e.type)){
			e = e.originalEvent.touches[0];
		}
		
		fn(e);
	}
	
	//获取css样式
	function getCss( elem, key ){
		
		//将命名变成驼峰式命名
		key = setName(key);
		
		if( elem.style[key] ){
			return elem.style[key];
			
		}else if( elem.currentStyle ){
			return elem.currentStyle[key];
			
		}else if( document.defaultView  &&  document.defaultView.getComputedStyle ){
			return document.defaultView.getComputedStyle( elem, null ).getPropertyValue( key );
			
		}
	}
	
	//设置css样式
	function setCss( elem, key, value ){
		key = setName( key );
		elem.style[key] = value;
	}
	
	//将命名变成驼峰式命名
	function setName( name ){
		return name.replace(/-(\w)/g,function(c,m1){return m1.toUppercase();});
	}
	
	//字符串优化
	var display = "display",
		none = "none",
		unde = "undefined"
	
	//扩展实例
	extend( RBT.dom.prototype, {
		
		//在Ie8+支持选择器，其他浏览
		find:function( str ){

			if(str.nodeType){
				return str;
			}

			if( document.querySelector ){
				return document.querySelectorAll( str );
			}else{
				if( /^#.*/.test( str ) ){
					return document.getElementById( str.slice(1) );
				}else if( /^\..*/.test( str ) ){
					return document.getElementsByClassName( str.slice(1) );
				}else {
					return document.getElementsByTagName( str )
				}
			}
		},
		bind : function( type , fn ,keep){
			type = type.split(",");
			var len = type.length;
			
			each(this, function( val ){
				for(var i=0; i<len; i++){
					val[ g_listner ]( g_type + type[i], function(e){ bind( e, fn, keep ); }, false );
				}

			});
			return this;
		},
		append : function(str){
			
				each( this, function( val, i ){
					if(str.nodeType){
						val.appendChild(str);
					}else{
						val.innerHTML += str;
					}
				})
				return this;
				
		},
		val : function(){
			return ( typeof arguments[0] === unde)? this[0].value:this[0].setAttribute("value",arguments[0]);
		},
		html:function(){
			
			var temp = [],
				str = arguments[0],
				get = typeof str === unde;
				
			if(get){			
				each( this, function( val, i ){
					temp.push(val.innerHTML);
				});
				return temp;
			}else{

				each( this, function( val, i ){
					if(str.nodeType){
						val.innerHTML = "";
						val.appendChild(str);
					}else{
						val.innerHTML = str;
					}
				});
				return this;
			}
		
		},
		css:function(){
			
			var args = arguments;
			var len = args.length;
			var temp = [];
			if(typeof args[0] === "object"){
				for(var i in args[0]){
					each(this,
						function(val){
							setCss(val, i, args[0][i])
						}
					);
				}
			}else if(len === 1){
				each(this,
					function(val){
						temp.push(getCss(val,args[0]))
					}
				);
				return temp;
			}else{
				each(this,
					function (val){
						setCss(val, args[0], args[1])
					}
				);
				return this;
				
			}
		},
		width : function(){
			if( this.width ){
				return this.width;
			}else{
				return parseInt(this.css("width"),10);
			}
		},
		height: function(){
			if( this.height ){
				return this.height;
			}else{
				return parseInt(this.css("height"),10);
			}
		},
		show : function(){
			var that = this;
			each(this.css( display),
				function( val , idx){
					if(val === none){
						RBT.dom( that[idx] ).css(display,"")
					}
				}
			);
			return this;
		},
		hide : function(){
			var that = this;
			each(this.css( display),
				function( val , idx){
					if(val !== none){
						RBT.dom( that[idx] ).css(display,none)
					}
				}
			);
			return this;
		}
	})



})();