function wp_getdefaultHoverCss(layer_id)
{
    var getli='';
    var geta='';
    var cssstyle='';

    var navStyle = wp_get_navstyle(layer_id,'datasty_');
    if(navStyle.length > 0)
    {
        var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop:\\s*hover\\s*{[^}]+}",'i');
        var tmp = patt1.exec(navStyle);
        if(tmp)
        {
            var tmp1 = tmp[0].match(/{[^}]+}/)[0];
            tmp1=tmp1.replace('{','').replace('}','');
            getli=getli+tmp1;
        }

        patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
        tmp = patt1.exec(navStyle);
        if(tmp)
        {
            var tmp2 = tmp[0].match(/{[^}]+}/)[0];
            tmp2=tmp2.replace('{','').replace('}','');
            geta=geta+tmp2;
        }


    }

    navStyle = wp_get_navstyle(layer_id,'datastys_');
    var getlia='';
    if(navStyle.length > 0)
    {
        var layidlow=('#nav_'+layer_id+' li.wp_subtop>a:hover').toLowerCase();
        if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){
            var parstr="#nav_"+ layer_id +" li.wp_subtop>a:hover";
            getlia = navStyle.split(new RegExp(parstr,"i"));
            var combilestr='';
            for(key in getlia){
                var ervervalue='';
                if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
                    var parvalue=getlia[key].split('{');
                    if(('a'+parvalue[1]).indexOf('}')>0){
                        ervervalue=parvalue[1].split('}')[0];
                    }
                }
                combilestr=combilestr+ervervalue;
            }
            geta=geta+combilestr;
        }

        layidlow=('#nav_'+layer_id+' li.wp_subtop:hover').toLowerCase();
        if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){
            var parstr="#nav_"+ layer_id +" li.wp_subtop:hover";
            getlia = navStyle.split(new RegExp(parstr,"i"));
            var combilestrs='';
            for(var key in getlia){
                var ervervalue='';
                if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
                    var parvalue=getlia[key].split('{');
                    if(('a'+parvalue[1]).indexOf('}')>0){
                        ervervalue=parvalue[1].split('}')[0];
                    }
                }
                combilestrs=combilestrs+ervervalue;
            }
            getli=getli+combilestrs;
        }


    }

    if(getli.length>0){
        getli="#"+layer_id+" li.lihover{"+getli+"} ";
    }
    if(geta.length>0){
        geta="#"+layer_id+" li>a.ahover{"+geta+"} ";
    }
    cssstyle=getli+geta;
    if(cssstyle.length>0 && ($('#canvas #'+layer_id).length>0 || $('#site_footer #'+layer_id).length>0)){
        cssstyle=""+cssstyle+"";
        cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " ");
        var doms=$('#'+layer_id);
        var oldcssstyle=doms.data('get_layer_hover_css');
        if(oldcssstyle != cssstyle){
            $("#hover"+layer_id+"").text(""+cssstyle+"");
            doms.data('get_layer_hover_css',cssstyle);
            get_plugin_css("H"+ layer_id +"H",cssstyle);
        }
    }
}

function wp_showdefaultHoverCss(layer_id){
    var layertype=$('#'+layer_id).attr('type');
    if(layertype && window['wp_showdefaultHoverCss_'+layertype]){
        return window['wp_showdefaultHoverCss_'+layertype](layer_id);
    }
    return false;
}

function wp_showdefaultHoverCss_new_navigation(layer_id)
{

    var plugin_name=$("#"+layer_id).attr('type');
    var hover=$("#"+layer_id).find('.nav1').attr('hover');
    if(hover!=1){ return;}

    wp_getdefaultHoverCss(layer_id);
    var n=0;
    var rootpid=0;
    if(plugin_name=='new_navigation'){
        var page_id=$("#page_id").val();
        rootpid=$("#page_id").attr("rpid")*1;
    }else{
        var page_id=$('#'+layer_id+'').find(".default_pid").html();
        if(page_id==0 || page_id.length==0){
            page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');
        }
    }

    $('#nav_'+layer_id+'').children('li').each(function(){
        var type_pid=$(this).attr('pid');
        if( (type_pid==page_id ) && plugin_name=='new_navigation' ){
            $(this).addClass("lihover").children('a').addClass("ahover");
        }
        if(type_pid==rootpid && rootpid>0){
            $(this).addClass('rootlihover');
        }
        var t_bool = false;
        var whref = window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');;
        var t_href= $(this).find("a").attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');;
        var $nav1 =  $('#'+layer_id).children('.wp-new_navigation_content').children('.nav1');
        var sethomeurl = $nav1.attr("sethomeurl");
        if(sethomeurl) sethomeurl = sethomeurl.replace(/^https?:/,'');
        var cururl = window.location.href.replace(/^https?:/,'');
        if( (whref.indexOf("&menu_id=")>0 && t_href.indexOf("id=")>0 && whref.indexOf(t_href)>-1) || t_href == sethomeurl &&  sethomeurl.indexOf(cururl)>-1 ){
            t_bool = true;
        }

        if(whref == t_href || whref== t_href+"&brd=1" || t_bool){ $(this).addClass("lihover").children('a').addClass("ahover"); }
        n++;
    });
    if(!$('#nav_'+layer_id+'').children('li.lihover').length){
        $('#nav_'+layer_id+'').children('li.rootlihover:first').addClass("lihover").children('a').addClass("ahover");
    }
    $('#nav_'+layer_id+' .rootlihover').removeClass('rootlihover');
}
function wp_nav_addMoreButton(layer_id)
{
    var type_style=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');

    var index=0;
    var func=function(){
        if(!$('#scroll_container #'+layer_id+':visible').length){
            if(index<=20){
                setTimeout(func,500);
                index++;
            }
            return;
        }

        var firstLiTop = 0;
        var hasMore = false;
        $('#scroll_container  #nav_'+layer_id).children('li.wp_subtop').each(function(i){
            if(i == 0) {firstLiTop = $(this).offset().top;return true;}
            if($(this).offset().top > firstLiTop)
            {
                if(i==1){
                    var twice=$("#"+layer_id).data('twiced');
                    if(!twice){
                        $("#"+layer_id).data('twiced',true);
                        setTimeout(func,1500);
                        return false;
                    }
                }

                if(type_style==2){
                    $(this).remove();
                }else{

                    $('#'+layer_id).data('hasMore','yes');//閰嶇疆閫昏緫鑾峰彇
                    var more = $.trim($('#'+layer_id).children('.wp-new_navigation_content').children('.nav1').attr('more'));
                    var doms = $(this).prev().prev().nextAll().clone();
                    var objA = $(this).prev().children('a');
                    if(objA.children('span').length > 0) objA.children('span').html(more);
                    else objA.html(more);

                    if(objA.hasClass('sub'))
                    {
                        objA.next('ul').empty();
                        doms.appendTo(objA.next('ul'));
                    }
                    else
                    {
                        objA.after('<ul></ul>');
                        doms.appendTo(objA.next('ul'));
                        objA.addClass('sub');
                    }
                    objA.addClass('nav_more_link');
                    $(this).prev().nextAll().remove();
                    objA.next('ul').children('li').removeClass('wp_subtop').removeClass('lihover').children('a').removeClass("ahover");
                    hasMore = true;

                    objA.attr('href','javascript:void(0);');

                    //鐐瑰嚮"鏇村"寮瑰嚭鍏ㄧ珯瀵艰埅
                    if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
                    {
                        $(document).undelegate("#"+layer_id+" .nav_more_link",'click').delegate("#"+layer_id+" .nav_more_link",'click',function (e){
                            var func=function(){
                                $('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
                                    containerId:'wp-new_navigation-simplemodal-container_'+layer_id,
                                    zIndex:9999,
                                    close:false,
                                    onOpen:function(dialog){
                                        dialog.overlay.fadeIn('slow', function(){
                                            dialog.container.slideDown('slow',function(){
                                                dialog.data.fadeIn('slow','swing',function(){
                                                    $('.wp_menus').not('.wp_thirdmenu0').each(function(){
                                                        var left = $(this).parent().parent().children('a').eq(0).outerWidth()+5;
                                                        $(this).css({position:'relative',left:left+'px'});
                                                    });
                                                });
                                            });
                                        });
                                    },
                                    onClose:function(dialog){
                                        dialog.data.fadeOut('slow',function (){
                                            dialog.container.slideUp('slow', function () {
                                                dialog.overlay.fadeOut('slow', function () {
                                                    $.modal.close();
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                            if($('#'+layer_id).find('#basic-modal-content_'+layer_id).length){
                                func();
                            }else{
                                var morediv=$('#'+layer_id).find('.navigation_more');
                                var more_color=morediv.attr('data-more');
                                var typeval=morediv.attr('data-typeval');
                                var menudata=morediv.attr('data-menudata');
                                $.ajax({
                                    type: "POST",
                                    url: parseToURL("new_navigation", "windowpopup"),
                                    data: {layer_id:layer_id,color:more_color,typeval:typeval,menudata:menudata},
                                    success: function (response) {
                                        if (response == 'Session expired')
                                            window.location.href = getSessionExpiredUrl();
                                        morediv.replaceWith(response);
                                        func();
                                    },
                                    error: function (xhr, textStatus, errorThrown) {
                                        wp_alert(xhr.readyState + ',' + xhr.status + ' - ' + (errorThrown || textStatus) + "(get nav).<br/>" + translate("Request failed!"));
                                        return false;
                                    }
                                });
                            }
                            return false;
                        });

                    }
                    return false;
                }
            }
        });
        if(!hasMore) $('#'+layer_id).data('hasMore','no');
        wp_showdefaultHoverCss(layer_id);
    };
    func();
}

//缂栬緫妯″紡姘村钩鎷栧姩鍔ㄦ€佸埛鏂颁慨鏀筂ore鎸夐挳
function wp_updateMoreButton(layer_id)
{
    var $layer = $('#'+layer_id);
    var $nav1 = $layer.children('.wp-new_navigation_content').children('.nav1');
    var tmp_css = $.trim($("#datastys_"+layer_id).text());
    var tmp_cssa = $.trim($("#datasty_"+layer_id).text());
    $.post(parseToURL("new_navigation","refreshNavigator",{menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-new_navigation_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),hover_scr:$.trim($nav1.attr('hover_scr')),umenu:$.trim($nav1.attr('umenu')),dmenu:$.trim($nav1.attr('dmenu')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor'))}),{"addopts": $layer.mod_property("addopts")||{},menudata:$("#"+layer_id).data("menudata")},function(data){
        $layer.find('.wp-new_navigation_content').html(data);
        $("#datastys_"+layer_id).text(tmp_css);
        get_plugin_css(layer_id,tmp_cssa+" "+tmp_css);
    });
    wp_showdefaultHoverCss(layer_id);
}

function wp_removeLoading(layer_id)
{

    var $nav1 = $('#'+layer_id).find(".nav1");
    var ishorizon=$nav1.attr("ishorizon");
    if(ishorizon=='1'){
        $("#"+layer_id).find('.wp-new_navigation_content').css({height:'auto',overflow:'hidden'});
    }else{
        $("#"+layer_id).find('.wp-new_navigation_content').css({width:'auto',overflow:'hidden'});
    }
    // 淇IE娴忚鍣ㄩ儴鍒嗙増鏈鑸棤娉曟樉绀洪棶棰� 2013/12/26

    var temptimer = setTimeout(function(){
        $("#"+layer_id).find('.wp-new_navigation_content').css("overflow", 'visible');
        clearTimeout(temptimer);
    }, 50);
}

function richtxt(layer_id)
{
    var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
    if(type==2){
        var baseloop = 0;
        $("#"+layer_id).find('.ddli').each(function(){
            $(this).addClass("setdiff"+baseloop);
            baseloop++;
        });
    }
}

function wp_createNavigationgetSubMenuHoverCssFunc(param){
    var layer_id=param.layer_id;
    var editmode=param.editmode;
    function getSubMenuHoverCss(css_pro,type){
        var typeval=type;
        if(typeval==1){
            var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
        }else{
            var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
        }
        if(editmode){
            var navStyle = $.trim($("#datastys_"+layer_id).text());
        }else{
            var navStyle = $.trim($("#"+layer_id).data("datastys_"));
        }
        if(navStyle.length > 0){
            var patt1 =new RegExp(regex,'i');
            var tmp = patt1.exec($.trim(navStyle));
            if(tmp)
            {
                return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
            }
        }
        if(editmode){
            navStyle = $.trim($("#datasty_"+layer_id).text());
        }else{
            navStyle = $.trim($("#"+layer_id).data("datasty_"));
        }
        if(navStyle.length > 0)
        {
            if(typeval==1){
                var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
            }else{
                var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
            }
            var tmp = patt1.exec(navStyle);

            if(tmp)
            {
                var tmp1 = tmp[0].match(/{[^}]+}/)[0];
                var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
                tmp = patt2.exec(tmp1);
                if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
            }
        }
        return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
    }
    window[layer_id+'_getSubMenuHoverCss']=getSubMenuHoverCss;
}

function layer_new_navigation_content_func(params){
    var layer_id = params['layer_id'];
    $("#"+layer_id).find('.menu_hs11').css('visibility','hidden');
    var contentfunc=function(){
        if($("#"+layer_id).is(':visible')){
            $("#"+layer_id).find('.wp-new_navigation_content').each(function(){
                var wid = $(this).width();
                var liwid = $(this).find('li:eq(0)');
                var lipadd = parseInt(liwid.css('padding-right'))+parseInt(liwid.css('padding-left'));
                if ($.inArray(params.menustyle, ['hs9','hs11']) != -1) {
                    var bwidth = parseInt(liwid.css("borderRightWidth") || '0');
                    if(bwidth > 0) $('li.wp_subtop', this).width(function(i, h){return h - bwidth});
                }
                if(parseInt(liwid.width())>(wid-lipadd)){
                    $(this).find('li.wp_subtop').css('width',wid-lipadd);
                }
            });
            $("#"+layer_id).find('.menu_hs11').css('visibility','');
            var contenth=$("#"+layer_id+" .wp-new_navigation_content").height();
            if(contenth==0){
                $("#"+layer_id+" .wp-new_navigation_content").css('height','');
            }
        }else{
            setTimeout(contentfunc,60);
        }
    }
    contentfunc();
    if(params.isedit){$('#'+layer_id).mod_property({"addopts": params.addopts});}
    if((params.addopts||[]).length > 0 && /^hs/i.test(params.menustyle)){$('#nav_'+layer_id+' li.wp_subtop:last').css("border-right", 'none');}
    if(! params.isedit){
        if($.inArray(params.menustyle, ['vertical_vs6','vertical_vs7']) != -1){
            var $layer=$('#'+layer_id).find(".wp-new_navigation_content");
            var vswidth=$layer.width();
            var $ul=$layer.find('ul.navigation');
            $ul.css({width:vswidth+'px'});
            $ul.find("li.wp_subtop").css({width:(vswidth-14)+'px'});
        }
    }
};
function layer_media_init_func(layerid){
    var $curlayer=$('#'+layerid);
    $('#wp-media-image_'+layerid).mouseover(function (event) {
        var effect=$curlayer.data('wopop_imgeffects');
        var $this=$(this);
        var running=$this.data('run');
        if(effect && running!=1){
            $curlayer.setimgEffects(true,effect,1);
        }
    });

    var imgover=$('#wp-media-image_'+layerid).closest('.img_over');
    imgover.children('.imgloading').width(imgover.width()).height(imgover.height());
    imgover.css('position','relative');
    $('#'+layerid).layer_ready(function(){
        layer_img_lzld(layerid);
    });
};
function detectZoom (){
    var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase() || '';
    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    }else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    }else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio){
        ratio = Math.round(ratio * 100);
    }
    return ratio;
}

function layer_unslider_init_func(params){
    var layerid = params.layerid;
    var module_height =params.module_height;
    if (layerid.length == 0) return;
    //Set module height start
    if(module_height && parseInt(module_height)){
        $('#'+layerid).css('height',module_height+'px').removeAttr('module_height');
        $('#'+layerid+' .wp-resizable-wrapper').css('height',module_height+'px');
    }//Set module height end
    var $content = $('#'+layerid+'_content');
    var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
    $content.css("border", params.pstyle);
    var fullparent = $content.parents('.fullpagesection').length;
    var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
    if(fullparent) { cnvpos.left = Math.abs($('.fullpagesection').css('left').replace('px','')); }
    cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
    var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
    if(fullparent) { canwidth = $(window).width(); }
    if(cnvpos.left<0) cnvpos.left=0;
    $content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});
    $('#'+layerid).css({left: '0',width: $('#canvas').width()});
    $('#'+layerid+' .banner').css("min-height", cntheight+'px'); $('#'+layerid+' .banner').css("height", cntheight+'px');
    $('#'+layerid+' .bannerul').css("height", cntheight+'px');
    $('#'+layerid+' .banner ul li').css("min-height", cntheight+'px').css('width',($('#scroll_container_bg').width() - borderwidth)+'px');$('#'+layerid+' .banner ul li').css("height", cntheight+'px');
    $('#'+layerid+' .banner .inner').css("padding", cntheight/2+'px 0px');
    $('#'+layerid).layer_ready(function(){
        var ctrldown = false;
        $(window).resize(function(){
            if(!ctrldown){
                setTimeout(function(){
                    var $content = $('#'+layerid+'_content');
                    var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
                    var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
                    cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
                    var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
                    if(cnvpos.left<0) cnvpos.left=0;
                    $content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});
                },0)
            }
        })
        $(window).keydown(function(event){
            if(!event.ctrlKey){
                var $content = $('#'+layerid+'_content');
                var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
                var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
                cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
                var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
                if(cnvpos.left<0) cnvpos.left=0;
                $content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});

            }else{
                ctrldown = true;
            }
        })
    })
    $('#'+layerid).layer_ready(function(){
        var transitionstr=params.easing;
        if(params.easing=='all'){
            transitionstr=($.browser.msie) ? "slide,slice,blocks,blinds,fade" : "slide,slice,blocks,blinds,shuffle,threed,fade";
        }
        if(params.default_show=='1'){
            var arrow_show='always';
        }
        if(params.hover_show=='1'){
            var arrow_show='mouseover';
        }
        var $content = $('#'+layerid +' #'+layerid +'_content');
        var cntheight = $content.parent().height();
        cntheight = $('#'+layerid+' .wp-unslider_content').height();
        if(cntheight=='') cntheight=267;
        var  cnpos = $('#'+layerid+' .wp-unslider_content').offset();
        var contentpos = (cntheight)-39;
        if(!params.arrow_left){
            var arrow_left='template/default/images/left_arrow.png';
        }else{
            var arrow_left=params.arrow_left;
        }
        if(!params.arrow_right){
            var arrow_right='template/default/images/right_arrow.png';
        }else{
            var arrow_right=params.arrow_right;
        }
        var scripts = document.getElementsByTagName("script");
        var jsFolder = "";
        for (var i= 0; i< scripts.length; i++)
        {
            if( scripts[i].src && scripts[i].src.match(/lovelygallery\.js/i))
                jsFolder = scripts[i].src.substr(0, scripts[i].src.lastIndexOf("/") + 1);
        }
        $LAB
            .script(relativeToAbsoluteURL('plugin/unslider/js/html5zoo.js?v=2')).wait(function(){
            var win_width = $('#scroll_container_bg').width();
            jQuery("#"+layerid+"html5zoo-1").html5zoo({
                jsfolder:jsFolder,
                width:win_width,height:cntheight,
                skinsfoldername:"",loadimageondemand:false,isresponsive:false,
                addmargin:true,randomplay:false,
                slideinterval:params.interval,     // 鎺у埗鏃堕棿
                loop:0,
                autoplay:params.autoplays=='false'?false:true,
                skin:"Frontpage",
                navbuttonradius:0,
                navmarginy:contentpos,showshadow:false,
                navcolor:"#999999",
                texteffect:"fade",
                navspacing:12,
                arrowtop:50,
                textstyle:"static",
                navpreviewborder:4,
                navopacity:0.8,
                shadowcolor:"#aaaaaa",
                navborder:4,
                navradius:0,
                navmarginx:16,
                navstyle:"bullets",
                timercolor:"#ffffff",
                navfontsize:12,
                navhighlightcolor:"#333333",
                navheight:12,navwidth:12,
                navshowfeaturedarrow:false,
                titlecss:"display:block;position:relative;font:"+params.title_size+"px "+params.title_family+"; color:"+params.title_color+";",//font style
                arrowhideonmouseleave:500,
                arrowstyle:params.skin=='01'?'none':arrow_show,
                texteffectduration:win_width,
                border:0,
                timerposition:"bottom",
                navfontcolor:"#333333",
                borderradius:0,
                textcss:"display:block; padding:12px; text-align:left;",
                navbordercolor:"#ffffff",
                textpositiondynamic:"bottomleft",
                ribbonmarginy:0,
                ribbonmarginx:0,
                unsliderheight:cntheight,
                unsliderlid:layerid,
                arrowimage_left:arrow_left,
                arrowimage_right:arrow_right,
                navigation_style:params.navigation_style,
                navbg_hover_color:params.navbg_hover_color,
                nav_margin_bottom:params.nav_margin_bottom_size,
                nav_arrow:params.nav_arrow,
                nav_margin_left:params.nav_margin_left_size,
                nav_margin_right:params.nav_margin_right_size,
                skin:params.skin,
                pauseonmouseover:params.pauseonmouseover=='1'?true:false,
                slide: {
                    duration:win_width,
                    easing:"easeOutCubic",
                    checked:true
                },
                crossfade: {
                    duration:win_width,
                    easing:"easeOutCubic",
                    checked:true
                },
                threedhorizontal: {
                    checked:true,
                    bgcolor:"#222222",
                    perspective:win_width,
                    slicecount:1,
                    duration:1500,
                    easing:"easeOutCubic",
                    fallback:"slice",
                    scatter:5,
                    perspectiveorigin:"bottom"
                },
                slice: {
                    duration:1500,
                    easing:"easeOutCubic",
                    checked:true,
                    effects:"up,down,updown",
                    slicecount:10
                },
                fade: {
                    duration:win_width,
                    easing:"easeOutCubic",
                    checked:true,
                    effects:"fade",
                },
                blocks: {
                    columncount:5,
                    checked:true,
                    rowcount:5,
                    effects:"topleft,bottomright,top,bottom,random",
                    duration:1500,
                    easing:"easeOutCubic"
                },
                blinds: {
                    duration:2000,
                    easing:"easeOutCubic",
                    checked:true,
                    slicecount:3
                },
                shuffle: {
                    duration:1500,
                    easing:"easeOutCubic",
                    columncount:5,
                    checked:true,
                    rowcount:5
                },
                threed: {
                    checked:true,
                    bgcolor:"#222222",
                    perspective:win_width,
                    slicecount:5,
                    duration:1500,
                    easing:"easeOutCubic",
                    fallback:"slice",
                    scatter:5,
                    perspectiveorigin:"right"
                },
                transition: transitionstr
            });
            //html5zoo-text position
            var fontheight = $('#'+layerid+' .unslidertxtf').height();
            var textheight = parseInt(params.title_size)+10;
            if(params.show_title=='1'){
                if($('#'+layerid+' .html5zoo-text-bg-1').css('display')=='none'){
                    var fv = parseInt($('#'+layerid+' .html5zoo-title-1').css('font-size'));
                    var sv = parseInt($('#'+layerid+' .html5zoo-text-1').css('padding-top'));
                    fontheight = fv+sv*2;
                }else if(fontheight<textheight){
                    fontheight = fontheight+textheight;
                }
            }

            $('#'+layerid+' .unslidertxtf').css({'top':(cntheight-fontheight)});
            if(params.show_nav=='0'){
                $('#'+layerid+' .dotsnew-nav').css({'display':'none'});
            }
        });
    });

};
function layer_breadcrumb_ready_func(layerid, showorder){
    if (showorder == '2') {
        var $span_home=$("#"+layerid).find(".breadcrumb_plugin span").eq(0).clone();
        var $span_fuhao=$("#"+layerid).find(".breadcrumb_plugin span").eq(1).clone();
        $("#"+layerid).find(".breadcrumb_plugin span").eq(0).remove();
        $("#"+layerid).find(".breadcrumb_plugin span").eq(0).remove();
        $("#"+layerid).find(".breadcrumb_plugin").append($span_fuhao).append($span_home);
    }

    var fuhao1=['>>','鈥�','鈼�','鈫�','鈥�','鈭�','鈯�','鈽�','銆�','锝�','锛�','锛�','鈽�','锟�','#','鈮�'];
    var fuhao2=['<<','鈥�','鈼�','鈫�','鈥�','鈭�','鈯�','鈽�','銆�','锝�','<','锛�','鈽�','锟�','#','鈮�'];
    window['ShowOrder'] = function(gzfuhao,plugin_id){
        $span_html=$($("#"+plugin_id).find(".breadcrumb_plugin").html()).clone();
        $("#"+plugin_id).find(".breadcrumb_plugin").html('');
        $.each($span_html,function(i,n){
            $("#"+plugin_id).find(".breadcrumb_plugin").prepend($(n));
        });
        $("#"+plugin_id).find(".breadcrumb_plugin").find("span:odd").html(gzfuhao);
    };
    window['ShowOrder2'] = function(plugin_id){
        if($("#"+plugin_id).find(".breadcrumb_plugin").find('span').last().attr('gzdata')!='gzorder') {
            ShowOrder(fuhao2[$('#'+plugin_id).find(".breadcrumbfuhao").attr("gz")],plugin_id);
        }
    };
    window['ShowOrder1'] = function(plugin_id){
        if($("#"+plugin_id).find(".breadcrumb_plugin").find('span').last().attr('gzdata')=='gzorder') {
            ShowOrder(fuhao1[$('#'+plugin_id).find(".breadcrumbfuhao").attr("gz")],plugin_id);
        }
    };
};
function layer_article_list_checkid_func(params){
    $(function(){
        var layer_id = "#"+params.layer_id;
        $(layer_id+' .articleid').unbind('click.list_check').bind('click.list_check',function(event){
            event.preventDefault();
            var gourl = $(this).attr('href');
            var targettype = $(this).attr('target');
            _this = $(this);
            $.ajax({
                type: "POST",
                url: parseToURL('article_list','checkarticleid'),
                data: {id:$(this).attr('articleid')},
                dataType: "json",
                async:false,
                success: function(r){
                    var islogin = params.islogin;
                    if(r.code == -2  && !islogin){ //鏄細鍛�
                        if(!islogin){
                            event.preventDefault();
                            $LAB
                                .script(relativeToAbsoluteURL("script/datepicker/custom_dialog.js"))
                                .wait(function(){
                                    show_custom_panel(parseToURL('userlogin','login_dialog'),{
                                        title:'Login',
                                        overlay:true,
                                        id:'wp_user_info'
                                    });
                                });
                        }
                        return false;
                    }else if(r.code == -1){ //涓嶆槸浼氬憳
                        ismember = false;
                    }

                    if(targettype == undefined && gourl != 'javascript:void(0);'){
                        location.href=gourl;
                    }else if(targettype != undefined && gourl != 'javascript:void(0);'){
                        window.open(gourl,'','',true);
                    }
                }
            })

        })

    })
}

function layer_article_list_init_func(param){
    if(!getSystemSession()){
        var $window=$(window);
        var layerid=param.layer_id;
        if($('#'+layerid).length&&$('#'+layerid).closest('#canvas,#site_footer').length){
            var $body = $('#scroll_container');
            var scrolTop = Math.max($(window).scrollTop(), $body.scrollTop());
            $(document.body).add($body).stop().animate( { scrollTop: 0}, 10);
        }
    }
    var layerid=param.layer_id;
    var articleStyle=param.articleStyle;
    window['set_thumb_'+layerid]=function(obj) {
        var callback=function(img){
            img.fadeIn('slow',function(){
                img.closest('li').find('.imgloading').remove();
            });
        }
        $(obj).each(function() {
            var img=$(this);
            callback(img);
        });
    }
    if(articleStyle=='two_column'){
        $(function(){
            var $p = $('li p', "#"+layerid);
            var maxW = Math.max.apply(Math, $p.map(function(){
                return $(this).width();
            }).toArray());
            $p.width(maxW);
        });
    }else{
        if (articleStyle === "skin3" || articleStyle === "ulist3") {
            $(function(){
                var maxliheight = 0,tmplayerid = "#"+layerid;
                if (tmplayerid.length == 1) return;var $tmpnode = $(tmplayerid+' li > .wp-new-article-style-c');
                maxliheight = Math.max.apply(null,$tmpnode.map(function(){return $(this).outerHeight();}).toArray());
                if (maxliheight) $tmpnode.height(maxliheight);
                // 鍙抽棿璺� 2014/03/17
                $(tmplayerid).bind("fixedmarginright", function(e, margin){
                    var $target = $(this),$li = $target.find('li');
                    if(margin != undefined) $li.css("margin-right", margin+'px');
                    var $first = $li.filter(':first'),liwidth = $first.outerWidth(),
                        mgnright = $._parseFloat($first.css("marginRight")),
                        maxwidth = $target.children('.wp-article_list_content').width(),
                        maxcols = Math.floor(maxwidth / (liwidth + mgnright));
                    if(maxwidth >= maxcols * (liwidth + mgnright) + liwidth) maxcols += 1;
                    for(var i = 1,licnt = $li.length; i <= licnt; i++){
                        if (i % maxcols != 0) continue;
                        if ((maxcols == 1) && (2*liwidth <= maxwidth)) continue;
                        $li.filter(':eq('+(i - 1)+')').css("margin-right", '0');
                    }
                    //			$curlayer = $li = null;
                    $li = null;
                }).triggerHandler("fixedmarginright");
                // <<End
                tmplayerid = $tmpnode = null;
            });
        }

        if (articleStyle === "default" || articleStyle === "ulist2"|| articleStyle === "ylist2") {
            $(function(){
                var LID = layerid;
                $('#'+LID).bind("fixedliwidth", function(e, margin){

                    $('#'+LID).find('li').each(function(){
                        //set 01-right width
                        var $PL = $('.article_list-'+LID),MAXW = $PL.outerWidth(),
                            LW = $PL.find('li:first > .wp-new-article-style-01-left').outerWidth(true);
                        $PL.find('li > .wp-new-article-style-01-right').css({"width": (MAXW - LW)+'px',"overflow": 'hidden',"word-wrap": 'break-word'});

                        //set li width
                        var self=$(this);var leftwidth=self.find('.wp-new-article-style-01-left').outerWidth();
                        var rightwidth=self.find('.wp-new-article-style-01-right').outerWidth();
                        if(articleStyle == "ylist2") $PL.find('li > .time').css({"width": (MAXW - LW)+'px'});
                        $PL = null;
                        if(articleStyle != "ylist2") self.css('width',(leftwidth+rightwidth+350)+'px');

                    })

                }).triggerHandler("fixedliwidth");
            });
        }
    }
}

function layer_article_list_pager_func(param){
    $(function(){
        var ua = navigator.userAgent.toLowerCase() || '';
        var layerid = param.layer_id,$cstlayer = $('#'+layerid),
            $pglnker = $cstlayer.find('.wp-article_list_content .wp-pager_link');
        $pglnker.find('a').click(function(e,page){
            var pageid = page||$(this).attr("href").replace("###",'');
            if(param.editmode == "1") $.method.article_list.refreshArticleList({"page":pageid,"layerid":layerid});
            else {
                var dom = $cstlayer.find('.article_list_save_itemList'),
                    params = {
                    };
                var liststyle={"artliststyle":param.artliststyle}
                $.ajax({
                    type: "GET",
                    url: parseToURL("article_list","get_page"),
                    data: {article_category:param.article_category_param,layer_id: layerid,page: pageid,article_category_more:param.article_category_more},
                    success: function(data){
                        var $layer = $("#"+layerid);
                        var oldHeight = $layer.find('.article_list-'+layerid).height();
                        $layer.children('.wp-article_list_content').before(data).remove();
                        if(!ua.match(/chrome\/46/)){
                            wp_heightAdapt($layer);
                            /**
                             * #淇鈥滃垎椤碘€濆悗楂樺害鍑虹幇寮傚父闂锛坆ug#4316锛�2015/11/17
                             * #鎻掍欢鍐呭楂樺害瀹為檯涓婃病鏈夐棶棰橈紝鍙洜鈥滃垎椤碘€濆尯鍩熷畾浣嶉棶棰樿€屽鑷寸殑閿欒
                             * bug(#4515)鍙戠幇妯″潡楂樺害灏忎簬鍐呭楂樺害瀵艰嚧鍒嗛〉闅愯棌
                             */
                            var $C = $layer.children('.wp-article_list_content'),$W = $C.children('.article_list-'+layerid);
                            //$W.children('.wp-pager_link').css("margin-top", ($C.height() - $W.height())+'px');
                            var c_h = $C.height(),w_h = $W.height();
                            if(c_h<w_h){$C.height($W.height())}
                        }
                        var pageskips = param.pageskip,product_listtop='';
                        if(pageskips == 2){
                            product_listtop = parseInt($cstlayer.offset().top+$('#scroll_container').scrollTop()-$('.full_column-fixed').height());
                            setTimeout(function(){
                                if(product_listtop){$('#scroll_container').scrollTop(product_listtop);}
                            },50);
                        }
                    }
                });
                //杩斿洖娴忚鍣ㄩ《閮�
                var $scroll_container = $('#scroll_container');
                $scroll_container.scrollTop(0);
                var pageskips = param.pageskip,product_listtop='';
                if(pageskips == 2){
                    product_listtop = parseInt($cstlayer.offset().top+$('#scroll_container').scrollTop()-$('.full_column-fixed').height());
                    if(product_listtop){$scroll_container.scrollTop(product_listtop);}
                }
            }

            return false;
        });
        // About input
        $pglnker.find(':input').each(function(i,dom){
            var $input = $(this),ent = pgid = '',fnc;
            switch($input.attr("type")) {
                case "text":
                    ent = 'keyup';
                    fnc = function(){
                        pgid = this.value = this.value.replace(/(?:\b0|[^\d+])/i,'');
                        return false;
                    };
                    break;
                case "button":
                    ent = 'click';
                    fnc = function(){
                        if (pgid.length && /^[1-9]{1}\d*$/.test(pgid)) {
                            var maxpg = _int($pglnker.find('span.total').html());
                            if(!maxpg) maxpg = 1;
                            $pglnker.find('a').triggerHandler('click',[Math.min(pgid,maxpg)]);
                        }
                        function _int(numString){
                            var number = parseInt(numString);
                            if(isNaN(number)) return 0;
                            return number;
                        }
                        return false;
                    };
                    break;
            }
            if(fnc && $.isFunction(fnc)) $input[ent](fnc);
        });
    });
}/**
 * Created by 子健 on 2017/8/29.
 */
