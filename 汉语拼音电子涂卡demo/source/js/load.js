(function(){
	/*計數*/
/*預加載ui顯示*/
	if(cwxbox){
		var timer_load;
		var delay=0;
		cwxbox.box.show('<div id="testLoad" class="progress progress-striped active"><div id="loadPresent" class="bar bar-info"></div><div id="loadData">'+loadNum+'%<div></div>');
		timer_load=setInterval(
			function(){
				var textV=Math.floor((loadNum/divNum)*100);
				document.getElementById('loadData').innerHTML=textV+"%";
				document.getElementById('loadPresent').style.width=(parseInt(textV)-parseInt(textV)%5)+"%";
				if(loadNum>=divNum){
					if(delay>=100){
						cwxbox.box.hide();
						clearInterval(timer_load);
					}else{
					delay++;
					}
				}
			}
			,5);
	}
})();

(function(){
/*預加載圖片*/
	var basicURL1 = "images/index_image/";
	var perData1 = ["b_h.png","b_a.png","p_h.png","p_a.png","m_h.png","m_a.png","f_h.png","f_a.png","g_h.png","g_a.png","k_h.png","k_a.png","h_h.png","h_a.png","zh_h.png","zh_a.png","ch_h.png","ch_a.png","sh_h.png","sh_a.png","r_h.png","r_a.png","d_h.png","d_a.png","t_h.png","t_a.png","n_h.png","n_a.png","l_h.png","l_a.png","j_h.png","j_a.png","q_h.png","q_a.png","x_h.png","x_a.png","z_h.png","z_a.png","c_h.png","c_a.png","s_h.png","s_a.png","a_h.png","a_a.png","o_h.png","o_a.png","e_h.png","e_a.png","i_h.png","i_a.png","u_h.png","u_a.png","u1_h.png","u1_a.png","er_h.png","er_a.png","ai_h.png","ai_a.jpg","ei_h.png","ei_a.jpg","ao_h.png","ao_a.jpg","ou_h.png","ou_a.jpg","iao_h.png","iao_a.jpg","iu-iou_h.png","iu-iou_a.jpg","uai_h.png","uai_a.jpg","ui-uei_h.png","ui-uei_a.jpg","ia_h.png","ia_a.jpg","ie_h.png","ie_a.jpg","ua_h.png","ua_a.png","uo_h.png","uo_a.png","u1e_h.png","u1e_a.png","an_h.png","an_a.jpg","ian_h.png","ian_a.jpg","uan_h.png","uan_a.jpg","u1an_h.png","u1an_a.jpg","en_h.png","en_a.jpg","in_h.png","in_a.jpg","u1n_h.png","u1n_a.jpg","ang_h.png","ang_a.jpg","iang_h.png","iang_a.jpg","uang_h.png","uang_a.jpg","eng_h.png","eng_a.jpg","ing_h.png","ing_a.jpg","ueng_h.png","ueng_a.jpg","ong_h.png","ong_a.jpg","iong_h.png","iong_a.jpg","a.png","o.png","e.png","i.png","u.png","u1.png","er.png","ai.jpg","ei.jpg","ao.jpg","ou.jpg","ia.jpg","ie.jpg","ua.png","uo.png","iao.jpg","iu-iou.jpg","uai.jpg","ui-uei.jpg","u1e.png","an.jpg","ian.jpg","uan.jpg","u1an.jpg","ang.jpg","iang.jpg","uang.jpg","eng.jpg","en.jpg","in.jpg","un-uen.jpg","u1n.jpg","ing.jpg","ueng.jpg","ong.jpg","iong.jpg","ou_h.png"];
	var basicURL2 = "images/";
	var perData2=["queding_h.png","lieyin_h.png","zhuye.png","shang.png","bottom1.png","xia.png","zhuye_h.png","autoplay_h.png"];
	var perImage1 = [];
	var perImage2 = [];
	var perAudio =new Audio();
	for(var i=0;i<perData1.length;i++){
		perImage1[i] = new Image();
		perImage1[i].src = basicURL1 + perData1[i];
	}	
	for(i=0;i<perData2.length;i++){
		perImage2[i] = new Image();
		perImage2[i].src = basicURL2 + perData2[i];
	}
})();

/*顯示和隱藏*/
function troggleNav(){
	var len=arguments.length;
	for(var i=0;i<len;i++){
		$(arguments[i]).toggle();
	}
}