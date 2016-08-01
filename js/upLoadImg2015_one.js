//使用的频道：分类信息
$.fn.uploadImgWap = function(){
	var t = $(this),
		btn = $('#upimgFileBtn');
	btn.click(function(e){
		e.preventDefault();
		t.trigger('click');
	});
	t.change(function(){
		$('#fileForm').trigger('submit');
	});
}
function upLoad_init(){
	showMyImageHeight();
	reset_moveBtn();
	var options = {
		beforeSubmit: function(){
			$('#pageLoaderNode').show();
		},
		success: function(data){
			$('#pageLoaderNode').hide();
			if(data.error == 1){alert(data.message);return false;}
			/*var urlhidden = $("#urlhidden");
			if( urlhidden.val()=="" ){
				urlhidden.val(data.id);
			}else{
				urlhidden.val(urlhidden.val()+","+data.id);
			}*/
			saveMyImage(data);
		},
		url: '/kindeditor/upload_json.ashx',
		type: 'post',
		dataType: 'json',
		clearForm: true,
		resetForm: true,
		timeout: 60000
	}
	$('#fileForm').ajaxForm();
	$("#fileForm").bind('submit',function(){
	   $(this).ajaxSubmit(options);
	   return false;
	});
	$('#imgFile').uploadImgWap();
}
function showMyImageHeight(){
	var node = $('#xiangce').find('.imgview'),heightNum = 0;
	$('#upimgFileBtn').imagesLoaded(function(){
		heightNum = $(this).height();
		node.css({'height':heightNum+'px'});
	});
}
function reset_moveBtn(){
	var node = jQuery('#xiangce');
	if(node.length<1){return;}
	node.find('.move_next,.move_prev').show();
	node.find('.move_next').css({'left':'41px'});
	node.find('.my_prop_imgitem:last .move_next').hide();
	node.find('.my_prop_imgitem:first .move_prev').hide();
	node.find('.my_prop_imgitem:first .move_next').css({'left':'10px'});
}
function move_PrevNext(o,index,sortval,picid,pageid,tableid,total){
	var url = '/request.ashx?action=picmove&pn='+index+'&id='+picid+'&intorder='+sortval+'&table_id='+tableid;
	var Digital=new  Date();
	Digital=Digital+40000;
	url=url+"&k="+encodeURIComponent(Digital);
	var ht = jQuery(o).parent(),ht2 = '';
	jQuery.ajax({url:url,success:function(data){
		if(data.islogin == '1'){
			
			if(index === 0){
				ht2 = ht.prev();
				ht.detach().insertBefore(ht2);
			}else{
				ht2 = ht.next();
				ht.detach().insertAfter(ht2);
			}
			reset_moveBtn();
		}else{
			alert(data['error']);
		}
	}});
	return false;
}
function set_FM(o,imgURL){
	$('#url0').val(imgURL);
	$('#xiangce').find('.set_FM').html('封面');
	$(o).html('已设');
	return false;	
}