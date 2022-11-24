
var ui = {
    init : function(){
        /* s: 공통 - Jung Kyung Jin  */
        if( $('.header').length > 0 ) {this.header.init();}                 //Header Event
        if( $('.d-layeropen').length > 0 ) {this.layer.init();}             //Layer Popup
        if( $('[data-tooltip]').length > 0 ) {this.tootip.init();}          //Board Modified Btn
        if( $('.slide-wrap').length > 0 ) { this.slide.init(); }            //Common Slick Slide
        if( $('.chk-all').length > 0 )  {this.check_all.init()}             //Checkbox All Check
        if( $('.select-box').length > 0 )  {this.select_box.init()}         //select box
        if( $('.box-file-add').length > 0 )  {this.file_add.init()}         //파일첨부
        if( $('.btn-tooltip').length > 0 ) {this.tooltip.init()}            //Tooltip
        if( $('.fixed-bottom-box').length > 0 ) {this.fixedTooltip.init()}     //Tooltip
        if( $('.btn-tooltip-out').length > 0 ) {this.tooltip_out.init()}            //Tooltip (영역밖)
        if( $('.sns-share').length > 0 ) {this.snsShare.init()}     //sns 공유하기
        if( $('.tab-wrap').length > 0 ) {this.tabMenu.init();}    // tab
        if( $('.select-box.footer-custom').length > 0 ) {this.familySite.init();} // family site
        /* e: 공통 - Jung Kyung Jin  */
        /*========================================================
            중소기업찾기
        ========================================================*/
        /* s: 맞춤기업찾기 - Jung Kyung Jin */
        if( $('.company-search-wrap').length ) {this.searchCustom.init()}
        if( $('.board-incruit .tag').length ) {this.tagToggleEvt.init()}
        /* e: 맞춤기업찾기 - Jung Kyung Jin */
        /* s: 기업 상세 - Jung Kyung Jin */
        if( $('.toggle-text-wrap').length ) { this.toggleTextTab.init() }   //기업상세 회사소개 문구 Toggle
        if( $('.top-cnt-bar').length ) { this.navTab.init(); }              //기업상세 상단 nav tab fixed
        if( $('.swiper-wrap').length ) { this.swiperSlide.init(); }         //기업상세 근무환경 Slide
        // if( $('.review-all-check').length ) { this.allCheck.init(); }       //기업상세 기업리뷰 keyword check box
        if( $('[name="wishCheck"]').length ) { this.wishCheck.init(); }     //기업상세 관심기업 등록하기 활성 비활성
        if( $('#detailShare').length ) { this.fixedShared.init(); }
        if( $('.condition-box').length ) {this.conditionToggleEvt.init()}
        /* e: 기업 상세 - Jung Kyung Jin */
        /*========================================================
            중소기업스토리
        ========================================================*/
        if( $('.declaration-list').length ) {this.declaration.init(); }
          /*========================================================
            중소기업 소식
        ========================================================*/
        /* s: 기업 상세 - Ham Seok Won */
        if($('.faq-list').length) {this.accordion_menu.init();}
        if( $('.certify-list').length ) {this.toggleFaq.init(); }
        /*========================================================
            중소기업 알기
        ========================================================*/
        /* s: 인식 개선 - Ham Seok Won */
        if( $('.sns-list').length ) {this.snsMouseOver.init(); }
        /*========================================================
            마이페이지
        ========================================================*/
        /* s: 채용지원 내역관리 - Ham Seok Won */
        if( $('.corp-info').length) {this.inputSize.init(); }
        /*========================================================
            사이트맵
        ========================================================*/
        if( $('.sub-list02').length) {this.listSlide.init(); }
        if( $('.no-mouse').length) {this.noContext.init(); } // 마우스 오른클릭 방지
    },
    noContext : {
        init : function(){
            $(document).bind("contextmenu", function(e) { return false;});
            $(document).bind('selectstart',function() {return false;}); 
            $(document).bind('dragstart',function(){return false;}); 
            $(document).mousedown(function(e) {
                if( e.button == 2 ) {
                        alert('정보유출을 막기 위해 마우스 오른쪽 버튼은 사용불가합니다.');      
                        return false;     
                } else {
                        return true;
                }
            });
        },
    },
    header : {
        wrap : '.header',
        footer : '.footer',
        hoverTarget : '.gnb > li',
        lnbWrap : '.lnb-wrap, .gnb li .lnb-list',
        scrollClass : 'transperent',
        detail : 'detail',
        searchBtn : '.header .btn-util-search',
        gnbSearchBar : '.gnb-search-wrap',
        fixBottom : '.fixed-bottom-box',
        btnTop: '.btn-gotop',
        init : function(){
            var _this = this;

            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;
            var detailPage, searchDetail;

            if( $(_this.wrap).hasClass(_this.detail) ){detailPage = true;}else{detailPage = false;};

            /* Search btn evt */
            $(_this.searchBtn).on('click', function(){
                var $this = $(this);
                if( $this.hasClass( 'active' ) ){
                    _this.searchBarClose($this, detailPage);
                }else{
                    //if( $(_this.wrap).hasClass(_this.detail) ){searchDetail = true;}else{searchDetail = false;};
                    _this.searchBarOpen($this, detailPage);
                }
            })

            /* Hover evt */
            // mouse evt
            $(_this.hoverTarget).bind({
                "mouseenter focusin":function(){
                    if( $(_this.searchBtn).hasClass('active') ){
                        return true;
                    };
                    _this.lnbOpen(detailPage);

                }, "mouseleave focusout":function(){
                    if( $(_this.searchBtn).hasClass('active') ){
                        return true;
                    };
                    _this.lnbClose(detailPage);

                }
            });
            /* //Hover evt */

            /* Scroll evt */
            var page = 0;
            //기업상세페이지 여부
            if( $(_this.wrap).hasClass(_this.detail) ) page = 1;

            /* 페이지 진입시 실행 */
            if( $(document).scrollTop() > 0 ){
                _this.scrollOn(page);
            }else{
                _this.scrollOff(page);
            }

            $(window).scroll(function(){
                if( $(document).scrollTop() > 0 ){
                    _this.scrollOn(page);
                }else{
                    _this.scrollOff(page);
                }
            });
            /* //Scroll evt */

            /* 상단버튼 클릭 evt  */
            $(_this.btnTop).on('click', function(){
                _this.gotop();
            })
        },
        searchBarOpen : function($this, d){
            var _this = this;

            $this.addClass('active');
            $this.find('span').text('검색창닫기');
            $(_this.gnbSearchBar).stop().fadeIn(300).find('input').focus();
            $(_this.gnbSearchBar).find('.btn-search').focusout(function(){
                $this.focus();
            })

            if( d ){$(_this.wrap).removeClass(_this.detail);}
        },
        searchBarClose : function($this, d){
            var _this = this;

            $this.removeClass('active');
            $this.find('span').text('검색');
            $(_this.gnbSearchBar).stop().fadeOut(300);
            if( d ){
                if( !$(document).scrollTop() > 0 ){
                    $(_this.wrap).addClass(_this.detail);
                };
            };
        },
        scrollOn : function(page){
            var _this = this;

            if(page) $(_this.wrap).removeClass(_this.detail);

            if( $(_this.fixBottom).length > 0 ){
                _this.scrollFixBtnOpen();
            }
        },
        scrollOff : function(page){
            var _this = this;

            if( !$(_this.searchBtn).hasClass('active') ){
                if(page) $(_this.wrap).addClass(_this.detail);
            }
            if( $(_this.fixBottom).length > 0 ){
                _this.scrollFixBtnClose();
            }
        },
        scrollFixBtnOpen : function(){
            var _this = this;
            var btChkTop = $(_this.footer).offset().top;
            //$(_this.fixBottom).fadeIn(200);
            // if( $(_this.fixBottom).find('.recom-type').length > 0 ){
                $(_this.fixBottom).find('.fixed-item').not('.recom-type, .fixed-share-item, .fixed-print-item').stop().slideDown(200, function(){
                    $(_this.fixBottom).find('.fixed-item').not('.recom-type, .fixed-share-item, .fixed-print-item').addClass('opacity');
                });

                // if( $(_this.fixBottom).find('.fixed-share-item').length > 0  ){
                //     $(_this.fixBottom).find('.fixed-share-item').stop().slideDown(200, function(){
                //         $(_this.fixBottom).find('.fixed-share-item').addClass('opacity');
                //     });
                // };
            // } else {
                // $(_this.fixBottom).find('.fixed-item').not('.recom-type, .fixed-share-item, .fixed-print-item').show().addClass('opacity');

                // if( $(_this.fixBottom).find('.fixed-share-item').length > 0  ){
                //     $(_this.fixBottom).find('.fixed-share-item').addClass('opacity');
                // };
            // };
            

            if($(window).scrollTop() + $(window).height() >= btChkTop){
                $(_this.fixBottom).css({'position':'absolute','bottom' : $(document).height() - btChkTop + 45 + 'px'});
            }else{
                // $(_this.fixBottom).css({'position':'fixed','bottom':'35px'});
                $(_this.fixBottom).addClass('floating').css({'position':'','bottom':''});
            };
        },
        scrollFixBtnClose : function(){
            var _this = this;
            $(_this.fixBottom).find('.fixed-item').not('.recom-type, .fixed-share-item, .fixed-print-item').removeClass('opacity').stop().delay(200).slideUp(200);
            
            // if( $(_this.fixBottom).find('.fixed-share-item').length > 0  ){
            //     $(_this.fixBottom).find('.fixed-share-item').removeClass('opacity').stop().delay(200).slideUp(200);
            // };
            $(_this.fixBottom).removeClass('floating');
        },
        lnbOpen : function(searchDetail){
            var _this = this;

            $(_this.lnbWrap).stop().slideDown(200);
            //$(_this.wrap).addClass('open');
            if( $(_this.wrap).hasClass(_this.detail) && searchDetail ){
                $(_this.wrap).removeClass(_this.detail);
            };
        },
        lnbClose : function(searchDetail){
            var _this = this;
            
            $(_this.lnbWrap).stop().slideUp(100);
            //$(_this.wrap).removeClass('open');
            if( !$(document).scrollTop() > 0 && searchDetail ){
                $(_this.wrap).addClass(_this.detail);
            };
        },
        gotop : function(){
            $('html, body').stop().animate({scrollTop: 0}, 500);
        }
    },
    tabMenu:{
        tabBox : '.tab-menu',
        tabAnchor : '.tab-menu a',
        tabConts : '.tab-container',
        init : function(){
            var _this = this;
            _this.event();
        },
        event:function(){
            var _this = this;
            $(this.tabAnchor).on('click',function(e){
                var idx = $(this).parents('li').index();
                _this.action($(this).parents('li'));

                // 클릭시 포커스 이동 방지
                if ( $(_this.tabBox).hasClass('focus-fix') ){
                    e.preventDefault();
                }
                
                // 활성화 탭 내부 Slick set position
                if( $(_this.tabConts).find('.tab-cont.on .slide-content').length > 0 ){
                    _this.slickSet( $(_this.tabConts).find('.tab-cont.on .slide-content') );
                }
            })
        },
        action : function($this){
            var $target = $this.parents('.tab-wrap');
            var idx = $this.index();
            $this.addClass('on').siblings('li').removeClass('on');
            $this.find('a').attr('aria-selected',true);
            $this.siblings('li').find('a').attr('aria-selected',false);
            $target.find('.tab-container .tab-cont').eq(idx).addClass('on').siblings('.tab-cont').removeClass('on')
        },
        slickSet : function($slick){
            $slick.each(function(){
                $(this).slick('setPosition');
            });
        }
    },
    layer : {
        wrap : 'body',
        btn : '.d-layeropen',
        closeBtn : '.btn-close',
        init : function(){
            var _this = this;

            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this, $target;

            $(_this.btn).on('click', function(){
                $target = $(this);
                var layerId;
                if( $target.is('button') ){
                    layerId = $target.attr('data-layer');
                }else if( $target.is('a') ){
                    layerId = $target.attr('href');
                };
                _this.open($target, layerId);    //Layer Open
            });

            $(_this.closeBtn).on('click', function(){
                _this.close($(this), $target);    //Layer Close
            });
        },
        open : function($this, id){
            var _this = this;
            var sT = $(_this.wrap).scrollTop();

            $(_this.wrap).css({'overflow':'hidden'}).scrollTop(sT);
            $(id).show().attr('tabIndex','0').focus;
        },
        close : function($this, $target){
            var _this = this;

            $(_this.wrap).removeAttr('style');
            $this.parents('.layer-wrap').hide();
            $target.focus();
        }
    },
    tootip : {
        btn : '[data-tooltip]',
        init : function(){
            var _this = this;

            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;

            $(_this.btn).off().on('click', function(){
                var attrValue = _this.btn.substring(1, _this.btn.length - 1);
                var id = $(this).attr(attrValue);
                var btnT = $(this)[0].offsetTop, btnL = $(this)[0].offsetLeft;
                
                if( $('#'+id).is(':visible') ){
                    _this.close($('#'+id));
                }else{
                    _this.open($('#'+id), btnT, btnL);
                }
            });
        },
        open : function($target, top, left){
            var top = top + 20, left = left - $target.outerWidth() + 15;
            $target.css({'top': top + 'px', 'left': left + 'px'});
            $target.show();
        },
        close : function($target){
            $target.hide();
        }
    },
    slide : {
        wrap : '.slide-wrap',
        cont : '.slick-slide',
        play: '.video-wrap .video-control .play',
        init : function(){
            var _this = this;

            $(_this.wrap).each(function(){
                var $this = $(this);
                var type = $this.attr('data-slide'),        // slide Type 'normal', 'arrow' : data-slide="normal"
                    num = $this.attr('data-slide-num');     // slide 노출 개수값 : data-slide-num="number"
                _this.evtHandler($this, type, num);
                _this.removeId($this);
            });
        },
        evtHandler : function($target, type, num){
            var _this = this;
            var func = this[type];
            var packi = 1;
            
            func($target, num, _this);  // data-slide 값 function;

            // 슬라이드 내 비디오 체크
            $target.find('.video-wrap').each(function(){
                if( $(this).attr('data-type') == 'pack' ){
                    $(this).find('iframe').attr('id','pack'+packi);
                    packi++
                }else {
                    _this.videoWrap($(this), packi);
                }
            });

            // 20200922 슬라이드 인디게이터 숨김
            var len = $target.find('.slick-slide').length;
            if ( len <= num ) {
                $target.find('.slick-dots').hide();
            }

        },
        normal : function($target, num, _this){
            var $slickTarget = $target.find('.slide-content');

            $slickTarget.on('init', function(event, slick){
                var tubei = 1;
                $target.find('[data-type="tube"]').each(function(){
                    if( $(this).attr('data-type') == 'tube' ){
                        $(this).find('iframe').attr('id','tube'+tubei);
                        tubei++
                    };

                    var tubeId = $(this).find('iframe').attr('id');
                    tubeId = Number(tubeId.charAt(tubeId.length-1));

                    youtubeInit(tubeId);
                });

            });

            // 20200925 개발요청 
            if($slickTarget.hasClass('slick-initialized')){
                $slickTarget.slick('unslick');
            }
            
            $slickTarget.slick({
                slidesToShow: num,
                dots: true,
                variableWidth: false,
                prevArrow: $target.find('.btn-prev-arrow'),
                nextArrow: $target.find('.btn-next-arrow'),
            });

            // 재생중인 Video 정지
            $slickTarget.on('beforeChange', function(event, slick, currentSlide, nextSlide){
                var $videoTarget = $(this).find('[data-slick-index="'+currentSlide+'"]');
                if( $videoTarget.find('.video-wrap').attr('data-type') == 'video' ){
                    _this.vidPause($videoTarget);
                }else if( $videoTarget.find('.video-wrap').attr('data-type') == 'pack' ){
                    var idname = $videoTarget.find('.video-wrap iframe').attr('id');
                    packPause(idname);
                }else if( $videoTarget.find('.video-wrap').attr('data-type') == 'tube' ){
                    var idname = $videoTarget.find('.video-wrap iframe').attr('id');
                    tubePause(idname);
                };
                
                if( $(slick.$slides[nextSlide]).find('video').length > 0 || $(slick.$slides[currentSlide]).find('video').length > 0 ){
                    $slickTarget.addClass('slider-transitioning');
                }
            });

            $slickTarget.on('afterChange', function (event, slick, currentSlide) {
                $slickTarget.delay(1000).removeClass('slider-transitioning');
            });
        },
        arrow : function($target, num, _this){
            var $slickTarget = $target.find('.slide-content');

            // 20200925 개발요청 
            if($slickTarget.hasClass('slick-initialized')){
                $slickTarget.slick('unslick');
            }

            $slickTarget.slick({
                slidesToShow: num,
                dots: false,
                variableWidth: false,
                prevArrow: $target.find('.btn-prev-arrow'),
                nextArrow: $target.find('.btn-next-arrow'),
            });
        },
        center : function($target, num, _this){
            var $slickTarget = $target.find('.slide-content');

             // 20200925 개발요청 
             if($slickTarget.hasClass('slick-initialized')){
                $slickTarget.slick('unslick');
            }
            
            $slickTarget.slick({
                slidesToShow: num,
                dots: false,
                variableWidth: false,
                infinite: true,
                centerMode: true,
                centerPadding : '290px',
                prevArrow: $target.find('.btn-prev-arrow'),
                nextArrow: $target.find('.btn-next-arrow'),
                autoplay: false, // 20201026 레드마인#3624
                autoplaySpeed: 5000,
            });
        },
        videoWrap : function($this, packi){
            var _this = this;

            if( $this.attr('data-type') == 'video' ){
                _this.vidPlay($this);
            }
        },
        vidPlay : function($wrap){
            var _this = this;
            var btnPlay = $wrap.find('button.play');
            
            btnPlay.on('click', function(){
                var $this = $(this), $video = $this.parents('.video-wrap').find('video');
                btnPlay.hide();
                $video.get(0).play();

                $video.bind('ended', function(){
                    btnPlay.show();
                })
            });
        },
        vidPause : function($target){
            $target.find('button.play').show();
            $target.find('video').get(0).pause();
        },
        removeId : function($target){
            $target.find('.slick-slide').removeAttr('id');
        }
    },
    check_all: {
        btn: '.chk-all',
        init: function(){
            var _this = this;
            _this.evtHandler();
        },
        evtHandler: function(){
            var _this = this;

            $(_this.btn).off().on('click', function(){
                var $this = $(this);
                _this.checkEvt($this);
            })
        },
        checkEvt: function($this){
            var _this = this;

            var _checked = $this.is(':checked'),
                _name = $this.attr('name');

            if( $this.hasClass('stop-cancel') && _checked == false ){
                return true;
            }
            $('[name="'+_name+'"]').prop('checked',_checked)
        }
    },
    select_box : {
        select : '.select-box',
        selectAnchor : '.select-box .select-value',
        selectValue : '.select-box .select-list a',
        init : function(){
            var _this = this;
            $(this.select).removeClass('on');
            _this.event();
        },
        event : function(e){
            var _this = this;

            // $(this.selectAnchor).on('click',function(e){
            $(document).on('click',this.selectAnchor,function(e){
                // 20200914 : 셀렉트박스 disabled 클래스 있을 경우 동작 안함
                if ( !$(this).hasClass('disabled') ) {
                    _this.action($(this).parents('.select-box'))  
                
                    $('body').on('click',function(e){
                        if($(e.target).closest('.select-box').length === 0 && $('.select-box').hasClass('on')){
                            _this.close()
                        }
                    })
                }
            });

            // $(this.selectValue).on('click',function(){
            $(document).on('click',this.selectValue,function(){
                if( !$(this).parents().hasClass('footer-custom') ){
                    _this.value($(this))
                };
            })
        },
        action : function($this){
            $(this.select).not($this).removeClass('on')
            $this.toggleClass('on')
        },
         value : function($item){
            var _this = this;
            var $val = $item.text();
            $item.parents('.select-list').find('ul li a').removeClass('selected');
            $item.addClass('selected');
            $item.parents('.select-box').find('.select-value span').text($val);
           if ($item.hasClass('selected')) {
                $item.parents('.select-list').prev('.select-value').removeClass('placeholder');
           }
            _this.close()
        },
        close : function(){
            $('.select-box').removeClass('on');
            return false;
        }
    },
    file_add : {
        fileBox : '.box-file-add',
        fileLabel : '.box-file-add .btn-add-file',
        // fildValue : '.box-file-add input[type=file]',
        fileView : '.box-file-add .file-wrap',
        fileMax : '[data-file-max]',
        init : function(){ 
            var _this = this;
            _this.event();
        },
        event : function(){
            var _this = this;
            var inputId;

            // 20201027 개발요청 수정
           // $(this.fileLabel).on('click',function(e){
            $(document).on('click',this.fileLabel,function(e){
                var $this = $(this);
                inputId = '#' + $(this).data('file-input');

                $(inputId).on('change',function(e){
                    e.stopImmediatePropagation();
                    if(this.value == '') {
                        return false;
                    }
                    //_this.action($this, $(this))
                })

                _this.fileAction(inputId);
            });

            $(document).on('click','.box-file-add .btn-del',function(){
                _this.close($(this))
            })
        },
        action : function($target, $item){
            var $target = $target;
            var $current = $($item);
            var txt = '<li><span class="file-name">' + $current.val() + '</span><button type="button" class="btn-del"><span class="blind">삭제</span></button></li>';

            if($target.parents('.box-file-add').data('file-max') !== undefined && $target.parents('.box-file-add').hasClass('on')){
                $target.parents('.box-file-add').find('.file-wrap li .file-name').text($current.val())
                return false;
            } 
            $target.parents('.box-file-add').addClass('on');
            $target.parents('.box-file-add').find('.file-wrap ul').append(txt)
        },
        fileAction : function($id){
            var _this = this;
            var $inputId = $id;

            $($inputId).trigger('click');
        },
        close : function($item){
            var _this = $item;

            if(_this.parents('.file-wrap').find('li').length == 1){
                _this.parents('.box-file-add').removeClass('on');
            }
            _this.parents('li').remove();
        }
    },
    tooltip : {
        btn : '.btn-tooltip',
        target : '.tooltip-box',
        init : function(){
            var _this = this;

            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;
            $(_this.btn).on('click', function(){
                var $this = $(this);

                if( $this.siblings(_this.target).is(':visible') ){
                    _this.tooltipClose($this.siblings(_this.target));
                }else{
                    var offTop = $this[0].offsetTop + $this.outerHeight() + 11;
                    if( $this.offset().left + $this.siblings(_this.target).outerWidth() > $(window).width() ){
                        var offLeft = $this[0].offsetLeft -144;
                        _this.tooltipRightOpen($this.siblings(_this.target), offTop, offLeft);
                    }else{
                        var offLeft = $this[0].offsetLeft - 22;
                        _this.tooltipOpen($this.siblings(_this.target), offTop, offLeft);
                    }
                }
            });
        },
        tooltipOpen : function($target, top, left){
            $target.show().css({'top':top+'px', 'left':left+'px'}).focus();
        },
        tooltipRightOpen: function($target, top, left){
            $target.addClass('right');
            $target.show().css({'top':top+'px', 'right':left+'px'}).focus();
        },
        tooltipClose : function($target){
            $target.removeClass('right').removeAttr('style').hide();
        }
    },
    fixedTooltip: {
        wrap : '.fixed-tooltip',
        closeBtn: '.tooltip-close, .recom-close',
        init : function(){
            var _this = this;
            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;

            $(_this.closeBtn).on('click', function(){
                var $this = $(this);
                _this.close($this);
            });
        },
        close : function($btn){
            var _this = this;
            $btn.parents('.fixed-item').remove();
        }

    },
    tooltip_out : {
        btn : '.btn-tooltip-out',
        init : function(){
            var _this = this;

            _this.evtHandler();

            $('.ctscroll').scroll(function(){ 
                console.log('scroll')
             });
        },
        evtHandler : function(){
            var _this = this;

            $(_this.btn).on('click', function(){
                var $this = $(this);
                // 위치
                var pos_top = $(this).offset().top + 35;
                var pos_left = $(this).offset().left - 25;
                // 팝업 생성
               var link_text = $this.attr('data-link');
                var tooltip_layer = $('<div class="tooltip-box"><p class="tooltip-cont-check">인증사업에 대해 자세히 알아보세요. <br /><a href="'+link_text+'"  class="btn-link-txt"><span>바로가기</span></a> </p> </div>');
                var tooltip_style = tooltip_layer.css({
                   "top": pos_top,
                    "left": pos_left,
                    "position": "absolute",
                    "display":"block"
                });
                
                if (!$(this).hasClass("on")) {
                    $(this).addClass("on");
                    $(this).parent().siblings().children('.btn-tooltip-out').removeClass("on");
                    $('body > .tooltip-box').remove();
                    $('.wrap').after(tooltip_layer);
                } else {
                    $(this).removeClass("on");
                    $('body > .tooltip-box').remove();
                }
                
            });

            $(window).scroll(function(){ 
                _this.remove();
            });

            $(window).resize(function(){ 
                _this.remove();
            });
 
        },
        remove : function(){
            var _this = this;
            $('body > .tooltip-box').remove();
            $(_this.btn).removeClass("on");
        }
    },
    
    searchCustom : {
        wrap : '.company-search-wrap',
        content : '.item-content',
        title : '.item-title a',
        scrollWrap : '.ctscroll', // 20200818 수정
        // scrollWrap : '.item-content .ctscroll',
        inputBox : '.item-list',
        input : '.item-list input',
        require : '.search-require',
        dep02 : '.depth02',
        init : function(){
            var _this = this;

            _this.evtHandler();
            _this.searchBoxReset(); // 20200818 추가 (기업회원 > 기업복지수정 팝업내 검색)

            // 20200903
            if ( $(_this.inputBox).find('input').is(':checked') ) {
                $(_this.inputBox).find('input:checked').addClass('checked')
            }
        },
        evtHandler : function(){
            var _this = this;

            //상단 클릭시 이벤트
            $(_this.title).on('click', function(){
                var $this = $(this);
                if( $this.attr('data-cate') == 'true' ){
                    //_this.depthClose($this.parents(_this.wrap));
                    $(_this.title).find('i').addClass('ico-arr-down').removeClass('ico-arr-up');
                    _this.depthEvt($this);
                } else {
                    $(_this.dep02).hide();
                    _this.boxLineReset();
                    _this.depthClose($this.parents(_this.wrap));
                    _this.depthOpen($this.parents(_this.content), $this.parents(_this.content).index());
                }
            });

            // Custom Scroll 활성화
            $(_this.scrollWrap).mCustomScrollbar({
                scrollInertia: 500,
                scrollEasing: "easeOut",
                mouseWheel:{ deltaFactor: 30 },
                callbacks:{
                    onScrollStart:function(){
                        if( $('body > .tooltip-box').length > 0 ){
                            $('body > .tooltip-box').remove();
                        };
                    }
                },
            });
            
            // input change
            $(_this.input).on('change', function(){
                var $this = $(this);
                var boxIdx = $this.parents('.item-content').index();

                //박스 라인 초기화
                _this.boxLineReset();

                //박스라인 색상
                if( !$this.parents('depth02').lenght > 0 ){
                    _this.depthOpen($this.parents('.item-content'), boxIdx);
                };

                // 클릭시 이벤트
                _this.inputChange($this, boxIdx);
            });

            // depth2 좌측 버튼 클릭시 우측메뉴 변경
            $(_this.dep02).find('.depth02-title li a').on('click', function(){
                var $this = $(this);
                _this.depth2Menu($this.parents(_this.dep02), $this.parents('li').index())
            });

            // 조건항목 x버튼 클릭 이벤트
            // $(_this.require).find('.del-item').on('click', function(){
            //     var $this = $(this);

            //     $this.parents('li').remove();
            // });

            // 조건항목 x버튼 클릭 이벤트
            $(_this.require).find('.btn-refresh').on('click', function(){
                var $this = $(this);

                $(_this.inputBox).find('input').not(':disabled').not('.fix-checked').prop('checked', false); 
                $(_this.inputBox).find('.check-all').prop('checked', true);

                // 20200901 (기업회원 지원정책 추천)
                if ( $this.parents('.company-search-wrap').hasClass('type-biz') ) {
                   // $(_this.inputBox).find('.biz-check-all').not('.checked').prop('checked', false);
                   $(_this.inputBox).find('.checked').prop('checked', true);
                    $(_this.inputBox).find('input.fix-checked').prop('checked', true);
                }
                $(_this.inputBox).find('.mCSB_container, .mCSB_dragger').css({'top':'0'});

                _this.searchBoxReset();
                
            });
        },
        inputChange : function($this, boxIdx){
            var _this = this;
            var boxBydep = $this.parents(_this.inputBox).siblings(_this.dep02);
            var depBybox = $this.parents(_this.dep02).siblings(_this.inputBox);


            if( $this.attr('name') == 'biztag' || $this.attr('name') == 'welfaretag' ){
                //인증사업 및 복지 영역 선택시
                if( $this.hasClass('check-all') ){
                    //인증사업 및 복지의 전체 input 선택시
                    $( '[name='+$this.attr('name')+']' ).prop('checked', false);
                    boxBydep.find('input').prop('checked', false);
                    boxBydep.find('.check-all').prop('checked', true);
                    _this.searchBoxReset();
                    _this.depthControl($this, boxIdx);
                    $this.prop('checked', true);
                } else {
                    //인증사업 및 복지의 전체 이외 input 선택시
                    _this.depthControl($this, boxIdx);
                }
            }else{
                if( $this.hasClass('check-all') ){
                    // 전체버튼인지 확인
                    $( '[name='+$this.attr('name')+']' ).not('.disabled').prop('checked', false);
                    $this.prop('checked', true);
                } else {
                    if( $( '[name='+$this.attr('name')+']:checked' ).length == 0 ){
                        // 전체버튼이 아니며, 현재 name에 체크된 갯수가 0 일시
                        $( '.check-all[name='+$this.attr('name')+']' ).prop('checked', true);
                    } else {
                        // 전체버튼이 아니며, 현재 name에 체크된 갯수가 존재시
                        $( '.check-all[name='+$this.attr('name')+']' ).prop('checked', false);
                    }
                };

                // 20200901 기업회원 : 지원정책추천
                if( $this.hasClass('biz-check-all') ){
                    // 전체버튼인지 확인
                    $( '[name='+$this.attr('name')+']' ).not('.disabled').prop('checked', false);
                    $this.prop('checked', true);
                } else {
                    if( $( '[name='+$this.attr('name')+']:checked' ).length == 0 ){
                        // 전체버튼이 아니며, 현재 name에 체크된 갯수가 0 일시
                        $( '.biz-check-all[name='+$this.attr('name')+']' ).prop('checked', true);
                    } else {
                        // 전체버튼이 아니며, 현재 name에 체크된 갯수가 존재시
                        $( '.biz-check-all[name='+$this.attr('name')+']' ).prop('checked', false);
                    }
                };


                if( $this.parents(_this.dep02).length > 0 ){
                    // 선택된 index가 depth02 영역에 존재시
                    var depth02Idx = $this.parents('li').index();
                    var $depthTarget = depBybox.find('input:eq('+depth02Idx+')');
                    if( $('[name='+$this.attr('name')+']:checked').length != $('.check-all[name='+$this.attr('name')+']:checked').length ){
                        // 현재 name중 전체선택 이외의 항목 선택값이 있을시
                        $depthTarget.prop('checked', true);
                        depBybox.find('.check-all').prop('checked', false);
                    } else if( $('[name='+$this.attr('name')+']:checked').length == $('.check-all[name='+$this.attr('name')+']:checked').length ){
                        // 현재 name중 전체선택 이외의 항목 선택값이 없을시
                        $depthTarget.prop('checked', false);
                        if( $this.parents(_this.dep02).find('input:checked').length == $this.parents(_this.dep02).find('.check-all:checked').length ){
                            // 현재 name중 전체선택 이외의 항목 선택값이 없으며, 해당 depth02의 모든 선택값이 전체index 인지
                            depBybox.find('.check-all').prop('checked', true);
                        }
                    };
                }

                _this.searchBoxReset();
            }
        },
        boxLineReset : function(){
            var _this = this;
            
            $(_this.content).removeClass('on before');
        },
        depthControl : function($this, boxIdx){
            var _this = this;
            var btnNum = $this.parents('.custom-checkbox').index();
            if( $this.is(':checked') ){$this.prop('checked',false);}else{$this.prop('checked',true);};
            _this.depthOpen($this.parents(_this.content), boxIdx, btnNum);
        },
        depthEvt : function($this){
            var _this = this;
            var boxIdx = $this.parents(_this.content).index();
            var hasCs = $this.parents(_this.content).find('.depth02').is(':visible');
            
            if( hasCs ){
                _this.depthClose($this.parents(_this.content), boxIdx);
            }else{
                $(_this.dep02).hide();
                _this.boxLineReset();
                _this.depthOpen($this.parents(_this.content), boxIdx);
            }
            $this.find(_this.dep02).show();
        },
        depthOpen : function($this, boxIdx, btnNum){
            var _this = this;
            $this.addClass('on');
            $this.find('.item-title i').addClass('ico-arr-up').removeClass('ico-arr-down');
            $this.find(_this.dep02).show();
            if( boxIdx > 0 ){
                $(_this.content).eq(boxIdx-1).addClass('before');
            };
            if( btnNum != undefined ){
                _this.depth2Menu($this.find(_this.dep02), btnNum);
                $this.find('.depth02 .depth02-title li').eq(btnNum).addClass('on');
            }
            // 20201005 툴팁박스
            $('body > .tooltip-box').remove();
            $('.btn-tooltip-out').removeClass('on')
        },
        depthClose : function($this, boxIdx){
            var _this = this;
            $this.find('.item-title i').addClass('ico-arr-down').removeClass('ico-arr-up');
            $this.find(_this.dep02).hide();
        },
        depth2Menu : function($this, btnNum){
            var _this = this;
            
            $this.find('.depth02-title li, .depth02-item li').removeClass('on');
            $this.find('.depth02-title li').eq(btnNum).addClass('on');
            $this.find('.depth02-item li').eq(btnNum).addClass('on');

            $('body > .tooltip-box').remove();
        },
        searchBoxReset : function(){
            var _this = this;

            var chkNum = $(_this.inputBox).find('input:checked').length;
            $(_this.require).find('ul li').not('.fix-require-item').remove();    // 조건값 입력 전 초기화 / 20200813 수정 (기업회원 사이트 : 지원정책 추천)
            for(i=0; i<chkNum; i++){
                if( !$(_this.inputBox).find('input:checked').eq(i).hasClass('check-all') && $(_this.inputBox).find('input:checked').eq(i).attr('name') != 'biztag' && $(_this.inputBox).find('input:checked').eq(i).attr('name') != 'welfaretag'){
                    if( !$(_this.inputBox).find('input:checked').eq(i).hasClass('fix-checked')){
                        // 20200902 수정,추가 (기업회원 사이트 : 지원정책 추천)
                        if ( !$(_this.inputBox).find('input:checked').eq(i).hasClass('biz-check-all') ) {
                            $(_this.require).children('ul').append('<li><span>'+$(_this.inputBox).find('input:checked').eq(i).attr('data-name')+'</span><button type="button" class="del-item" onclick="ui.searchCustom.btnDel(this);"><i class="ico-close"></i><span class="hide">해당항목 삭제</span></button></li>');
                        } else {
                            $(_this.require).children('ul').append('<li><span>'+$(_this.inputBox).find('input:checked').eq(i).attr('data-name')+'</span></li>');
                        }
                    } else {

                        if ( !$(_this.inputBox).find('input:checked').eq(i).hasClass('biz-check-all') ) {
                            $(_this.require).find('.require-item .fix-require-item ul').append('<li class="fix-item"><span>'+$(_this.inputBox).find('input:checked').eq(i).attr('data-name')+'</span><button type="button" class="del-item" onclick="ui.searchCustom.btnDel(this);"><i class="ico-close"></i><span class="hide">해당항목 삭제</span></button></li>');
                        } else {
                            $(_this.require).find('.require-item .fix-require-item ul').append('<li class="fix-item"><span>'+$(_this.inputBox).find('input:checked').eq(i).attr('data-name')+'</span></li>');
                        }
                        
                    };
                    
                }
            };

            if( $(_this.require).find('ul').children().length > 0 ){
                $(_this.require).show();
            }else{
                // 20200813 수정 (기업회원 사이트 : 지원정책 추천)
                if ( !$(_this.require).parent('.company-search-wrap').hasClass('type-biz') ) {
                    $(_this.require).hide();
                }
            }
        },
        btnDel: function(target){
            var _this = this;
            var name = $(target).siblings('span').text();
            var $this = $(_this.inputBox).find('[data-name="'+name+'"]');
            var boxIdx = $this.parents('.item-content').index();

            $(target).parent('li').remove(); // parents 20200901
            $this.prop('checked', false);

            _this.inputChange($this, boxIdx)
        }
    },
    tagToggleEvt: {
        wrap: '.board-incruit .tag',
        init: function(){
            var _this = this;

            $(_this.wrap).each(function(){
                var $this = $(this);
                _this.evtHandler($this);
            })
        },
        evtHandler: function($this){
            var _this = this;

            // 한줄 될때 까지 가리기
            var i = $this.find('li').length -1; // 플러스 버튼을 제외하고 선택 Index
            if( $this.outerHeight() > 33 ) {
                $this.append('<li class="toggin-tab-btn"><button type="button" class="btn-icon-xs open"><i class="ico-plus"></i><span class="hide">태그 전체보기</span></button></li>');
                while ( $this.outerHeight() > 33 ) {
                    if ( $this.outerHeight() < 40 ) {
                    break;
                    }
                    $this.find('li').eq(i).addClass('hide');
                    i--;
                }
                _this.addBtn($this);
            }
        },
        addBtn: function($this){
            $this.find('.toggin-tab-btn button').off().on('click', function(){
                if( $(this).hasClass('open') ){
                    $(this).removeClass('open').find('i').attr('class','ico-minus');
                    $(this).parents('li').siblings('.hide').addClass('show');
                }else{
                    $(this).addClass('open').find('i').attr('class','ico-plus');
                    $(this).parents('li').siblings('.hide').removeClass('show');
                }
            })
        }
    },
    toggleTextTab : {
        wrap : '.toggle-text-wrap',
        btnArea : '.toggle-btn-area',
        btn : '.btn-toggle',
        item : '.toggle-item',
        init : function(){
            var _this = this;

            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;
            var $wrap, $txtBox;
            var maxH;

            if( $(_this.item).children('div').outerHeight() < 67 ){
                $(_this.wrap).addClass('not-toggle');
            };

            $(_this.btn).on('click', function(){
                var $this = $(this);
                if( $this.hasClass('off') ){
                    $wrap = $this.parents(_this.wrap);
                    $txtBox = $wrap.find(_this.item);
                    $this.parents(_this.btnArea).removeClass('on');
                    maxH = 150;
                    $this.find('span').text('내용 전체보기');
                }else{
                    $wrap = $this.parents(_this.wrap);
                    $txtBox = $wrap.find(_this.item);
                    maxH = $txtBox.children('div').outerHeight() + $wrap.find(_this.btnArea).outerHeight();    //67 = 그라데이션 before박스 높이
                    $this.find('span').text('닫기');
                    $this.parents(_this.btnArea).addClass('on');
                }
                $this.toggleClass('off');
                _this.togglePlay($this, $wrap, maxH);
            });
        },
        togglePlay : function($this, $txtBox, maxH){
            $txtBox.stop().animate({'max-height':maxH+'px'}, 500);
        }
    },
    navTab : {
        wrap : '.content-area',
        header : '.header',
        target : '.content-area .top-cnt-bar',
        anchor : '.anchor-scroll',
        headerH : 256,
        init : function(){
            var _this = this;

            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;
            var lastScrollTop = 0;
            var headerH = $(_this.header).outerHeight();
            var targetTop = $(_this.target).offset().top, targetH = $(_this.target).outerHeight();
            var companyName = $('.company-header .info h2').text();
            
            var delta = 5;

            // Scroll Event
            $(window).on('scroll', function(){
                var scrollt = $(document).scrollTop();

                // 기업상세내용 nav bar
                if( scrollt + headerH > targetTop ){
                    _this.navFixed(targetH, companyName);
                }else{
                    _this.navDestroy();
                }

                if(Math.abs(lastScrollTop - scrollt) <= delta) return;
                if (scrollt > lastScrollTop){
                    //dowm
                    _this.down();
                } else {
                    // upscroll code
                    _this.up();
                }
                lastScrollTop = scrollt;
            })

            //Click Event
            $(_this.target).find('a').on('click', function(){
                _this.click($(this));
            })
        },
        navFixed : function(height, companyName){
            var _this = this;
            var $target = $('#company-name'),
                $topLike = $('.company-header .info .button-box'), 
                $navLike = $('.fixed .nav-tab .fixed-button');

            $(_this.wrap).css({'marginTop':height+'px'});
            $(_this.target).addClass('fixed');
            $target.text(companyName);
            $topLike.find('.custom-checkbox').appendTo($navLike);
        },
        navDestroy : function(){
            var _this = this;
            var $topLike = $('.company-header .info .button-box'), 
                $navLike = $('.fixed .nav-tab .fixed-button');

            $(_this.wrap).css({'marginTop':'0px'});
            $(_this.target).removeClass('fixed');
            $navLike.find('.custom-checkbox').appendTo($topLike);
        },
        down : function(chk){
            var _this = this;

            $(this.anchor).each(function(idx){
                var $this = $(this);
                var $curruntTop = $this.offset().top;
                var sitemapScrTop = $(window).scrollTop();
                var winH = $(window).height();
                var totalH = $('.container').outerHeight();
    
                if( sitemapScrTop + winH >= totalH - 66 ){
                    $(_this.target).find('li').last().addClass('active').siblings('li').removeClass('active')
                    return false;
                }else{
                    if($curruntTop - _this.headerH <= sitemapScrTop && !$this.hasClass('active')) {
                        $this.addClass('active');
                        $(_this.target).find('li').eq(idx).addClass('active').siblings('li').removeClass('active')
                    }
                };
            })
        },
        up : function(chk){
            var _this = this;

            $(this.anchor).each(function(idx){
                var $this = $(this);
                var $curruntTop = $this.offset().top;
                var upheight = $curruntTop - _this.headerH;
                var sitemapScrTop = $(window).scrollTop();

                if($curruntTop > 0 && upheight > sitemapScrTop && $this.hasClass('active')){
                    if( idx - 1 < 0 ) {
                        return false
                    }else{
                        $(this).removeClass('active');
                        $(_this.target).find('li').eq(idx - 1).addClass('active').siblings('li').removeClass('active')
                    }
                }
            })
        },
        click : function($this){
            var _this = this;
            var idx = $this.parents('li').index();
            var offsetT = $(_this.anchor).eq(idx).offset().top;
            var scrollT = offsetT - 250;

            $('html, body').stop().animate({scrollTop : scrollT}, 600);
        }
    },
    swiperSlide : {
        init : function(){
            var target = document.querySelectorAll('.swiper-wrap');
            var swiperTarget = target[0].querySelector('.swiper-container');
            var scrollBar = '.swiper-wrap .swiper-scrollbar';
            var len = $(swiperTarget).find('.swiper-slide').length;
            var targetValue;
            var dragmovement = 0;
            var targetLink = $('.collect-item');
            var targetPoster = $('.collect-item.poster');
            var targetMov = $('.collect-item.mov');
            if( $(target).hasClass('collect-swiper') ){
                targetValue = 4;
            } else if( $(target).hasClass('must-swiper') ){
                targetValue = 2;
            } else {
                targetValue = 3;
            }
            
            if(len < targetValue){
                $(swiperTarget).find('.swiper-scrollbar-wrap').hide();
            } else {
                var mainTabSwiper = new Swiper(swiperTarget,{
                    slidesPerView: 'auto',
                    scrollContainer: true,
                    roundLengths: true,
                    scrollbar: {
                      container: scrollBar
                    }
                });
            }
            // 리스트가 3개인 경우 마지막 리스트 margin:0;
            if(len == 3){
                $(targetLink).addClass("three");
            }

            $('.btn-card-next').on('click', function(e){
                e.preventDefault();             
                mainTabSwiper.swipeNext();
            })
            $('.btn-card-prev').on('click', function(e){
                e.preventDefault()
                mainTabSwiper.swipePrev();
            })
          
            targetLink.mousedown(function(e){dragmovement = 0;
                $(document).mousemove(function(){dragmovement++;})
            }).mouseup(function(e){
                if(dragmovement >= 20){
                    targetMov.find('button').attr("onclick",";");
                } else{
                    targetMov.find('button').attr("onclick","popupVideoLayer(this); changeRdcnt(this.getAttribute('data-id'), 'up');");
                }
            })

          
           
        },
    },
    // allCheck : {
    //     btn : '.review-all-check',
    //     init : function(){
    //         var _this = this;
    //         var name = $(_this.btn).attr('name');

    //         _this.evtHandler(name);
    //     },
    //     evtHandler : function(name){
    //         var _this = this;

    //         $('input[name="'+name+'"]').on('click', function(){
    //             if( $(this).hasClass('review-all-check') ){
    //                 _this.all($(this), name);
    //             }else{
    //                 _this.some();
    //             }
    //         })
    //     },
    //     all : function($this, name){
    //         $('input[name="'+name+'"]').prop('checked', false);
    //         $this.prop('checked', true);
    //     },
    //     some : function(){
    //         var _this = this;
    //         $(_this.btn).prop('checked', false);
    //     }
    // }
    wishCheck : {
        btn : '[name="wishCheck"]',
        init : function(){
            var _this = this;
            
            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;

            if( $(_this.btn).is(':checked') ){
                // 초기 체크 확인
                $(_this.btn).prop('checked','checked');
            };

            $(_this.btn).on('change', function(){
                if( $(this).is(':checked') ){
                    $(_this.btn).prop('checked',true);
                } else {
                    $(_this.btn).prop('checked',false);
                }
            });
        }
    },
    fixedShared : {
        wrap: '.fixed-share-item',
        btn: '#detailShare',
        init: function(){
            var _this = this;
            _this.evtHandler();
        },
        evtHandler: function(){
            var _this = this;

            $(_this.btn).on('click', function(){
                var $this = $(this);
                _this.shareOpen($this);
            });
        },
        shareOpen: function($this){
            var _this = this;

            if( $this.find('i').hasClass('ico-close') ){
                $this.find('i').attr('class','ico-func-share');
                $this.parents(_this.wrap).animate({'width':'60px'}, 300);
            }else{
                $this.find('i').attr('class','ico-close');
                $this.parents(_this.wrap).animate({'width':'100%'}, 300); // 20201026 레드마인#3616
            };

            
        }
    },
    conditionToggleEvt: {
        wrap : '.condition-box',
        init : function(){
            var _this = this;

            $(_this.wrap).each(function(){
                var $this = $(this);
                _this.evtHandler($this);
            })
        },
        evtHandler: function($this){
            var _this = this;

            // 한줄 될때 까지 가리기
            var i = $this.find('li').length -1; // 플러스 버튼을 제외하고 선택 Index
            if( $this.outerHeight() >= 50 ) {
                $this.append('<div class="toggle-condition"><button type="button" class="btn-condition open"><span class="blind">항목 더보기</span></button></div>');
                while ( $this.outerHeight() > 50 ) {
                    if ( $this.outerHeight() <= 50 ) {
                        break;
                    }
                    $this.find('.custom-checkbox').eq(i).addClass('hide');
                    i--;
                }
                _this.addBtn($this);
            }
        },
        addBtn: function($this){
            $this.find('.btn-condition').off().on('click', function(){
                if( $(this).hasClass('open') ){
                    $(this).removeClass('open');
                    $(this).parents('.toggle-condition').siblings('.hide').addClass('show');
                }else{
                    $(this).addClass('open');
                    $(this).parents('.toggle-condition').siblings('.hide').removeClass('show');
                }
            })
        }
    },
    declaration : {
        wrap : '.declaration-list',
        input : '.declaration-list input',
        target : '.textarea-box',
        init : function(){
            var _this = this;

            if( $(_this.wrap).find(_this.target).length > 0 ){
                _this.evtHandler();
            };
        },
        evtHandler : function(){
            var _this = this;

            $(_this.input).on('change', function(){
                var $this = $(this);
                _this.reset($this);
                if( $this.parents('li').find(_this.target).length > 0 ){
                    var $target = $this.parents('li').find(_this.target);
                    _this.active($target);
                };
            });
        },
        reset : function($this){
            var _this = this;
            $this.parents(_this.wrap).find(_this.target).addClass('disabled').find('textarea').attr('disabled', 'disabled');
        },
        active : function($target){
            var _this = this;
            $target.removeClass('disabled').find('textarea').removeAttr('disabled');
        }
    },
    toggleFaq : {
        faqList : 'li',
        qnaArea : '.toggle',
        qnaDetail : '.detail-area, .list-detail',
        toggleIcon : '.toggle-btn i',
        blindTxt : '.toggle span',
        init : function(){
            var _this = this;
            $(_this.qnaArea).on('click', function(){
                _this.evtHandler($(this));
            })
        },
        evtHandler: function($this){
            var _this = this;
            var thisFaqList = $this.parents(_this.faqList);
            if(thisFaqList.find(_this.qnaDetail).css('display') === 'none'){
                thisFaqList.find(_this.blindTxt).text('닫기');
                thisFaqList.find(_this.toggleIcon).attr('class','ico-arr-up');
                thisFaqList.find(_this.qnaDetail).stop().slideDown();
                thisFaqList.siblings().find(_this.qnaDetail).stop().slideUp();
            }else {
                thisFaqList.find(_this.toggleIcon).attr('class','ico-arr-down');
                thisFaqList.find(_this.blindTxt).text('자세히보기');
                thisFaqList.find(_this.qnaDetail).stop().slideUp();
            }
        },
    },
    snsMouseOver : {
        targetHover : '.sns-list',
        targetDim : '.dim',
        init : function(){
            var _this = this;
            $(_this.targetHover).mouseenter(function(){
               _this.dimShow($(this));
            }).mouseleave(function(){
                _this.dimHide($(this));
            });
        },
        dimHide : function (target){
            var _this = this;
            target.find(_this.targetDim).hide();
        },
        dimShow: function (target){
            var _this = this;
            target.find(_this.targetDim).show();
        }
    },
    inputSize : {
        parent: '.expansion',
        target : '.expansion textarea, .expansion button',
        txtIntarget : '.in-txt .text-box',
        inTxt : '.in-txt',

        init : function(){
            var _this = this;
            _this.evtHandler();
        },
        evtHandler : function(){
            var _this = this;
            $(_this.target).focus(function(){
                var $this = $(this);
                _this.sizeUp($this);
            })
            .blur(function(){
                var $this = $(this);
                _this.sizeDown($this);
            });
            $(_this.txtIntarget).on('click',function(e){
                var $this = $(this);
                if(!$this.hasClass('active')){
                    _this.clickAtive($this);
                }else{
                    _this.clickPassive($this);
                }
            });
        },
        sizeUp : function($input){
            var _this = this;
            $input.parents(_this.parent).stop().animate({
                height: '150px'
            });
        },
        sizeDown : function($input){
            var _this = this;
            $input.parents(_this.parent).stop().animate({
                height: '54px'
            });
        },
        clickAtive : function ($input){
            var _this = this;
            $input.addClass('active');
            $input.removeClass('text-elps');
            $input.parent().stop().animate({
                height: '174px'
            });
        },
        clickPassive : function ($input){
            var _this = this;
            $input.removeClass('active');
            $input.addClass('text-elps');
            $input.parent().stop().animate({
                height: '54px'
            });
        }
    },
    listSlide : {
        targetList : '.sub-list02',
        moreBtn : '.more-btn',
        init : function(){
            var _this = this;
            $(_this.moreBtn).on('click', function(){
                var $this = $(this);
                if($this.siblings(_this.targetList).css('display') == 'none'){
                    _this.listOpen($(this));
                }else{
                    _this.listClose($(this));
                }
            });
        },
        listOpen: function($list){
            var _this = this;
            $list.addClass('on');
            $list.siblings(_this.targetList).stop().slideDown();
        },
        listClose: function($list){
            var _this = this;
            $list.removeClass('on');
            $list.siblings(_this.targetList).stop().slideUp();
        }
    },
    accordion_menu : {
        accordionWrap : '.faq-list',
        accordionAnchor : '.accordion',
        accordionTxt : '.detail-area',
        accordionIcon : '.toggle-btn i',
        iconTxt : '.accordion span',
        init : function() {
            var _this = this;
            $(_this.accordionAnchor).on('click', function(){
                _this.action($(this));
            })
        },
        action : function($this){
            var _this = this;
            
            var $target = $this.parents(_this.accordionWrap);
            if($target.find(_this.accordionTxt).css('display') === 'none'){
                $target.find(_this.iconTxt).text('닫기');
                $target.find(_this.accordionIcon).attr('class','ico-arr-up');
                $target.find(_this.accordionTxt).addClass('on');
            }else {
                $target.find(_this.accordionIcon).attr('class','ico-arr-down');
                $target.find(_this.iconTxt).text('자세히보기');
                $target.find(_this.accordionTxt).removeClass('on');
            }
            
        }

    }
}

$(window).on('load', function(){
    ui.init();  //한번만 실행.
});