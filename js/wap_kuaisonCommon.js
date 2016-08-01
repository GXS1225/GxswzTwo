function lazyImg(selector){
	var w_h = $(window).height();
	
	$(selector).find('img').each(function(){
		if($(this).attr("data-ifshow") === '0' && ($(this).offset().top - w_h)<0 && $(this).attr('data-src') !=='' ){
			$(this).attr({'src':$(this).attr('data-src'),"data-ifshow":'1'})
		}
	});
	
}
function getPagingGlobal(obj,showjuli,isFirstPage){
	keyvalues = $.extend({'p':'1'},keyvalues,obj);

	var current_host = window.location;
	var url_obj = $.url(current_host).param();
	var iPage = keyvalues['p'];
	if(url_obj['page'] !== '' && typeof url_obj['page'] !== 'undefined'){
		iPage = parseInt(url_obj['page']);
	}
	if(typeof isFirstPage == 'undefined'){
		keyvalues['p'] = iPage; //刷新或返回 当前页
	}else if(isFirstPage == '2'){
		keyvalues['p'] = '1'; //真正的第一页
	}else if(isFirstPage == '0'){
		keyvalues['p'] = parseInt(iPage)+1; //正常至底部加载下一页
	}else{}
	get_data_paging(callback);
	function callback(data){
		if(data[0].islogin !== '1'){MSGwindowShow('revert','0',data[0].error,'','');return;}
		function showPaging(){
			$('#pagingList').append(data[0].MSG);
			$('#pageNavigation').html(data[0].PageSplit);
			getkill();
			showjuli&&showMapBD(keyvalues.x,keyvalues.y);
			setTimeout(function(){lazyImg('#pagingList',false);},50);
		}
		if(typeof window['isIscroll5'] === 'undefined'){$('#pagingList').empty();showPaging();return false;}
		$('#pullUp').hide();
		$('#pageLoader').hide();
		if(keyvalues["p"] === '1'){
			ifNoMore = false;
			$('#pagingList').empty();
			$('#pullDown').find('.loader').hide();
			$('#pullDown').hide();
			$('#reload').find('.txt').html('下拉可以刷新');
			$('#reload').find('.s').removeClass('s_ok');
			setTimer();	
		}
		showPaging();
		if(keyvalues["p"] == data[0].PageCount || data[0].PageCount == '0'){
			ifNoMore = true;
			lis = document.createElement('li');
			lis.innerText = '没有更多了';
			lis.className = 'noMore';
			lis.id = 'noMore';
			$('#pagingList').append(lis);
		}
		setTimeout(function () {
			myScroll.refresh();
		}, 10);
		history.pushState(null, '', '?page='+keyvalues['p']);
	}
	return false;
}









$.fn.pagelist2 = function(){//便利店
	var node = $(this),
		list = node.find('.item'),
		w_w = $(window).width(),
		img_w = (w_w-70)/2,
		item_w = (w_w-30)/2;
	
	list.each(function(){
		if($(this).attr('data-styleid') === '1'){
			$(this).find('.buycar').html('点击进入购买').attr({'href':$(this).attr('data-httpurl')});
			$(this).find('.link').attr({'href':$(this).attr('data-httpurl')});
		}else{
			$(this).find('.buycar').bind('click',function(e){
				e.preventDefault();
				setShoppingCart2($(this),$(this).attr('data-id'),'1');
			});	
		}
		if($(this).attr('data-styleid') === '0' && $(this).attr('data-kcnum') === '0'){
			$(this).find('.maiguang').css('display','block');
		}
		$(this).css({'width':item_w+'px'});
		$(this).find('img').css({'width':img_w+'px','height':img_w+'px'});
	});
}
$.fn.pagelist1 = function(){//餐饮
	var node = $(this),
		list = node.find('.item');
	list.each(function(){
		var t = $(this);
		if($(this).attr('data-styleid') === '0' && $(this).attr('data-kcnum') === '0'){
			$(this).find('.maiguang').css('display','block');
			$(this).find('.fen').css('display','none');
		}
		$(this).find('.add').click(function(e){
			e.preventDefault();
			var num = parseInt(t.find('.amount').html())+1;
			setShoppingCart1($(this).parent(),t.attr('data-id'),num);
		});
		$(this).find('.dec').click(function(e){
			e.preventDefault();
			var num = parseInt(t.find('.amount').html())-1;
			setShoppingCart1($(this).parent(),t.attr('data-id'),num);
		});
	});
}
function showQison(val1,val2){
	if((val1 > 0) && (val1 > val2)){
		$('#myShopCartSubmit').html('还差' + (val1 - val2) + '元起送').addClass('disabled').prop('disabled',true);
	}else{
		$('#myShopCartSubmit').html('立即下单').removeClass('disabled').prop('disabled',false);
	}
}
function getShoppingCart(callback){
	var url=siteUrl+'request.ashx?action=getmyshopping&shopid='+window['SHOPID']+'&ishtml='+window['ISHTML']+'&delid=&jsoncallback=?';
	$.getJSON(url,function(data){
		if(data[0].islogin === '1'){
			uploadShoppingCart(data[0].CHRMONEY);
			callback&&callback.call(this,data[0].JSONMSG);
		}else{
			MSGwindowShow('shopping','0',data[0].error,'','');
		}
	});
}
function uploadShoppingCart(data){
	$('#numAll').html(data.numAll);
	$('#chrmoneyAll').html(data.chrmoneyAll);
	$('#chrmoneyYunfei').html(parseInt(data.chrmoneyYunfei));
	showQison(parseFloat($('#myShopCart').attr('data-shipmoney1')),parseFloat(data.chrmoneyAll));
}
function setShoppingCart1(node,sid,num){
	var url=siteUrl+'request.ashx?action=addmyshopping&id='+sid+'&styleid='+window['GOODSTYLEID']+'&num='+num+'&shopid='+window['SHOPID']+'&ishtml='+window['ISHTML']+'&delid=&jsoncallback=?&timer='+Math.random();
	$.getJSON(url,function(data){
		if(data[0].islogin === '1'){
			node.find('.amount').html(num);
			uploadShoppingCart(data[0].CHRMONEY);
			uploadSubCatNum1();
			if(num ===0){
				node.find('.dec').hide();
				node.find('.amount').hide();
			}else{
				node.find('.dec').show();
				node.find('.amount').show();
			}
		}else{
			MSGwindowShow('shopping','0',data[0].error,'','');
		}
	});
}
function setShoppingCart2(node,sid,num){
	var url=siteUrl+'request.ashx?action=addmyshopping&id='+sid+'&styleid='+window['GOODSTYLEID']+'&num='+num+'&shopid='+window['SHOPID']+'&ishtml='+window['ISHTML']+'&delid=&jsoncallback=?&timer='+Math.random();
	
	$.getJSON(url,function(data){
		if(data[0].islogin === '1'){
			uploadShoppingCart(data[0].CHRMONEY);
			node.hide().parent().find('.buycar2').show();
		}else{
			if(typeof typeid !== 'undefined'){
				if('increase' === typeid){
					$('#gouwuche'+sid).val(parseInt($('#gouwuche'+sid).val())-1);
				}
			}
			MSGwindowShow('shopping','0',data[0].error,'','');
		}
	});
}
function showProductList1(data){
	var i=0,len=data.length,num=0;
	for(;i<len;i++){
		var t_item = $('#pro_item_'+data[i].goodid);
		t_item.find('.dec').show().end().find('.amount').html(data[i].num).show();
	}
	uploadSubCatNum1();
}
function showProductList2(data){
	var i=0,len=data.length;
	for(;i<len;i++){
		$('#item_'+data[i].goodid).find('.buycar').hide().end().find('.buycar2').show();
	}
}
function uploadSubCatNum1(){
	var prolist = $('#prolist'),items = prolist.find('.pro_item');
	items.each(function(){
		var num=0,node = $('#scrolld_plist_'+$(this).attr('data-id'));
		$(this).find('.amount').each(function(){
			num = num+parseInt($(this).html());							  
		});
		node.html(num);
		if(num === 0){
			node.addClass('display10');
		}else{
			node.removeClass('display10');
		}
		
	});
}
function addFav(o,data){
	if($('#isLogin').val() === '0'){
		var url = siteUrl+'member/login.html?from='+encodeURIComponent(window.location.href);
		MSGwindowShow('revert','1','对不起，请登录后再进行收藏！',url,'');
		return false;
	}
	var url = siteUrl+'request.ashx?action=addshoucang&shopid='+data.shopid+'&id='+data.productid+'&styleid='+data.styleid+'&jsoncallback=?&timer='+Math.random();
	$.getJSON(url,function(data){
		if(data[0].islogin === '1'){
			$(o).addClass('favok').html('收藏成功');
		}else{
			MSGwindowShow('shopping','0',data[0].error,'','');
		}
	});
}
function delFav(data){
	var url = siteUrl+'request.ashx?action=delshoucang&shopid='+data.shopid+'&id='+data.productid+'&jsoncallback=?&timer='+Math.random();
	$.getJSON(url,function(data){
		if(data[0].islogin === '1'){
			MSGwindowShow('shopping','1','删除收藏成功！',window.location.href,'');
		}else{
			MSGwindowShow('shopping','0',data[0].error,'','');
		}
	});
}





















