/**
 * Created by qiaopeng on 16-6-25.
 */
$(function(){
    $(window).resize(function(){
        $('#staffroom_dg').datagrid('resize');
    });
    searchstaffroomAll();
});

// 检索教研室库信息
function searchstaffroomAll(){
    var url = 'async/table/getstaffroom.cc';
    var queryParams = {'code':'','dcode':'','value':''};
    loadDataGrid_data('staffroom_dg', url, queryParams, 'GET');
}

// 检索教研室库信息
function searchstaffroom(value,name){
    var bool = $('#staffroomSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var staffroom_code = '';
    var staffroom_dcode = '';
    var staffroom_text = '';
    if('staffroom_code' == name) {
        staffroom_code = value;
    }
    if('staffroom_dcode' == name) {
        staffroom_dcode = value;
    }
    if('staffroom_text' == name) {
        staffroom_text = value;
    }
    var url = 'async/table/getstaffroom.cc';
    var queryParams = {'code':staffroom_code,'dcode':staffroom_dcode,'value':staffroom_text};
    loadDataGrid_data('staffroom_dg', url, queryParams, 'POST');
}

function editstaffroom(type) {
    var rows = $('#staffroom_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delStaffroomDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptStaffroomDlg(row.code,row.dcode,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addStaffroomDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增教研室信息对话框
function addStaffroomDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增教研室',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addstaffroomdlg.html',
        modal: true,
        onLoad:function(){
            // 自动请求教研室CD
            $('#staffroom_dcode').combobox({
                onSelect : function(rec) {
                    getStaffroomCD_Next(rec.code);
                }
            });
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addstaffroomdlg').form('enableValidation').form('validate');
                if(bool) {
                    addStaffroomServ($('#staffroom_code').val(), $('#staffroom_dcode').combobox('getValue'), $('#staffroom_text').val());
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

// 新增教研室信息逻辑(服务器交互)
function addStaffroomServ(code, dcode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addstaffroom.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'dcode':dcode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchstaffroomAll();
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

// 变更教研室信息对话框
function uptStaffroomDlg(code, dcode, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更教研室',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addstaffroomdlg.html',
        modal: true,
        onLoad:function(){
            $('#staffroom_dcode').textbox('readonly',true);
            $('#staffroom_code').textbox('setValue',code);
            $('#staffroom_text').textbox('setValue',value);
            $('#staffroom_dcode').combobox('select',dcode);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addstaffroomdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptStaffroomServ($('#staffroom_code').val(), $('#staffroom_dcode').combobox('getValue'), $('#staffroom_text').val());
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

// 变更教研室信息逻辑(服务器交互)
function uptStaffroomServ(code, dcode, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptstaffroom.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'dcode':dcode,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchstaffroomAll();
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

// 删除教研室信息对话框
function delStaffroomDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delStaffroomServ(code, value);
        }
    });
}

// 删除教研室信息逻辑(服务器交互)
function delStaffroomServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/delstaffroom.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchstaffroomAll();
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

// 获取下一个教研室CD
function getStaffroomCD_Next(dcode) {
    $.ajax({
        url:'async/table/getstaffroomcd_next.cc',
        type:'GET',
        async:true,
        dataType:'json',
        data:{'dcode':dcode},
        success:function(resp){
            if(200 == resp.code) {
                $('#staffroom_code').textbox('setValue',resp.data);
            } else {
                $.messager.alert('错误','获取教研室CD失败','error');
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误..','error');
        }
    });
}

