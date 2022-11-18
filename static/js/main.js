$(function(){
    var $searchBtn = $('.shopping_nav .search_btn'),
        $searchForm = $('header form');

    $searchBtn.click(function(){
        $searchForm.toggleClass('active');
    });

    $('.main_slides ul').bxSlider({
        controls:false,
        mode:'vertical'
    });

    var rateForm = $('.rateform'),
        rateBtn = rateForm.find('.vote span'),
        rateInput = rateForm.find('input');

    rateBtn.click(function(){
        var $this = $(this);
        var rateScore = $this.attr('data-rate');
        rateInput.val(rateScore);
        rateBtn.removeClass('active');

        rateBtn.each(function(idx){           
            if(idx < rateScore){
                $(this).addClass('active');
            }
        });
    });

    //상품상세 이미지 변경
    var $productPictures = $('.product_pictures'),
        $bigImg = $productPictures.find('.big_img'),
        $thumbImgList = $productPictures.find('.thumb_img li');

        /*
        리스트를 클릭하면 
        클릭한 그 요소의 active 추가한다.
        클릭한 그 요소의 자식요소 img의 data-target속성의 값을 확인해서
        큰 이미지의 경로를 수정해야 한다.        
        */
       $thumbImgList.click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            var targetImgPath = 'images/' + $(this).find('img').attr('data-target');

            $bigImg.attr('src',targetImgPath);
       });

       //상품 수량 가격 변경하기
       var $quantity = $('.quantity'),
           $unitprice =  $quantity.attr('data-unitprice'),
           $qtyBtn = $quantity.find('span'),
           $qytInput = $quantity.find('input'),
           $tagetTotal = $('.total_price .price');

           /*
           $qtyBtn클릭하면 그 요소가 class명 plus 있다면
           참이면 (플러스를 클릭했으면)
           $qytInput value 기존값에서 1증가
           거짓이면(마이너스를 클릭했으면)
           $qytInput value 기존값에서 1차감
           */
        $qtyBtn.click(function(){
            var currentCount = $qytInput.val();

            if($(this).hasClass('plus')){                
                $qytInput.val(++currentCount);
            }else{
                if(currentCount > 1){                    
                    $qytInput.val(--currentCount);
                }
            }
            //수량*단가 변수 total에 저장하고 그걸 .price 값으로 변경되도록 한다.
            var total = (currentCount * $unitprice).toLocaleString('en');
            
            $tagetTotal.text(total + '$');

        }); // $qtyBtn.click

        //category filter


        $( ".price_range" ).slider({
            range: true,
            min: 0,
            max: 1000,
            values: [ 80, 500 ],
            create: function( event, ui ) {
                var slideVal = $('.price_range span');
                var slideFirstVal = slideVal.filter(':first-of-type');
                var slideLastVal = slideVal.filter(':last-of-type');   

                slideVal.html('<i></i>');

                slideFirstVal.find('i').text($( ".price_range").slider( "values", 0 ) + '$');  
                slideLastVal.find('i').text($( ".price_range").slider( "values", 1 ) + '$');  
            },
            slide: function( event, ui ) { // 값이 바뀔때 마다 할일
                $('#from').val(ui.values[ 0 ]);              
                $('#to').val(ui.values[ 1 ]);

                var slideVal = $('.price_range span');
                var slideFirstVal = slideVal.filter(':first-of-type');
                var slideLastVal = slideVal.filter(':last-of-type');   

                slideVal.html('<i></i>');

                slideFirstVal.find('i').text(ui.values[ 0 ] + '$');  
                slideLastVal.find('i').text(ui.values[ 1 ] + '$');            
            }
          });
          $('#from').val($( ".price_range" ).slider( "values", 0 )); //초기값
          $('#to').val($( ".price_range" ).slider( "values", 1 ));//초기값
          

          $('#from').change(function(){	// from의 값이 유저가 입력한 값으로 바뀔 때 할 일
            var userValue = $(this).val(); // 사용자가 입력한 값
            $( ".price_range" ).slider( "values", 0, userValue );
          });

          $('#to').change(function(){	// to 의 값이 유저가 입력한 값으로 바뀔 때 할 일
            var userValue = $(this).val(); // 사용자가 입력한 값
            $( ".price_range" ).slider( "values", 1, userValue );
          });



});//document ready function