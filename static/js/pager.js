var firstImg = '';
var prevImg = '';
var nextImg = '';
var endImg = '';

function pager(url, total, scale, qryStr, pg) {
	var page = 0;
	var pgStr = "";
	var forvar = 0;
	var totalPg = 0;
	var pgClus = 0;
	var pgScale = 10;

	var i = 0;
	var next = 0;

	page = (pg ? pg : 1);
	qryStr = "&" + qryStr;

	if (parseInt(total) > parseInt(scale))	{

		forvar = Math.ceil(total / scale);
		totalPg = forvar;

		if (forvar > pgScale) {
			forvar = pgScale;
		};

		pgClus = pgScale * Math.floor((page - 1) / pgScale);

		//first page
		if (page > 10) {
			pgStr += '<a href="';
			pgStr += url + "?pg=1&pgSz=" + scale + qryStr;
			pgStr += '" class="btn-page first" title="처음"><span class="blind">처음</span></a>';

		};

		//shows previous page link if first page is passed
		if (page > (forvar)) {
			pgStr += '<a href="';
			pgStr += url + "?pg=" + pgClus + "&pgSz="+ scale + qryStr;
			pgStr += '" class="btn-page prev" title="이전"><span class="blind">이전</span></a>';
		};

		for (i = 1 + pgClus; i <= forvar + pgClus; i++) {
			if (i <= totalPg) {

				if (i == page) {
					pgStr += '<a href="javascript:void(0);" class="on"><span>' + i + '</span></a>';
				} else {
					pgStr += '<a href="' + url + '?pg=' + i + '&pgSz=' + scale + qryStr + '"><span>' + i + '</span></a>';
				};
			};
		};

		//shows next page if exists
		if(totalPg > forvar + pgClus) {
			next = forvar + pgClus + 1;
			pgStr += '<a href="';
			pgStr += url + '?pg=' + next + '&pgSz=' + scale + qryStr;
			pgStr += '" class="btn-page next" title="다음"><span class="blind">다음</span></a>';
		};

		//last page
		if(totalPg > 0 && totalPg > forvar + pgClus) {
			pgStr += '<a href="';
			pgStr += url + '?pg=' + totalPg + '&pgSz=' + scale + qryStr;
			pgStr += '" class="btn-page last" title="마지막"><span class="blind">마지막</span></a>';
		}
	};

	$(".pagination").html(pgStr);
};

function pagerAjax(url, total, scale, qryStr, pg, callbackName, selector) {
	var $selector;
	if(typeof selector != "undefined"){
		$selector = $(selector);
	} else {
		$selector = $(".pagination");
	}

	var page = 0;
	var pgStr = "";
	var forvar = 0;
	var totalPg = 0;
	var pgClus = 0;
	var pgScale = 10;

	var i = 0;
	var next = 0;

	page = (pg ? pg : 1);

	if (parseInt(total) > parseInt(scale))	{

		forvar = Math.ceil(total / scale);
		totalPg = forvar;

		if (forvar > pgScale) {
			forvar = pgScale;
		};

		pgClus = pgScale * Math.floor((page - 1) / pgScale);

		//first page
		if (page > 10) {
			pgStr += '<a href="javascript:void(0);" class="btn-page first" title="처음" onclick="';
			pgStr += 'goPageAjax(\'' + url + "?pg=1&pgSz=" + scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '" ><span class="blind">처음</span></a>';
		};

		//shows previous page link if first page is passed
		if (page > (forvar)) {
			pgStr += '<a href="javascript:void(0);" class="btn-page prev" title="이전" onclick="';
			pgStr += 'goPageAjax(\'' + url + "?pg=" + pgClus + "&pgSz="+ scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '"><span class="blind">이전</span></a>';
		}

		for (i = 1 + pgClus; i <= forvar + pgClus; i++) {
			if (i <= totalPg) {
				if (i == page) {
					pgStr += '<a href="javascript:void(0);" class="on"><span>' + i + '</span></a>';
				} else {
					pgStr += '<a href="javascript:void(0);" onclick="';
					pgStr += 'goPageAjax(\'' + url + '?pg=' + i + '&pgSz=' + scale + qryStr + '\', ' + callbackName + ');';
					pgStr += '"><span>' + i + '</span></a>';
				};
			};
		};

		//shows next page if exists
		if(totalPg > forvar + pgClus) {
			next = forvar + pgClus + 1;
			pgStr += '<a href="javascript:void(0);" class="btn-page next" title="다음" onclick="';
			pgStr += 'goPageAjax(\'' + url + '?pg=' + next + '&pgSz=' + scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '"><span class="blind">다음</span></a>';
		}

		//last page
		if(totalPg > 0 && totalPg > forvar + pgClus) {
			pgStr += '<a href="javascript:void(0);" class="btn-page last" title="마지막" onclick="';
			pgStr += 'goPageAjax(\'' + url + '?pg=' + totalPg + '&pgSz=' + scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '"><span class="blind">마지막</span></a>';
		}
	};

	$selector.html(pgStr);
};

function pagerScale5Ajax(url, total, scale, qryStr, pg, callbackName) {
	var page = 0;
	var pgStr = "";
	var forvar = 0;
	var totalPg = 0;
	var pgClus = 0;
	var pgScale = 5;

	var i = 0;
	var next = 0;

	page = (pg ? pg : 1);

	if (parseInt(total) > parseInt(scale))	{

		forvar = Math.ceil(total / scale);
		totalPg = forvar;

		if (forvar > pgScale) {
			forvar = pgScale;
		};

		pgClus = pgScale * Math.floor((page - 1) / pgScale);

		//first page
		if (page > 1) {
			pgStr += '<button type="button" class="btn_paging_first" onclick="';
			pgStr += 'goPageAjax(\'' + url + "?pg=1&pgSz=" + scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '"><span class="hidden">처음으로</span></button>';
		};

		//shows previous page link if first page is passed
		if (page > (forvar)) {
			pgStr += '<button type="button" class="btn_paging_prev" onclick="';
			pgStr += 'goPageAjax(\'' + url + "?pg=" + pgClus + "&pgSz="+ scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '"><span class="hidden">앞으로</span></button>';
		}

		pgStr += '<div class="page_num">';
		for (i = 1 + pgClus; i <= forvar + pgClus; i++) {
			if (i <= totalPg) {
				if (i == page) {
					pgStr += '<strong aria-current="page">' + i + '</strong>';
				} else {
					pgStr += '<a href="javascript:void(0);" onclick="';
					pgStr += 'goPageAjax(\'' + url + '?pg=' + i + '&pgSz=' + scale + qryStr + '\', ' + callbackName + ');';
					pgStr += '">' + i + '</a>';
				};
			};
		};
		pgStr += '</div>';

		//shows next page if exists
		if(totalPg > forvar + pgClus) {
			next = forvar + pgClus + 1;
			pgStr += '<button type="button" class="btn_paging_next" onclick="';
			pgStr += 'goPageAjax(\'' + url + '?pg=' + next + '&pgSz=' + scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '"><span class="hidden">뒤로</span></button>';
		}

		//last page
		if(totalPg > 0 && totalPg != page) {
			pgStr += '<button type="button" class="btn_paging_last" onclick="';
			pgStr += 'goPageAjax(\'' + url + '?pg=' + totalPg + '&pgSz=' + scale + qryStr + '\', ' + callbackName + ');';
			pgStr += '"><span class="hidden">마지막으로</span></button>';
		}
	} else {
		pgStr += '<div class="page_num">';
		pgStr += '<strong aria-current="page">1</strong>';
		pgStr += '</div>';
	};

	$(".pagination").html(pgStr);
};

function goPageAjax(url, callback) {
	loadHtmlAjax(url, "GET", {}, function(data) {
		callback(data);
	});
}

// 더보기
function pageMoreAjax(url, total, scale, qryStr, pgSelector, btnSelector, callback) {
	var totalPg = 0;
	var pgScale = 5;
	var pg = 1;
	var btnObj = $("#" + btnSelector);
	var pgObj = $("#" + pgSelector);
	if($(pgObj).length > 0){
		pg = Number($(pgObj).val() || '1');
	} else {
		// console.log('<input type="hidden" id="' + pgSelector + '" name="' + pgSelector + '" value="' + pg + '" />');
		pgObj = $('<input type="hidden" id="' + pgSelector + '" name="' + pgSelector + '" value="' + pg + '" />');
		$("body").append(pgObj);
	}

	var hide = false;

	if (parseInt(total) > parseInt(scale))	{
		totalPg = Math.ceil(total / scale);

		// last page 더보기버튼 숨김
		hide = totalPg == pg ? true : false
	} else {
		// 더보기버튼 숨김
		hide = true;
	};


	url = url + '?pg=' + pg + '&pgSz=' + scale + qryStr;
	loadHtmlAjax(url, "GET", {}, function(data) {
		callback(data);

		$(pgObj).val(pg+1);

		// hide 더보기 버튼 숨김 여부
		if(hide){
			$(btnObj).hide();
		} else {
			$(btnObj).show();
		}
	});
};
