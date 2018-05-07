/**
 * Created by qiaopeng on 16-6-24.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#lesson_dg').datagrid('resize');
    });
    searchlessonAll();
});

// 检索课程库信息
function searchlessonAll(){
    var url = 'async/table/getlesson.cc';
    var queryParams = {'code':'','value':''};
    loadDataGrid_data('lesson_dg', url, queryParams, 'GET');
}

// 检索课程库信息
function searchlesson(value,name){
    var bool = $('#lessonSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var lesson_code = '';
    var lesson_text = '';
    if('lesson_code' == name) {
        lesson_code = value;
    }
    if('lesson_text' == name) {
        lesson_text = value;
    }
    var url = 'async/table/getlesson.cc';
    var queryParams = {'code':lesson_code,'value':lesson_text};
    loadDataGrid_data('lesson_dg', url, queryParams, 'POST');
}

function editlesson(type) {
    var rows = $('#lesson_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delLessonDlg(row.code,row.value);
            } else if(1 == type) {
                // 更新
                uptLessonDlg(row.code,row.value);
            }
        }
    } else if(2 == type) {
        // 新增
        addLessonDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增课程信息对话框
function addLessonDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增课程信息',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addlessondlg.html',
        modal: true,
        onLoad:function(){
            // 自动请求课程CD
            getLessonCD_Next();
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addlessondlg').form('enableValidation').form('validate');
                if(bool) {
                    addLessonServ($('#lesson_code').val(), $('#lesson_text').val());
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

// 新增课程信息逻辑(服务器交互)
function addLessonServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/addlesson.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchlessonAll();
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

// 变更课程信息对话框
function uptLessonDlg(code, value) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '变更课程名称',
        width: 526,
        height: 320,
        closed: false,
        cache: false,
        href: 'table/addlessondlg.html',
        modal: true,
        onLoad:function(){
            $('#lesson_code').textbox('readonly',true);
            $('#lesson_code').textbox('setValue',code);
            $('#lesson_text').textbox('setValue',value);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addlessondlg').form('enableValidation').form('validate');
                if(bool) {
                    uptLessonServ($('#lesson_code').val(), $('#lesson_text').val());
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

// 变更课程信息逻辑(服务器交互)
function uptLessonServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/uptlesson.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code,'value':value},
        success:function(resp){
            if(200 == resp.code) {
                msg = '变更信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchlessonAll();
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

// 删除课程信息对话框
function delLessonDlg(code, value) {
    $.messager.confirm('确认','确定要删除此信息[' + code + ':' + value + ']...',function(r){
        if(r) {
            delLessonServ(code, value);
        }
    });
}

// 删除课程信息逻辑(服务器交互)
function delLessonServ(code, value) {
    var msg = '';

    $.ajax({
        url:'async/table/dellesson.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'code':code},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除信息成功<br/>编号: ' + code + '<br/>名称：' + value;
                searchlessonAll();
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

// 获取下一个课程CD
function getLessonCD_Next() {
    $.ajax({
        url:'async/table/getlessoncd_next.cc',
        type:'GET',
        async:true,
        dataType:'json',
        success:function(resp){
            if(200 == resp.code) {
                $('#lesson_code').textbox('setValue',resp.data);
            } else {
                $.messager.alert('错误','获取课程CD失败','error');
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误..','error');
        }
    });
}

