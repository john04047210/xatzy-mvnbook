/**
 * Created by qiaopeng on 16-6-22.
 */
$(function(){
    $(window).resize(function(){
        $('#recommend_dg').datagrid('resize');
    });
    searchrecommendAll();
});

// 检索评价类别库信息
function searchrecommendAll(){
    var url = 'async/table/getrecommend.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('recommend_dg', url, queryParams, 'GET');
}

// 检索评价类别库信息
function searchrecommend(value,name){
    var bool = $('#recommendSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var recommend_code = '';
    var recommend_text = '';
    if('recommend_code' == name) {
        recommend_code = value;
    }
    if('recommend_text' == name) {
        recommend_text = value;
    }
    var url = 'async/table/getrecommend.cc';
    var queryParams = {'code':recommend_code,'value':recommend_text};
    loadDataGrid_data('recommend_dg', url, queryParams, 'POST');
}

function editrecommend(type) {
    var rows = $('#recommend_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delRecommendDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptRecommendDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addRecommendDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增评价类别信息对话框
function addRecommendDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增评价类别',
        width: 270,
        height: 140,
        closed: false,
        cache: false,
        href: 'table/addrecommenddlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addrecommenddlg').form('enableValidation').form('validate');
                if(bool) {
                    addRecommendServ($('#recommend_code').val(), $('#recommend_text').val());
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

// 新增评价类别信息逻辑(服务器交互)
function addRecommendServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addrecommend.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchrecommendAll();
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

// 变更评价类别信息对话框
function uptRecommendDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更评价类别',
        width: 270,
        height: 140,
        closed: false,
        cache: false,
        href: 'table/addrecommenddlg.html',
        modal: true,
        onLoad:function(){
            $('#recommend_code').textbox('readonly',true);
            $('#recommend_code').textbox('setValue',code);
            $('#recommend_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addrecommenddlg').form('enableValidation').form('validate');
                if(bool) {
                    uptRecommendServ($('#recommend_code').val(), $('#recommend_text').val());
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

// 变更评价类别信息逻辑(服务器交互)
function uptRecommendServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptrecommend.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchrecommendAll();
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

// 删除评价类别信息对话框
function delRecommendDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delRecommendServ(code, value);
        }
    });
}

// 删除评价类别信息逻辑(服务器交互)
function delRecommendServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delrecommend.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchrecommendAll();
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

