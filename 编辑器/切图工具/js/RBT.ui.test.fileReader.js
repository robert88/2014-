;(function(){
	window.RBT = window.RBT||{};
	var g_dom = RBT.namespace("RBT.dom"),
		g_test = RBT.namespace("RBT.ui.test");
		
	g_test.fileReader = function(){
			if(dom(".showlayout").length){
				dom("body").append("<div class='layout'></div>");
			}
			if(window.File && window.FileReader && window.FileList && window.Blob) {  
				dom(".showlayout").html("<span style='color:#008000'>Great success! All the File APIs are supported.</span>");  
			} else {  
				dom(".showlayout").html('<span style="color:red">The File APIs are not fully supported in this browser.</span>');  
			}
	}

})();

