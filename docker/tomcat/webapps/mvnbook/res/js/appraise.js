/**
 * Created by qiaopeng on 16-6-29.
 */
$(function(){
    $(window).resize(function(){
        $('#addAppraise').panel('resize');
    });
    addAppraiseDlg();
});

// 新增评价信息对话框
function addAppraiseDlg() {
    $('#addAppraise').empty();
    $('#addAppraise').panel({
        title: '新增评价',
        cache: false,
        href: 'table/addappraisedlg.html',
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
        tools:[{
            iconCls:'icon-add',
            handler:function(){
                bool = $('#addAppraiseForm').form('enableValidation').form('validate');
                if(bool) {
                    addAppraiseServ();
                }
                return bool;
            }
        },{
            iconCls:'icon-clear',
            handler:function(){
                $('#addAppraiseForm').form('clear');
            }
        }]
    });
}

// 新增评价信息逻辑(服务器交互)
function addAppraiseServ() {
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
