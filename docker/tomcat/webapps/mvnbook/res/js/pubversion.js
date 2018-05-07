/**
 * Created by qiaopeng on 16-6-21.
 */
/**
 * Created by qiaopeng on 16-6-20.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#pubversion_dg').datagrid('resize');
    });
    searchpubversionAll();
});

// 检索版本库信息
function searchpubversionAll(){
    var url = 'async/table/getpubversion.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('pubversion_dg', url, queryParams, 'GET');
}

// 检索版本库信息
function searchpubversion(value,name){
    var bool = $('#pubversionSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var pubver_code = '';
    var pubver_text = '';
    if('pubver_code' == name) {
        pubver_code = value;
    }
    if('pubver_text' == name) {
        pubver_text = value;
    }
    var url = 'async/table/getpubversion.cc';
    var queryParams = {'code':pubver_code,'value':pubver_text};
    loadDataGrid_data('pubversion_dg', url, queryParams, 'POST');
}

function editpubversion(type) {
    var rows = $('#pubversion_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delPubversionDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptPubversionDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addPubversionDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增版本信息对话框
function addPubversionDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增版本',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addpubversiondlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addpubversiondlg').form('enableValidation').form('validate');
                if(bool) {
                    addPubversionServ($('#pubver_code').val(), $('#pubver_text').val());
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

// 新增版本信息逻辑(服务器交互)
function addPubversionServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addpubversion.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchpubversionAll();
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

// 变更版本信息对话框
function uptPubversionDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更版本',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addpubversiondlg.html',
        modal: true,
        onLoad:function(){
            $('#pubver_code').textbox('readonly',true);
            $('#pubver_code').textbox('setValue',code);
            $('#pubver_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addpubversiondlg').form('enableValidation').form('validate');
                if(bool) {
                    uptPubversionServ($('#pubver_code').val(), $('#pubver_text').val());
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

// 变更版本信息逻辑(服务器交互)
function uptPubversionServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptpubversion.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchpubversionAll();
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

// 删除版本信息对话框
function delPubversionDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delPubversionServ(code, value);
        }
    });
}

// 删除版本信息逻辑(服务器交互)
function delPubversionServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delpubversion.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchpubversionAll();
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