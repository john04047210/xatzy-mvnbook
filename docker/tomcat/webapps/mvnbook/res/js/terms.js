/**
 * Created by qiaopeng on 16-6-25.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#terms_dg').datagrid('resize');
    });
    searchtermsAll();
});

// 检索学期库信息
function searchtermsAll(){
    var url = 'async/table/getterms.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('terms_dg', url, queryParams, 'GET');
}

// 检索学期库信息
function searchterms(value,name){
    var bool = $('#termsSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var terms_code = '';
    var terms_text = '';
    if('terms_code' == name) {
        terms_code = value;
    }
    if('terms_text' == name) {
        terms_text = value;
    }
    var url = 'async/table/getterms.cc';
    var queryParams = {'code':terms_code,'value':terms_text};
    loadDataGrid_data('terms_dg', url, queryParams, 'POST');
}

function editterms(type) {
    var rows = $('#terms_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delTermsDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptTermsDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addTermsDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增学期信息对话框
function addTermsDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增学期信息',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addtermsdlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addtermsdlg').form('enableValidation').form('validate');
                if(bool) {
                    addTermsServ($('#terms_code').val(), $('#terms_text').val());
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

// 新增学期信息逻辑(服务器交互)
function addTermsServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addterms.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchtermsAll();
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
                $.messager.alert('错误','新增系信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 变更学期信息对话框
function uptTermsDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更学期名称',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addtermsdlg.html',
        modal: true,
        onLoad:function(){
            $('#terms_code').textbox('readonly',true);
            $('#terms_code').textbox('setValue',code);
            $('#terms_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addtermsdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptTermsServ($('#terms_code').val(), $('#terms_text').val());
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

// 变更学期信息逻辑(服务器交互)
function uptTermsServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptterms.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchtermsAll();
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
                $.messager.alert('错误','变更系信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 删除学期信息对话框
function delTermsDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delTermsServ(code, value);
        }
    });
}

// 删除学期信息逻辑(服务器交互)
function delTermsServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delterms.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchtermsAll();
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
