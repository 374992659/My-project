(function(){
    /*
    * #可以通过pc端拖拽使用
    * #允许单个配置
    */
    var defaults,
        d = new Date(),
        nowYear = d.getFullYear(),
        nowMonth = d.getMonth() + 1,
        domDate,
        createDate,
        emptyStr = "<li></li>",
        domHm = '<div class="t4">时</div><div class="t5">分</div>',
        domHm2 = '<ol id="d-hours"></ol><ol id="d-minutes"></ol>',
        domS = '<div class="t6">秒</div>',
        domS2 = '<ol id="d-seconds"></ol>',
        isTouch = "ontouchend" in document ? true : false,
        tstart = isTouch ? "touchstart" : "mousedown",
        tmove = isTouch ? "touchmove" : "mousemove",
        tend = isTouch ? "touchend" : "mouseup",
        tcancel = isTouch ? "touchcancel" : "mouseleave";

    var opts = {
        beginYear: 2010,
        endYear: 2020,
        type:'YYYY-MM-DD',
        limitTime:false
    };
    //dom渲染
    domDate = '<div id="date-wrapper"><h3>选择日期</h3><div id="d-content"><div id="d-tit"><div class="t1">年</div><div class="t2">月</div>' + '<div class="t3">日</div></div><div id="d-bg"><ol id="d-year"></ol><ol id="d-month"></ol>' + '<ol id="d-day"></ol>' + '</div></div><a id="d-cancel" href="javascript:">取消</a><a id="d-confirm" href="javascript:">确定</a></div><div id="d-mask"></div>';
    var css = '<style type="text/css">a{text-decoration:none;}ol,li{margin:0;padding:0}li{list-style-type:none}#date-wrapper{position:fixed;top:20%;left:50%;width:90%;margin-left:-45%;z-index:56;text-align:center;background:#fff;border-radius:3px;padding-bottom:15px;display:none}#d-mask{position:fixed;width:100%;height:100%;top:0;left:0;background:#000;filter:alpha(Opacity=50);-moz-opacity:.5;opacity:.5;z-index:55;display:none}#date-wrapper h3{line-height:50px;background:#79c12f;color:#fff;font-size:20px;margin:0;border-radius:3px 3px 0 0}#date-wrapper ol,#d-tit>div{width:16.6666666%;float:left;position:relative}#d-content{padding:10px}#d-content #d-bg{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:0 0 5px 5px;height:120px;overflow:hidden;margin-bottom:10px;position:relative}#d-cancel,#d-confirm{border-radius:3px;float:left;width:40%;line-height:30px;font-size:16px;background:#dcdddd;color:#666;margin:0 5%}#d-confirm{background:#79c12f;color:#fff}#date-wrapper li{line-height:40px;height:40px;cursor:pointer;position:relative}#d-tit{background:#f8f8f8;overflow:hidden;border-radius:5px 5px 0 0;line-height:30px;border:1px solid #e0e0e0;margin-bottom:-1px}#date-wrapper ol{-webkit-overflow-scrolling:touch;position:absolute;top:0;left:0}#date-wrapper ol:nth-child(2){left:16.6666666%}#date-wrapper ol:nth-child(3){left:33.3333332%}#date-wrapper ol:nth-child(4){left:49.9999998%}#date-wrapper ol:nth-child(5){left:66.6666664%}#date-wrapper ol:nth-child(6){left:83.333333%}#d-content #d-bg:after{content:\'\';height:40px;background:#ddd;position:absolute;top:40px;left:0;width:100%;z-index:1}#date-wrapper li span{position:absolute;width:100%;z-index:99;height:100%;left:0;top:0}#date-wrapper.three ol,.three #d-tit>div{width:33.333333%}#date-wrapper.three ol:nth-child(2){left:33.333333%}#date-wrapper.three ol:nth-child(3){left:66.666666%}#date-wrapper.four ol,.four #d-tit>div{width:25%}#date-wrapper.four ol:nth-child(2){left:25%}#date-wrapper.four ol:nth-child(3){left:50%}#date-wrapper.four ol:nth-child(4){left:75%}#date-wrapper.five ol,.five #d-tit>div{width:20%}#date-wrapper.five ol:nth-child(2){left:20%}#date-wrapper.five ol:nth-child(3){left:40%}#date-wrapper.five ol:nth-child(4){left:60%}#date-wrapper.five ol:nth-child(5){left:80%}</style>';
    $("head").append(css);
    $('body').append(domDate);

    createDate = {
        ymd:function(begin,end){
            var domYear = '',
                domMonth = '',
                domDay = '';
            //dom 年 月 日
            for (var i = begin; i <= end; i++){domYear += '<li><span>' + i + '</span></li>';}
            $('#d-year').append(emptyStr + domYear + emptyStr);

            for (var j = 1; j <= 12; j++) {j = j<10?'0'+j:j;domMonth += '<li><span>' + j + '</span></li>';}
            $('#d-month').append(emptyStr + domMonth + emptyStr);

            var day = createDate.bissextile(nowYear,nowMonth);
            for (var k = 1; k <= day; k++) {k = k<10?'0'+k:k;domDay += '<li><span>' + k + '</span></li>';}
            $('#d-day').append(emptyStr + domDay + emptyStr);
        },
        hm:function(){
            var domHours = '',domMinutes = '';
            for (var i = 0; i <= 23; i++) {i = i<10?'0'+i:i;domHours += '<li><span>' + i + '</span></li>';}
            $('#d-hours').append(emptyStr + domHours + emptyStr);

            for (var j = 0; j <= 59; j++) {j = j<10?'0'+j:j;domMinutes += '<li><span>' + j + '</span></li>';}
            $('#d-minutes').append(emptyStr + domMinutes + emptyStr);

        },
        s:function(){
            var domSeconds = '';
            for (var i = 0; i <= 59; i++) {i = i<10?'0'+i:i;domSeconds += '<li><span>' + i + '</span></li>';}
            $('#d-seconds').append(emptyStr + domSeconds + emptyStr);
        },
        bissextile:function(year,month){
            var day;
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                day = 31
            } else if (month == 4 || month == 6 || month == 11 || month == 9) {
                day = 30
            } else if (month == 2) {
                if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) { //闰年
                    day = 29
                } else {
                    day = 28
                }

            }
            return day;
        },
        slide:function(el){
            //滑动
            var T,mT,isPress = false;
            $(document).on(tstart,'#date-wrapper ol', function(e){
                var e = e.originalEvent;
                e.stopPropagation();
                e.preventDefault();
                T = e.pageY || e.touches[0].pageY;
                if(!isTouch){isPress = true;}
            });
            $(document).on(tmove,'#date-wrapper ol', function(e){
                var e = e.originalEvent,that = $(this);
                e.stopPropagation();
                e.preventDefault();
                if(!isTouch && !isPress){return false};
                mT = e.pageY || e.touches[0].pageY;
                that.css('top', that.position().top + (mT - T) + 'px');
                T = mT;
                if($('#d-bg').hasClass('limitTime')){
                    if(that.attr('id') == 'd-year' && that.position().top > yTop){
                        that.css('top', yTop + 'px');
                    }else if(that.attr('id') == 'd-month' && that.position().top > mTop){
                        that.css('top', mTop + 'px');
                    }else if(that.attr('id') == 'd-day' && that.position().top > dTop){
                        that.css('top', dTop + 'px');
                    }
                }
                if (that.position().top > 0) that.css('top', '0');
                if (that.position().top < -(that.height() - (120))) that.css('top', '-' + (that.height() - (120)) + 'px');
            });
            $(document).on(tend,'#date-wrapper ol', function(e){
                var e = e.originalEvent,that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                dragEnd(that);
            });
            $(document).on(tcancel,'#date-wrapper ol', function(e){
                var e = e.originalEvent,that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                dragEnd(that);
            });
            function dragEnd(that){
                //滚动调整
                var t = that.position().top;
                that.css('top',Math.round(t/40)*40+'px');
                //定位active
                t = Math.round(Math.abs($(that).position().top));
                var li = that.children('li').get(t/40+1);
                $(li).addClass('active').siblings().removeClass('active');
                //修正日期
                var id = that.attr('id');
                if(id == 'd-month' || id == 'd-year'){
                    var day = createDate.bissextile($('#d-year .active').text(),$('#d-month .active').text());
                    if(day != ($('#d-day li').length-2)){
                        var thisActive = $('#d-day .active').text();
                        thisActive > day&&(thisActive = day);
                        var str = '';
                        for (var i = 1; i <= day; i++) {
                            if (i == thisActive) {
                                str += '<li class="active"><span>' + i + '</span></li>';
                            } else {
                                str += '<li><span>' + i + '</span></li>';
                            }
                        }
                        $('#d-day').html(emptyStr + str + emptyStr);
                        if(Math.abs($('#d-day').position().top) > $('#d-day').height()-120)$('#d-day').css('top','-'+($('#d-day').height()-120)+'px');
                    }
                }
            }
        },
        show:function(isShow){
            var domMain = $('#date-wrapper'),
                domMask = $('#d-mask');
            if (isShow) {
                domMain.show();
                domMask.show();
            } else {
                domMain.hide();
                domMask.hide();
            }
        },
        resetActive:function(){
            var d = new Date();
            $('#date-wrapper ol').each(function() {
                var e = $(this),
                    eId = e.attr('id');
                e.children('li').each(function() {
                    var lie = $(this),liText = lie.text() == ''? 'x':lie.text();
                    if (eId == 'd-year' && liText == d.getFullYear()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-month' && liText == (d.getMonth() + 1)) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-day' && liText == d.getDate()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-hours' && liText == d.getHours()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-minutes' && liText == d.getMinutes()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-seconds' && liText == d.getSeconds()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    }
                })
            })
        },
        toNow:function(refresh){
            if (!refresh) {
                $('#date-wrapper ol').each(function() {
                    var liTop = -($(this).children('.active').position().top -40);
                    $(this).animate({
                            top: liTop
                        },
                        600);
                    if($(this).attr('id') == 'd-year'){
                        var  yTop = liTop;
                    }else if($(this).attr('id') == 'd-month'){
                        var  mTop = liTop;
                    }else if($(this).attr('id') == 'd-day'){
                        var dTop = liTop;
                    }
                })
            } else {
                $('#date-wrapper ol').each(function() {
                    $(this).animate({
                            top: 0
                        },
                        0);
                })
            }
        },
        clear:function(){
            createDate.toNow(true);
            createDate.show(false);
        }
    };
    createDate.slide();
    var opt,activeEl;
    function DateTool(obj){
        var that = $(obj);
        that.bind('click',function() {
            if (!$('#date-wrapper').is(':visible')) {
                if(that.get(0).tagName == 'INPUT'){that.blur();}
                if(activeEl != obj){
                    $('#date-wrapper ol').empty();
                    activeEl = obj;
                    opt = null;
                    opt = $.extend({},opts,that.data('options'));
                    console.log(opt);
                    createDate.ymd(opt.beginYear,opt.endYear);
                    if(opt.type == "YYYY-MM-DD hh:mm:ss"){
                        $('#d-tit div:gt(2)').remove();
                        $('#d-bg ol:gt(2)').remove();
                        $('#d-tit').append(domHm+domS);
                        $('#d-bg').append(domHm2+domS2);
                        createDate.hm();
                        createDate.s();
                        $('#date-wrapper').attr('class','');
                    }else if(opt.type == "YYYY-MM-DD hh:mm"){
                        $('#d-tit div:gt(2)').remove();
                        $('#d-bg ol:gt(2)').remove();
                        $('#d-tit').append(domHm);
                        $('#d-bg').append(domHm2);
                        createDate.hm();
                        $('#date-wrapper').attr('class','five');
                    }else{
                        $('#d-tit div:gt(2)').remove();
                        $('#d-bg ol:gt(2)').remove();
                        $('#date-wrapper').attr('class','three');
                    }
                }
                createDate.resetActive();
                createDate.show(true);
                createDate.toNow(false);
                $('#d-confirm').attr('d-id', obj);
                $('#d-bg').removeClass('limitTime');
                if(opt.limitTime){$('#d-bg').addClass('limitTime')}
            }
        });
    }
    jQuery.date = function(obj){
        return new DateTool(obj);
    };
    //取消
    $(document).on('click','#d-cancel',function(){
        createDate.clear();
    });
    //确定
    $(document).on('click','#d-confirm',function(){
        var y = $('#d-year .active').text(),
            m = $('#d-month .active').text(),
            d = $('#d-day .active').text(),
            h = $('#d-hours .active').text(),
            min = $('#d-minutes .active').text(),
            s = $('#d-seconds .active').text(),
            str,
            that = $($(this).attr('d-id'));
        if(opt.type == "YYYY-MM-DD hh:mm:ss"){
            str = y+'-'+m+'-'+d+' '+h+':'+min+':'+s;
        }else if(opt.type == "YYYY-MM-DD hh:mm"){
            str = y+'-'+m+'-'+d+' '+h+':'+min;
        }else{
            str = y+'-'+m+'-'+d;
        }

        //赋值
        console.log('id:' + $(this).attr('d-id'),'时间:' + str);
        if(that.get(0).tagName == 'INPUT'){
            that.val(str);
        }else{
            that.text(str);
        }
        createDate.toNow(true);
        createDate.show(false);
    })
})(jQuery);
// 调用时间函数
// $.date('#other-date1');
// $.date('#other-date2');
// $.date('#gathertime');