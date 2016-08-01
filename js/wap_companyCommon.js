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