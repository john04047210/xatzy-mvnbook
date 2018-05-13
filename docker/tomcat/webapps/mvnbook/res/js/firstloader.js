$(function() {
    $(window).resize(function(){
        $('#head').panel('resize');
    });
    
    // 获取页面头部信息
    getHead();
    // 初始化导航栏点击事件
    InitNav();
});

function getHead() {
    $('#head').panel({
        href:'ssmp/head.html',
        onLoad:function(){
            $.ajax({
                url:'async/ssmp/checklogin.cc',
                type:'GET',
                async:true,
                dataType:'json',
                success:function(resp){
                    if(200 == resp.code) {
                        var uname = resp.data.uname;
                        if("" == uname) {
                            uname = resp.data.nickname;
                        }
                        $('#uname').empty();
                        $('#uname').html(uname);
                    } else {
                        $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href='/mvnbook/login.html';});
                    }
                },
                error:function(err){
                    $.messager.alert('错误','服务器错误','error',function(){window.location.href='/mvnbook/login.html';});
                }
            });
        }
    });
}

function InitNav() {
    var navData = getNavData();
    $("#side-menu").tree({
        animate:false,
        data: navData,
        lines:true,
        onClick: function(node){
            if(1 == node.attributes.isleaf) {
                addTab(node.text, node.attributes.url);
            } else {
                // 展开 折叠
                $(this).tree('toggle', node.target);
            }
        }
    });
}

function getNavData() {
    var navData = [];
    $.ajax({
        url:'async/nav/navigate.cc',
        type:'GET',
        async:false,
        dataType:'json',
        success:function(resp){
            navData = resp;
        },
        error:function(err){
            $.messager.alert('错误','导航栏加载失败','error');
        }
    });
    return navData;
}

function addTab(title, url){
    if ($('#tabs').tabs('exists', title)){
        $('#tabs').tabs('select', title);
    } else {
        if('' != url) {
            $.get(url, function(resp){
                $('#tabs').tabs('add',{
                    title:title,
                    content:resp,
                    closable:true
                });
            });
        }
    }
}

function loginout(){
    $.ajax({
        url:'async/ssmp/loginout.cc',
        type:'GET',
        async:true,
        dataType:'json',
        success:function(resp){
            window.location.href='/mvnbook/login.html';
        },
        error:function(err){
            window.location.href='/mvnbook/login.html';
        }
    });
}

function checkPhone(phone){
    var bool = false;
    bool = /^1[3|4|5|7|8][0-9]\d{4,8}$/.test(phone);
    return bool;
}

function randomNum(len) {
    len = len || 32;
    var $chars = '0123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function randomStr(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function Percentage(num, total) { 
    return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
}

// 保留指定位数的小数
function xround(x, num){
    Math.round(x * Math.pow(10, num)) / Math.pow(10, num) ;
}

String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
}

// 获取验证码
function getValidCode() {
    phone = $('#inputnewphone').val();
    bool = checkPhone(phone);
    if(bool) {
        $.ajax({
            url:'async/uac/getvalidcode.cc',
            type:'GET',
            async:true,
            dataType:'json',
            data:{'phone':phone},
            success:function(resp){
                if(200 == resp.code) {
                    $('#inputvalidcode').textbox('setValue',resp.data);
                } else {
                    $.messager.alert('错误','获取验证码失败','error');
                }
            },
            error:function(err){
                $.messager.alert('错误','服务器错误..','error');
            }
        });
    } else {
        $.messager.alert('错误','请输入合法手机号','error',function(){$('#inputnewphone').focus();});
    }
}

// 获取操作安全码
function getSecuCode() {
    $.ajax({
        url:'async/uac/getsecucode.cc',
        type:'GET',
        async:true,
        dataType:'json',
        success:function(resp){
            if(200 != resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href='/mvnbook/login.html';});
            } else {
                // 短信发送条数限制，增加安全码自动填写功能
                $('#inputSecuCode').textbox('setValue',resp.data);
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
}

// datagrid导出文件
function saveFile(datagrid_id){
    var data = $(datagrid_id).datagrid('getData');
    Downloadify.create('downloadify',{
        filename: function(){
            fpname = $('#filename').val();
            if(!fpname.endsWith('.csv')) {
                fpname += '.csv';
            }
            return fpname;
        },
        data: function(){
            var data = $(datagrid_id).datagrid('getData');
            var field = $(datagrid_id).datagrid('getColumnFields');
            var option = $(datagrid_id).datagrid('getColumnOption',field[0]);
            var title = new Array();
            var title_len = 0;
            var body = '';
            for (j=0; j<field.length;) {
                option = $(datagrid_id).datagrid('getColumnOption',field[j]);
                if(!option.hidden) {
                    title[title_len] = option.field;
                    body = body + option.title + ',';
                    title_len = title_len + 1;
                }
                j++;
            }
            body = body + '\n';
            for(idx=0;idx<data.total;) {
                for (t = 0; t < title.length;) {
                    val = data.rows[idx][title[t]];
                    if("undefined"==typeof(val)) {
                        val = '';
                    }
                    body = body + '"' + val + '",';
                    t++;
                }
                body = body + '\n';
                idx++;
            }
            return "\ufeff"+body;
        },
        onComplete: function(){
            msg = '文件导出成功<br/>csv文件如果要用excel打开<br/>一定要先处理文件编码格式<br/>否则会乱码';
            $.messager.alert('提示','文件导出成功','info',function(){$('#dlgPopup').dialog('close');});
        },
        onCancel: function(){
            $.messager.alert('提示','取消操作','info',function(){$('#dlgPopup').dialog('close');});
        },
        onError: function(){
            $.messager.alert('提示','文件导出失败','info',function(){$('#dlgPopup').dialog('close');});
        },
        transparent: false,
        swf: 'res/media/downloadify.swf',
        downloadImage: 'res/themes/images/download.png',
        width: 80,
        height: 30,
        transparent: true,
        append: false
    });
	
	// 改变按钮默认样式(http://stackoverflow.com/questions/21425232/change-the-button-of-downloadify-example-script)
	/*var exportButton = $( "#ExportButton" );

	var exportButtonWidth = exportButton.outerWidth();
	var exportButtonHeight = exportButton.outerHeight();

	var flashObject = $( '[name^="downloadify"]' );

	// Set the Flash object to the same size as my button
	flashObject.css( { width: exportButtonWidth, height: exportButtonHeight } );

	var exportButtonPosition = flashObject.position();

	// Set my button directly underneath the Flash object
	exportButton.css( { top: exportButtonPosition.top, left: exportButtonPosition.left, position: 'absolute', 'z-index': -1 } );*/
}
