
function show_min_code(id) {
	if($('#code_cnt_'+id).css('display')=='none'){
		$('#code_cnt_' + id).css('display','block');
		$('#excode_' + id + 'a').html('<img src="images/egcod2.png"/>');
		$('#excode_' + id + 'b').text('Click to hide');


	}else{
		$('#code_cnt_' + id).css('display','none');
		$('#excode_' + id + 'a').html('<img src="images/egcod1.png"/>');
		$('#excode_' + id + 'b').text('Click to see');
	}
}

function show_min_yturn(id) {
	if($('#yturn_cnt_'+id).css('display')=='block'){
		$('#yturn_cnt_' + id).css('display','none');
		$('#yturn_' + id).html('<img src="images/b01a.png"/>');
	}else{
		$('#yturn_cnt_' + id).css('display','block');
		$('#yturn_' + id).html('<img src="images/b01b.png"/>');
	}
}

function show_min_morett(id) {
	if($('#morett_cnt_'+id).css('display')=='none'){
		$('#morett_cnt_' + id).css('display','block');
		$('#morett_' + id).html('<img src="images/b05b.png"/>');
		//
		//--Custom Event to trigget activity initializiation when div is shown
		$('#morett_cnt_'+id).trigger( "objectShown");
	}else{
		$('#morett_cnt_' + id).css('display','none');
		$('#morett_' + id).html('<img src="images/b05a.png"/>');
	}
}


function show_min_ccode(id) {
	if($('#ccode_cnt_'+ id).css('display')=='none'){
		$('#ccode_cnt_' + id).css('display','block');
		$('#ccode_tag_' + id).html('<img src="images/b03b.png"/>');

	}else{
		$('#ccode_cnt_' + id).css('display','none');
		$('#ccode_tag_' + id).html('<img src="images/b03a.png"/>');
	}
}


function show_min_syn(id) {
	if($('#syn_cnt_'+ 'l_' + id).css('display')=='none'){
		$('#syn_cnt_' + 'l_' + id).css('display','block');
		$('#syn_cnt_' + 's_' +id).css('display','none');
		$('#syn_tag_' + id).html('<img src="images/zoom-out.png"/>');


	}else{
		$('#syn_cnt_' + 'l_' + id).css('display','none');
		$('#syn_cnt_' + 's_' + id).css('display','block');
		$('#syn_tag_' + id).html('<img src="images/zoom.png"/>');
	}
}

function show_min_ans(id) {
	if($('#ans_cnt_'+ id).css('display')=='none'){
		$('#ans_cnt_' + id).css('display','block');
		$('#ans_tag_' + id).html('<img src="images/b02b.png"/>');
		<!--$('#ans_tag_' + id).html('<img src=image/showanswer_fmt7.png');
		<!--$('#ans_tag_' + id).html('<span class="sol _idGenCharOverride-16">▶</span> Show Answer');-->

	}else{
		$('#ans_cnt_' + id).css('display','none');
		$('#ans_tag_' + id).html('<img src="images/b02a.png"/>');
		<!--$('#ans_tag_' + id).html('<img src=image/hideanswer.png');
		<!--$('#ans_tag_' + id).html('<span class="sol _idGenCharOverride-16">▼</span> Hide Answer');-->
	}
}

function show_min_fm(id) {
	if($('#fm_cnt_'+id).css('display')=='none'){
		$('#fm_cnt_' + id).css('display','block');
		$('#fm_' + id).html('&#5121;');
	}else{
		$('#fm_cnt_' + id).css('display','none');
		$('#fm_' + id).html('&#5125;');
	}
}
