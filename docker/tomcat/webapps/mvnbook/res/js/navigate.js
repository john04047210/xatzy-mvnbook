/**
 * Created by qiaopeng on 16-7-4.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#navigate_dg').treegrid('resize');
    });
    searchnavigateAll();
});

// 检索导航栏库信息
function searchnavigateAll(){
    var url = 'async/nav/getnavigate.cc';
    var queryParams = {'code':'','value':''};
    loadTreeGrid_data('navigate_dg', url, queryParams, 'GET');
}

function editnavigate(type) {
    var rows = $('#navigate_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delNavigateDlg(row.treeId,row.text);
            } else if(1 == type) {
                // 更新
                uptNavigateDlg(row);
            }
        }
    } else if(2 == type) {
        // 新增
        addNavigateDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增导航栏信息对话框
function addNavigateDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增导航栏信息',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'sysrole/addnavigatedlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addnavigatedlg').form('enableValidation').form('validate');
                if(bool) {
                    addNavigateServ();
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

// 新增导航栏信息逻辑(服务器交互)
function addNavigateServ() {
    var msg = '';

    $.ajax({
        url:'async/nav/addnavigate.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'treeid':$('#treeid').val(),'text':$('#text').val(),'state':$('#state').val(),'checked':$('#checked').val(),'iconCls':$('#iconCls').val(),'attr_level':$('#attr_level').combobox('getValue'),'attr_isleaf':$('#attr_isleaf').combobox('getValue'),'attr_parents':$('#attr_parents').val(),'attr_url':$('#attr_url').val(),'power':$('#userpower').combobox('getValue')},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + $('#treeid').val() + '<br/>名称：' + $('#text').val();
                searchnavigateAll();
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

// 变更导航栏信息对话框
function uptNavigateDlg(row) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更导航栏名称',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'sysrole/addnavigatedlg.html',
        modal: true,
        onLoad:function(){
            $('#treeid').textbox('readonly',true);
            $('#treeid').textbox('setValue',row.treeId);
            $('#text').textbox('setValue',row.text);
            $('#state').textbox('setValue',row.state);
            $('#checked').textbox('setValue',row.checked);
            $('#iconCls').textbox('setValue',row.iconCls);
            $('#attr_parents').textbox('setValue',0==row.attr_parents?'0':row.attr_parents);
            $('#attr_url').textbox('setValue',row.attr_url);
            $('#attr_level').combobox('select',row.attr_level);
            $('#attr_isleaf').combobox('select',row.attr_isleaf);
            $('#userpower').combobox('select',row.powercd);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addnavigatedlg').form('enableValidation').form('validate');
                if(bool) {
                    uptNavigateServ();
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

// 变更导航栏信息逻辑(服务器交互)
function uptNavigateServ() {
    var msg = '';

    $.ajax({
        url:'async/nav/uptnavigate.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'treeid':$('#treeid').val(),'text':$('#text').val(),'state':$('#state').val(),'checked':$('#checked').val(),'iconCls':$('#iconCls').val(),'attr_level':$('#attr_level').combobox('getValue'),'attr_isleaf':$('#attr_isleaf').combobox('getValue'),'attr_parents':$('#attr_parents').val(),'attr_url':$('#attr_url').val(),'power':$('#userpower').combobox('getValue'),'isshow':$('#isshow').val()},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + $('#treeid').val() + '<br/>名称：' + $('#text').val();
                searchnavigateAll();
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

// 删除导航栏信息对话框
function delNavigateDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delNavigateServ(code, value);
        }
    });
}

// 删除导航栏信息逻辑(服务器交互)
function delNavigateServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/nav/delnavigate.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'treeid':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchnavigateAll();
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