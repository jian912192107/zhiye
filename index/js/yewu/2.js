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
            .script(relativeToAbsoluteURL('plugin/unslider/js/html5zoo.js')).wait(function(){
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
var jeditMode = 0;
function layer_prdcat_setvar(params){
    jeditMode = params.isedit;
    if(jeditMode){
        $(function(){
            $("#"+params.layerid+" li a").removeAttr('onclick').click(function(){return false;});
        });
    }
}

function wp_getdefaultHoverCss(layer_id)
{
    var getli='';
    var geta='';
    var cssstyle='';

    if(jeditMode){
        var navStyle = $.trim($("#datasty_"+layer_id).text());
    }else{
        var navStyle = $.trim($("#"+layer_id).data("datasty_"));
    }
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
    if(jeditMode){
        navStyle = $.trim($("#datastys_"+layer_id).text());
    }else{
        navStyle = $.trim($("#"+layer_id).data("datastys_"));
    }

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
            for(key in getlia){
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
    if(cssstyle.length>0){
        cssstyle=""+cssstyle+"";
        cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " ");
        var doms=$('#'+layer_id);
        var oldcssstyle=doms.data('get_layer_hover_css');
        if(oldcssstyle != cssstyle){
            if(jeditMode){
                $("#hover"+layer_id+"").text(""+cssstyle+"");
            }
            doms.data('get_layer_hover_css',cssstyle);
            get_plugin_css('H'+layer_id+'H',cssstyle);
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

function wp_showdefaultHoverCss_product_category(layer_id)
{
    var plugin_name=$("#"+layer_id).attr('type');
    var hover=$("#"+layer_id).find('.nav1').attr('hover');
    if(hover!=1){ return;}

    wp_getdefaultHoverCss(layer_id);
    var n=0;

    if(plugin_name=='new_navigation'){
        var page_id=$("#page_id").val();
        var rootpid=$("#page_id").attr("rpid")*1;
    }else{
        var page_id=$('#'+layer_id+'').find(".default_pid").html();
        if(page_id==0 || page_id.length==0){
            page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');
        }
    }
    $('#nav_'+layer_id+'').children('li').each(function(){
        var type_pid=$(this).attr('pid');
        if(type_pid==page_id){
            $(this).addClass("lihover").children('a').addClass("ahover");
        }else if(type_pid==rootpid){
            $(this).addClass("lihover").children('a').addClass("ahover");
        }
        if(window.location.href == $(this).find("a").attr("href") || window.location.href == $(this).find("a").attr("href")+"&brd=1"){ $(this).addClass("lihover").children('a').addClass("ahover"); }
        n++;
    });
    if(!$('#nav_'+layer_id+'').children('li.lihover').length){
        $('#nav_'+layer_id+' ul').children('li').each(function(){
            var lochref=window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');
            var subahref= $(this).find('a').attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');
            if(lochref == subahref || lochref ==subahref+"&brd=1"){
                $(this).parents(".wp_subtop").addClass("lihover").children('a').addClass("ahover");
                return;
            }
        })
    }

}

function wp_addMoreButton(layer_id){
    var layertype=$('#'+layer_id).attr('type');
    if(layertype && window['wp_addMoreButton_'+layertype]){
        return window['wp_addMoreButton_'+layertype](layer_id);
    }
    return false;
}

function wp_addMoreButton_product_category(layer_id)
{
    var firstLiTop = 0;
    var hasMore = false;
    $('#nav_'+layer_id).children('li.wp_subtop').each(function(i){
        if(i == 0) {firstLiTop = $(this).offset().top;return true;}
        if($(this).offset().top > firstLiTop)
        {
            $('#'+layer_id).data('hasMore','yes');//閰嶇疆閫昏緫鑾峰彇
            var more = $.trim($('#'+layer_id).children('.wp-product_category_content').children('.nav1').attr('more'));
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

            $(this).prev().nextAll().remove();
            objA.next('ul').children('li').removeClass('wp_subtop');
            hasMore = true;

            objA.attr('href','javascript:void(0);');

            //鐐瑰嚮"鏇村"寮瑰嚭鍏ㄧ珯瀵艰埅
            if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
            {
                objA.click(function (e){
                    $('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
                        containerId:'wp-product_category-simplemodal-container_'+layer_id,
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
                    return false;
                });
            }
            return false;
        }
    });
    if(!hasMore) $('#'+layer_id).data('hasMore','no');
    wp_showdefaultHoverCss(layer_id);
}

//缂栬緫妯″紡姘村钩鎷栧姩鍔ㄦ€佸埛鏂颁慨鏀筂ore鎸夐挳
function wp_updateMoreButton(layer_id)
{
    var $layer = $('#'+layer_id);
    var $nav1 = $layer.children('.wp-product_category_content').children('.nav1');
    var tmp_css = $.trim($("#datastys_"+layer_id).text());
    var tmp_cssa = $.trim($("#datasty_"+layer_id).text());
    $.post(parseToURL("product_category","refreshNavigator",{menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-product_category_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor'))}),function(data){
        $layer.find('.wp-product_category_content').html(data);
        $("#datastys_"+layer_id).text(tmp_css);

        var setcss=$("#page_set_css").html();
        setcss=setcss.replace(/<style>/i,'').replace(/<\/style>/i,'');
        var reg=new RegExp("(.*)([/][/*]"+layer_id+"[/*][/])(.*)([/][/*]"+layer_id+"[/*][/])(.*)","gmi");
        var url=setcss;
        var rep=url.replace(reg,"$1 $5");
        var tempcss=rep + " /*"+ layer_id +"*/ "+tmp_cssa+" "+tmp_css+" /*"+ layer_id +"*/ ";
        tempcss = tempcss.replace(/[\r\n]/g, " ").replace(/\s+/g, " ");
        $("#page_set_css").html('<style> '+tempcss+ '</style>');
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
(function(){
    var fillcolor='#198ede';
    var strcolor='#666';
    var nw=150;
    var nh=100;
    var c;
    var cxt;
    var linepx=10;  //榛樿杈规
    var shape_params;

    var zw=nw-(linepx/2); //鍑忓幓杈规鍚庡搴�
    var zh=nh-(linepx/2); //鍑忓幓杈规鍚庨珮搴�
    var zx=linepx/2; //鍑忓幓杈规椤剁偣浣嶇疆

    var Shapes={}

    /*鐭╁舰--*/
    Shapes['rectan']=function() {
        cxt.save();
        cxt.beginPath();
        console.log(linepx);
        if(fillcolor!='transparent') cxt.fillStyle=fillcolor;
        cxt.strokeStyle=strcolor;
        if(linepx!=0)  cxt.lineWidth = linepx;  //杈规澶у皬
        if(fillcolor!='transparent')  cxt.fillRect(zx,zx,zw*2,zh*2);
        if(linepx!=0)  cxt.strokeRect(zx,zx,zw*2,zh*2);
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0)  cxt.stroke();
    }

    /*鍦嗗舰--*/
    Shapes['circle']=function() {
        cxt.save();
        var r = (zw > zh) ? zw : zh;
        var ratioX = zw / r;
        var ratioY = zh / r;
        cxt.translate(zx, zx);
        cxt.scale(ratioX, ratioY);
        cxt.beginPath();
        cxt.arc(zw/ratioX, zh/ratioY, r, 0, 2 * Math.PI, true);
        cxt.closePath();
        cxt.restore();

        if(fillcolor!='transparent') cxt.fillStyle=fillcolor;
        cxt.strokeStyle=strcolor;
        if(linepx!=0)  cxt.lineWidth = linepx;  //杈规澶у皬
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0)  cxt.stroke();
    }

    /*浜旇鏄�*/
    Shapes['pentagram']=function(){
        cxt.save();
        var r = (zw > zh) ? zh : zw;
        //r=r;
        cxt.translate(0, zx);
        cxt.beginPath();
        //璁剧疆鏄釜椤剁偣鐨勫潗鏍囷紝鏍规嵁椤剁偣鍒跺畾璺緞
        for (var i = 0; i < 5; i++) {
            cxt.lineTo(Math.cos((18+i*72)/180*Math.PI)*r+r+zx,
                -Math.sin((18+i*72)/180*Math.PI)*r+r+zx);
            cxt.lineTo(Math.cos((54+i*72)/180*Math.PI)*(r/2)+r+zx,
                -Math.sin((54+i*72)/180*Math.PI)*(r/2)+r+zx);
        }
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth =linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
        cxt.restore();//杩斿洖鍘熷鐘舵€�
    }

    /*涓夎褰�--*/
    Shapes['triangle']=function(){
        cxt.save();
        cxt.beginPath();

        cxt.moveTo(zx*2, zh*2+zx);
        cxt.lineTo(zw+zx, zx*2);
        cxt.lineTo(zw*2,zh*2+zx);
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth =linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
    }

    /*骞宠鍥涜竟褰�--*/
    Shapes['parallelo']=function(){
        cxt.save();
        cxt.beginPath();
        cxt.moveTo(zx*2, zh*2+zx);
        cxt.lineTo(zw*1.4, zh*2+zx);
        cxt.lineTo(zw*2, zx);
        cxt.lineTo(zw*0.6+linepx, zx);
        cxt.lineTo(zx*2, zh*2+zx);
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth =linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
    }

    /*姊舰--*/
    Shapes['trapezium']=function() {
        cxt.save();
        cxt.beginPath();
        cxt.moveTo(zx*2, zh*2+zx);
        cxt.lineTo(zw*2, zh*2+zx);
        cxt.lineTo(zw*1.5+zx, zx);
        cxt.lineTo(zw*0.5+zx, zx);
        cxt.lineTo(zx*2, zh*2+zx);
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth =linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
    }

    /*鎻愮ず妗嗗舰__宸�*/
    Shapes['roundtip_left']=function(){
        var radius=parseInt(zw)*0.075; //鍦嗚澶у皬
        if(radius<12){
            radius=12;
        } //鍦嗚鏈€灏忓€�

        var rjh= zh*0.75;
        cxt.beginPath();
        cxt.arc( radius+zx, radius+zx, radius, Math.PI, Math.PI * 3 / 2);
        cxt.lineTo(zw*2+zx - radius , zx);
        cxt.arc(zw*2+zx - radius , radius +zx, radius, Math.PI * 3 / 2, Math.PI * 2);
        cxt.lineTo(zw*2+zx , rjh*2  - radius);
        cxt.arc(zw*2+zx - radius , rjh*2 - radius , radius, 0, Math.PI * 1 / 2);
        cxt.lineTo(radius*2.2+zx , rjh*2);    //宸︿笅绠ご
        cxt.lineTo(radius*0.9 +zx, rjh*2+radius);  //宸︿笅绠ご*/

        cxt.arc(radius+zx , rjh*2- radius , radius, Math.PI * 1 / 2, Math.PI);
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth = linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
        cxt.restore();//杩斿洖鍘熷鐘舵€�

    }

    /*鎻愮ず妗嗗舰__鍙�*/
    Shapes['roundtip_right']=function() {
        var radius=parseInt(zw)*0.075; //鍦嗚澶у皬
        if(radius<12){
            radius=12;
        } //鍦嗚鏈€灏忓€�

        var rjh= zh*0.75;
        cxt.beginPath();
        cxt.arc( radius+zx, radius+zx, radius, Math.PI, Math.PI * 3 / 2);
        cxt.lineTo(zw*2+zx - radius , zx);
        cxt.arc(zw*2+zx - radius , radius +zx, radius, Math.PI * 3 / 2, Math.PI * 2);
        cxt.lineTo(zw*2+zx , rjh*2  - radius);
        cxt.arc(zw*2+zx - radius , rjh*2 - radius , radius, 0, Math.PI * 1 / 2);
        cxt.lineTo(zw*2+zx-radius*0.9 , rjh*2+radius);  //鍙充笅绠ご
        cxt.lineTo(zw*2+zx-radius*2.2 , rjh*2);  //鍙充笅绠ご

        cxt.arc(radius+zx , rjh*2- radius , radius, Math.PI * 1 / 2, Math.PI);
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth = linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
        cxt.restore();//杩斿洖鍘熷鐘舵€�
    }


    /*绠ご--*/
    Shapes['arrow']=function() {
        cxt.save();
        cxt.beginPath();

        cxt.moveTo(zx, zh*0.65+zx);
        cxt.lineTo(zx, zh*1.35+zx);
        cxt.lineTo(zw*1.04, zh*1.35+zx);
        cxt.lineTo(zw*1.04, zh*2);
        cxt.lineTo(zw*2,zh+zx);
        cxt.lineTo(zw*1.04, zx*2);
        cxt.lineTo(zw*1.04,zh*0.65+zx);
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth =linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
    }

    /*閽荤煶褰�--*/
    Shapes['diamond']=function() {
        cxt.save();
        cxt.beginPath();

        cxt.moveTo(zx*2, zh*0.9);
        cxt.lineTo(zw+zx, zh*2);
        cxt.lineTo(zw*2, zh*0.9);
        cxt.lineTo(zw*1.55+zx,zh*0.38);
        cxt.lineTo(zw*0.45+zx,zh*0.38);
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth =linepx;
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();

    }

    /*姝ｅ杈瑰舰*/
    Shapes['isogon']=function(){
        var ib=5;
        if(shape_params.ib>2) ib=shape_params.ib;
        var i,ang;
        var dzw=zw+zx*1.8-linepx;
        var dzh=zh+zx*1.8-linepx;
        var r = (dzw > dzh) ? dzh : dzw;
//			 ib = $('.inputvalue').val();
        ang = Math.PI*2/ib;  //鏃嬭浆鐨勮搴�
        cxt.save();//淇濆瓨鐘舵€�
        cxt.translate(nw, nh);//鍘熺偣绉诲埌x,y澶勶紝鍗宠鐢荤殑澶氳竟褰腑蹇�
        cxt.moveTo(0, -r);//鎹腑蹇價璺濈澶勭敾鐐�
        cxt.beginPath();
        for(i = 0;i < ib; i ++)
        {
            cxt.rotate(ang)//鏃嬭浆
            cxt.lineTo(0, -r);//鎹腑蹇價璺濈澶勮繛绾�
        }
        cxt.closePath();
        if(fillcolor!='transparent') cxt.fillStyle = fillcolor;
        if(strcolor!='transparent') cxt.strokeStyle = strcolor;
        if(linepx!=0) cxt.lineWidth = linepx;//璁剧疆绾垮
        if(fillcolor!='transparent')  cxt.fill();
        if(linepx!=0 && strcolor!='transparent') cxt.stroke();
        cxt.restore();//杩斿洖鍘熷鐘舵€�
    }



    function ClearCanvas(){
        cxt.clearRect(0, 0, nw*2, nh*2);
    }


    function layer_shapes_draw_func(params){
        var layerid=params.layerid;
        var shapetype=params.shape_type;
        var canvasel=$('#'+layerid).find('canvas');
        var w=$('#'+layerid).find('.wp-shapes_content').width();
        var h=$('#'+layerid).find('.wp-shapes_content').height();
        canvasel.attr('width',w);
        canvasel.attr('height',h);
        if(params.fillcolor) fillcolor=params.fillcolor;
        if(params.strcolor) strcolor=params.strcolor;
        if(params.borderline != null) linepx=parseInt(params.borderline);
        shape_params=params;

        c = canvasel[0];
        cxt = c.getContext("2d");
        nw=parseInt(w/2);
        nh=parseInt(h/2);

        zw=nw-parseInt(linepx/2); //鍑忓幓杈规鍚庡搴�
        zh=nh-parseInt(linepx/2); //鍑忓幓杈规鍚庨珮搴�
        zx=parseInt(linepx/2); //鍑忓幓杈规椤剁偣浣嶇疆
        ClearCanvas();
        if(Shapes[shapetype]) Shapes[shapetype]();
    }
    window.layer_shapes_draw_func=layer_shapes_draw_func;

})();
