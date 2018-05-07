/**
 * Created by qiaopeng on 16-6-22.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#pubhouse_dg').datagrid('resize');
    });
    searchpubhouseAll();
});

// 检索出版社库信息
function searchpubhouseAll(){
    var url = 'async/table/getpubhouse.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('pubhouse_dg', url, queryParams, 'GET');
}

// 检索出版社库信息
function searchpubhouse(value,name){
    var bool = $('#pubhouseSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var pubhouse_code = '';
    var pubhouse_text = '';
    if('pubhouse_code' == name) {
        pubhouse_code = value;
    }
    if('pubhouse_text' == name) {
        pubhouse_text = value;
    }
    var url = 'async/table/getpubhouse.cc';
    var queryParams = {'code':pubhouse_code,'value':pubhouse_text};
    loadDataGrid_data('pubhouse_dg', url, queryParams, 'POST');
}

function editpubhouse(type) {
    var rows = $('#pubhouse_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delPubhouseDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptPubhouseDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addPubhouseDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增出版社信息对话框
function addPubhouseDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增出版社',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addpubhousedlg.html',
        modal: true,
        onLoad:function(){
            // 自动请求出版社CD
            getPubHouseCD_Next();
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addpubhousedlg').form('enableValidation').form('validate');
                if(bool) {
                    addPubhouseServ($('#pubhouse_code').val(), $('#pubhouse_text').val());
                }
                return bool;
            }
        },{
            text:'Cancle',
            handler:function(){
                $('#dlgPopup').dialog('close');
            }
        }]
    });
}

// 新增出版社信息逻辑(服务器交互)
function addPubhouseServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addpubhouse.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchpubhouseAll();
                $.messager.alert('提示',msg,'info',function(){$('#dlgPopup').dialog('close');});
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else if(406 == resp.code) {
                // 操作安全码校验失败
                $.messager.alert('错误',resp.msg,'error',function(){$('#dlgPopup').dialog('close');});
            } else if(412 <= resp.code) {
                // 验证码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else {
                $.messager.alert('错误','新增信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 变更出版社信息对话框
function uptPubhouseDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更出版社',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addpubhousedlg.html',
        modal: true,
        onLoad:function(){
            $('#pubhouse_code').textbox('readonly',true);
            $('#pubhouse_code').textbox('setValue',code);
            $('#pubhouse_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addpubhousedlg').form('enableValidation').form('validate');
                if(bool) {
                    uptPubhouseServ($('#pubhouse_code').val(), $('#pubhouse_text').val());
                }
                return bool;
            }
        },{
            text:'Cancle',
            handler:function(){
                $('#dlgPopup').dialog('close');
            }
        }]
    });
}

// 变更出版社信息逻辑(服务器交互)
function uptPubhouseServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptpubhouse.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchpubhouseAll();
                $.messager.alert('提示',msg,'info',function(){$('#dlgPopup').dialog('close');});
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else if(406 == resp.code) {
                // 操作安全码校验失败
                $.messager.alert('错误',resp.msg,'error',function(){$('#dlgPopup').dialog('close');});
            } else if(412 <= resp.code) {
                // 验证码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else {
                $.messager.alert('错误','变更信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 删除出版社信息对话框
function delPubhouseDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delPubhouseServ(code, value);
        }
    });
}

// 删除出版社信息逻辑(服务器交互)
function delPubhouseServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delpubhouse.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchpubhouseAll();
                $.messager.alert('提示',msg,'info',function(){$('#dlgPopup').dialog('close');});
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else if(406 == resp.code) {
                // 操作安全码校验失败
                $.messager.alert('错误',resp.msg,'error',function(){$('#dlgPopup').dialog('close');});
            } else if(412 <= resp.code) {
                // 验证码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else {
                $.messager.alert('错误','删除信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 获取下一个出版社CD
function getPubHouseCD_Next() {
    $.ajax({
        url:'async/table/getpubhousecd_next.cc',
        type:'GET',
        async:true,
        dataType:'json',
        success:function(resp){
            if(200 == resp.code) {
                $('#pubhouse_code').textbox('setValue',resp.data);
            } else {
                $.messager.alert('错误','获取出版社CD失败','error');
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误..','error');
        }
    });
}
