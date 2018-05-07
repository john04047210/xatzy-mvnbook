/**
 * Created by qiaopeng on 16-6-29.
 */
$(function(){
    $(window).resize(function(){
        $('#appraises_dg').datagrid('resize');
    });
});

// 检索评价库信息
function searchappraises(value,name){
    var bool = $('#appraisesSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var ISBN = '';
    if('ISBN' == name) {
        ISBN = value;
    }
    var url = 'async/table/getappraise.cc';
    var queryParams = {'ISBN':ISBN};
    loadDataGrid_data('appraises_dg', url, queryParams, 'POST');
}

function editappraises(type) {
    var rows = $('#appraises_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delAppraisesDlg(row.rid,row.BookTitle,row.BookAuthor);
            } else if(1 == type) {
                // 更新
                uptAppraisesDlg(row);
            }
        }
    } else if(2 == type) {
        // 新增
        addAppraisesDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增评价信息对话框
function addAppraisesDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增评价',
        width: 560,
        height: 650,
        closed: false,
        cache: false,
        href: 'table/addappraisedlg.html',
        modal: true,
        onLoad:function(){
            $('#Faculty').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/specfield.cc?code=&value=&fcode='+rec.code;
                    $('#SpecField').combobox('reload',url);
                }
            });
            $('#SchoolYear').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/class.cc?code=&value=&sycode='+rec.code;
                    $('#Class').combobox('reload',url);
                }
            });
            $('#Department').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/teacher.cc?code=&value=&dcode='+rec.code;
                    $('#Teacher').combobox('reload',url);
                }
            });
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addAppraiseForm').form('enableValidation').form('validate');
                if(bool) {
                    addAppraisesServ();
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

// 新增评价信息逻辑(服务器交互)
function addAppraisesServ() {
    var msg = '';

    $.ajax({
        url:'async/table/addappraise.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'ISBN':$('#ISBN').val(),'BookTitle':$('#BookTitle').val(),'BookAuthor':$('#BookAuthor').val(),'Department':$('#Department').combobox('getValue'),'Faculty':$('#Faculty').combobox('getValue'),'SpecField':$('#SpecField').combobox('getValue'),'Class':$('#Class').combobox('getValue'),'Lesson':$('#Lesson').combobox('getValue'),'Term':$('#Term').combobox('getValue'),'Teacher':$('#Teacher').combobox('getValue'),'TRecommend':$('#TRecommend').combobox('getValue'),'SRecommend':$('#SRecommend').combobox('getValue'),'Tcomments':$('#Tcomments').val(),'Scomments':$('#Scomments').val()},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增评价信息成功<br/>书名: ' + $('#BookTitle').val() + '<br/>作者：' + $('#BookAuthor').val();
                $.messager.alert('提示',msg,'info');
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else if(406 == resp.code) {
                // 操作安全码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else if(412 <= resp.code) {
                // 验证码校验失败
                $.messager.alert('错误',resp.msg,'error');
            } else {
                $.messager.alert('错误','新增书籍信息失败','error');
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error');
        }
    });
    return;
}

// 更新评价信息对话框
function uptAppraisesDlg(row) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '更新评价',
        width: 560,
        height: 650,
        closed: false,
        cache: false,
        href: 'table/addappraisedlg.html',
        modal: true,
        onLoad:function(){
            $('#Faculty').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/specfield.cc?code=&value=&fcode='+rec.code;
                    $('#SpecField').combobox('reload',url);
                }
            });
            $('#SchoolYear').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/class.cc?code=&value=&sycode='+rec.code;
                    $('#Class').combobox('reload',url);
                }
            });
            $('#Department').combobox({
                onSelect : function(rec) {
                    var url = 'async/table/teacher.cc?code=&value=&dcode='+rec.code;
                    $('#Teacher').combobox('reload',url);
                }
            });
            $('#ISBN').textbox('readonly',true);
            $('#BookTitle').textbox('readonly',true);
            $('#BookAuthor').textbox('readonly',true);
            $('#rid').textbox('setValue',row.rid);
            $('#ISBN').textbox('setValue',row.ISBN);
            $('#BookTitle').textbox('setValue',row.BookTitle);
            $('#BookAuthor').textbox('setValue',row.BookAuthor);
            $('#Tcomments').textbox('setValue',row.Tcomments);
            $('#Scomments').textbox('setValue',row.Scomments);
            $('#Department').combobox('select',row.DepartmentCD);
            $('#Faculty').combobox('select',row.FacultyCD);
            $('#SpecField').combobox('select',row.SpecializedFieldCD);
            $('#Class').combobox('select',row.ClassCD);
            $('#Lesson').combobox('select',row.LessonCD);
            $('#Term').combobox('select',row.TermCD);
            $('#Teacher').combobox('select',row.TeacherCD);
            $('#TRecommend').combobox('select',row.TRecommendCD);
            $('#SRecommend').combobox('select',row.SRecommendCD);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addAppraiseForm').form('enableValidation').form('validate');
                if(bool) {
                    uptAppraisesServ();
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

// 更新评价信息逻辑(服务器交互)
function uptAppraisesServ() {
    var msg = '';

    $.ajax({
        url:'async/table/uptappraise.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'rid':$('#rid').val(),'ISBN':$('#ISBN').val(),'BookTitle':$('#BookTitle').val(),'BookAuthor':$('#BookAuthor').val(),'Department':$('#Department').combobox('getValue'),'Faculty':$('#Faculty').combobox('getValue'),'SpecField':$('#SpecField').combobox('getValue'),'Class':$('#Class').combobox('getValue'),'Lesson':$('#Lesson').combobox('getValue'),'Term':$('#Term').combobox('getValue'),'Teacher':$('#Teacher').combobox('getValue'),'TRecommend':$('#TRecommend').combobox('getValue'),'SRecommend':$('#SRecommend').combobox('getValue'),'Tcomments':$('#Tcomments').val(),'Scomments':$('#Scomments').val()},
        success:function(resp){
            if(200 == resp.code) {
                msg = '更新评价信息成功<br/>书名: ' + $('#BookTitle').val() + '<br/>作者：' + $('#BookAuthor').val();
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
                $.messager.alert('错误','新增书籍信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 删除评价信息对话框
function delAppraisesDlg(rid, title, author) {
    $.messager.confirm('确认','确定要删除此信息[' + author + ':' + title + ']...',function(r){
        if(r) {
            delAppraisesServ(rid, title, author);
        }
    });
}

// 删除评价信息逻辑(服务器交互)
function delAppraisesServ(rid, title, author) {
    var msg = '';

    $.ajax({
        url:'async/table/delappraise.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'rid':rid},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除评价信息成功<br/>书名: ' + title + '<br/>作者：' + author;
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
                $.messager.alert('错误','删除评价信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

function searchbook() {
    var isbn = $('#ISBN').val();
    $.ajax({
        url:'async/table/getbooks.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'ISBN':$('#ISBN').val(),'BookTitle':'','BookAuthor':''},
        success:function(resp){
            if(200 == resp.code) {
                $('#BookTitle').textbox('setValue',resp.data[0].BookTitle);
                $('#BookAuthor').textbox('setValue',resp.data[0].BookAuthor);
            } else {
                $.messager.alert('错误','获取出版社CD失败','error');
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误..','error');
        }
    });
}
