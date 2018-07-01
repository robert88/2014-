	window.RBT = window.RBT||{};

	RBT.zoom = 0;
	//默认允许变动底图名称
	RBT.pageCount = 0;
	//默认允许使用div.uidata标签内容
	RBT.allowData = true;
;(function(){
	//依赖
	RBT.resize ={
		bgIdx:-1,
		contain:null,
		isAni:false,
		aniIdx:-1,
		aniObj:null,
		getBgContent:function() {
			var ids = ["#bg_1024","#bg_1536","#bg_2048"];
			var content = [];
			var $temp;
			for(var i=0; i<ids.length; i++){
				content[i] = {};
				$temp = content[i].tojQ = $(ids[i]);
				content[i].id = ids[i];
				content[i].width = $temp.width();
				content[i].height = $temp.height();
				content[i].multi = 1 + .5*i;
			}
			return content;
		},
		style : function(str){
			var head = document.getElementsByTagName("head")[0];
			if(head){
				var styles = document.getElementsByTagName("style");
				var style;

				if(!styles){
					style = document.createElement("style");
					head.appendChild( style );
				}else{
					 style = styles[styles.length-1];
				}
				//ie 不能直接插入css样式
				try{
					style.innerHTML += str;
				}catch(e){
					style.styleSheet.cssText += str;
				}
				
			}else{
				alert("网页未加载完成！")
			}
		},
		initBgPage:false,
		initUiData:false,
		pageinit:function(){
			if((!this.initBgPage)&&RBT.pageCount){
				var $bg_1024 = $("#bg_1024"),
					path = $bg_1024.css("background-image"),
					pathReg = /PAGE_(\d+)\.jpg/g.exec(path),
					pageNum = 0;

				if(pathReg){
					this.initBgPage = true;
					pageNum = parseInt(pathReg[1],10)+RBT.pageCount;
					if(pageNum<10){
						pageNum ="000"+pageNum;
					}else if(pageNum<100){
						pageNum ="00"+pageNum;
					}else if(pageNum<1000){
						pageNum ="0"+pageNum;
					}
					RBT.resize.style("	#bg_1024.bg,#bg_1024 .bg{background-image:url(../../PAGE_"+pageNum+".jpg);}#bg_1536.bg,#bg_1536 .bg{background-image:url(../../PAGE_"+pageNum+"_150.jpg);}#bg_2048.bg,#bg_2048 .bg{background-image:url(../../PAGE_"+pageNum+"_200.jpg);}")
				}
			}
		},
		getUiData:function(){
			if(!this.initUiData){

				var  $bg_1024 = $("#bg_1024"),
					dataUIDom = $("body").find(".uidata"),
					bgposition = $bg_1024.css("background-position"),
					bgReg = /(-?\d+)px\s+(-?\d+)px/.exec(bgposition),
					bgx = 0,
					bgy = 0;

				if(bgReg){
					bgx = parseInt(bgReg[1],10);
					bgy = parseInt(bgReg[2],10);
				}

				var uidata ="",
					x = Math.abs((parseInt($bg_1024.css("left"),10)||0)+bgx),
					y = Math.abs((parseInt($bg_1024.css("top"),10)||0)+bgy),
					w = $bg_1024.width(),
					h = $bg_1024.height();

				if(dataUIDom.length&&RBT.allowData){
					uidata = dataUIDom.html();
				}else{
					uidata = "width:"+(w/10.24)+" height:"+(h/15.36)+" x:"+(x/10.24)+" y:"+(y/15.36);
				}

				this.initUiData = true;
				RBT.localStorage.removeItem("uidata");
				RBT.localStorage.setItem("uidata",uidata);
			}
		},
		selectBg:function(callbefore , callback){
			var bodyWidth = $(document.body).width();
			var cur = 0,
				per = this.bgIdx,
				contain = [],
				len,
				args = arguments,
				argLen = args.length,
				isAni = this.isAni,
				aniIdx = this.aniIdx;
			if(!this.contain){
				 this.contain = this.getBgContent();
			}
			this.pageinit();
			this.getUiData();

			var contain	 = this.contain,
				len = contain.length;

			for(var i=1; i<len; i++){
				if(bodyWidth < contain[i].width){
					cur = i-1;
					break;
				}
				cur = i;
			}

			//电子书中不支持放大 chrome parent 不支持本地访问
			try{
				if(window.iWebKit||parent.iWebKit){
					cur = RBT.zoom;	
				}
			}catch(e){

			}
			
			//RESIZE WINDOW
			if( per !== cur ){	
					
				//显示之前做的事
				if(typeof callbefore === "function"){
					if(callbefore( cur, contain)===false){
						return;
					};
				}			
				
				//确定动画
					for(var i=0; i<argLen; i++){
						if(args[i].constructor === Array){
							if(args[i][0].constructor === RBT.animate){
								isAni = this.isAni = true;
								aniIdx = this.aniIdx = i;
								this.aniObj = args[aniIdx][cur];
								break;
							}
						}
					}
					if(i === argLen){
						this.isAni = false;
					}
				//开始动画
				if(this.isAni){
					for(var i=0; i<args[aniIdx].length; i++ ){
						args[aniIdx][i].stopAnimate().stopTimer().updateUi();
					}
					this.aniObj.startAnimate();
				}

				for(i=0; i<len; i++){
					contain[i].tojQ.hide();
				}
				
				//当前容器显示
				contain[cur].tojQ.show();

				this.bgIdx = cur;
				
				//回调函数
				if(typeof callback === "function"){
					callback( cur, contain);
				}

			}
			return this;
		},
		//将容器拷贝 
		initBgHTML:function(contain, set){
			$(set).html($(contain).html());
			return this;
		},
		//等比例放大
		initBgContent:function (position,size,background, x, y){
			if(!this.contain){
				 this.contain = this.getBgContent();
			}

			var contain	 = this.contain,
				len = contain.length,
				getId = contain[0].id,
				setId,
				setter,
				getter;

			//初始化背景
			if(arguments.length < 1){
				background = size = position = [""];
			}
			

				
			for(var i=1; i<len; i++){
				setId = contain[i].id;
				for(var j=0; j<position.length; j++) {
					setter = setId + " " + position[j];
					getter = getId + " " + position[j];
					this.changePosition(setter, getter, contain[i].multi, x, y);
				}
				for(var j=0; j<size.length; j++){
					setter = setId + " " + size[j];
					getter = getId + " " + size[j];
					this.changeSize(setter, getter, contain[i].multi, x, y);
				}
				for(var j=0; j<background.length; j++){
					setter = setId + " " + background[j];
					getter = getId + " " + background[j];
					this.changeBackground(setter, getter, contain[i].multi, x, y);
				}
			}
			//设置好背景容器之后必须更新contain
			 this.contain = this.getBgContent();
			 return this;
		},
		changePosition:function(setter, getter, multiple, offsetx, offsety){

			offsetx = offsetx||0;
			offsety = offsety||0;

			var $setter = $(setter),
				$getter = $(getter),
				getterArrayInfo = [];

			$getter.each(function(idx, val){
				var temp = {},
					$this = $(this);
					
				temp.x = parseInt($this.css("left"),10);
				temp.y = parseInt($this.css("top"),10)
				getterArrayInfo.push(temp);
			});
			$setter.each(function(idx, val){
				$(this).css({
					left:Math.round(getterArrayInfo[idx].x*multiple+offsetx)+"px",
					top:Math.round(getterArrayInfo[idx].y*multiple+offsety)+"px"
				})
			})

			return this;
		},
		changeSize:function(setter,getter,multiple,offsetx,offsety){

			offsetx = offsetx||0;
			offsety = offsety||0;

			var $setter = $(setter),
				$getter = $(getter),
				getterArrayInfo = [];

			$getter.each(function(idx, val){
				var temp = {},
					$this = $(this);

				temp.w = $this.width();
				temp.h = $this.height();
				getterArrayInfo.push(temp);
			});

			$setter.each(function(idx, val){
				$(this).css({
					width:Math.round(getterArrayInfo[idx].w*multiple+offsetx)+"px",
					height:Math.round(getterArrayInfo[idx].h*multiple+offsety)+"px"
				})
			})
			return this;
		},
		changeBackground:function(setter,getter,multiple,offsetx,offsety){

			var $setter = $(setter),
				$getter = $(getter),
				getterArrayInfo = [];

			offsetx = offsetx||0;
			offsety = offsety||0;	
			
			$getter.each(function(idx, val){
				var temp = {},
					$this = $(this),
					bgposition=/.*?([-]?\d+)px.*?([-]?\d+)px/g.exec($this.css("background-position"))||[];

				temp.x = parseInt(bgposition[1],10);
				temp.y = parseInt(bgposition[2],10);
				getterArrayInfo.push(temp);
			});

			$setter.each(function(idx, val){
				$(this).css("background-position",Math.round(getterArrayInfo[idx].x*multiple+offsetx)+"px "+Math.round(getterArrayInfo[idx].y*multiple+offsety)+"px")
			});
			return this;
		},
		//测试
		test:function(){
			$("body").append("<div class='testUi' style='width:100px;height;25px;border:1px solid #666;position:absolute'>toggle body</div>");
			$(".testUi").css("top",(window.innerHeight-30)+"px")
			.bind("click",function(){
				$("#bg_1024").children().toggle();
				$("#bg_1536").children().toggle();
				$("#bg_2048").children().toggle();
			})
			return this;
		},
		bg:function(){
			$("body").append("<div class='testBg' style='width:100px;height;25px;border:1px solid #666;postion:relative'>toggle body</div>");
			var bgposition,str,imgName,bgX,bgY,w,h,getter;
			var temp=[];
			var temp1=[];
			var temp2=[];
			var bgcontent=getBgContent();
			for(var i=0;i<3;i++){
				$getter=$(bgcontent[i].id);
				bgposition=/.*?([-]?\d+)px.*?([-]?\d+)px/g.exec($getter.css("background-position"))
				str=$getter.css("background-image")
				imgName=str.substring(str.lastIndexOf("/")+1,str.lastIndexOf(")"));
				bgX=parseInt(bgposition[1],10);
				bgY=parseInt(bgposition[2],10);
				w=$getter.width();
				h=$getter.height();
				temp.push("'",imgName,"',");
				temp1.push("{x:",bgX,",y:",bgY,"},");
				temp2.push("{x:",w,",y:",h,"},");
			}
			$(".testBg").html("var g_cutImages=["+temp.join('')+"]\n"+"var g_cutCoor=["+temp1.join('')+"]\nvar g_cutsize=["+temp2.join('')+"]")	
			return this;	
		}
	}

}());
