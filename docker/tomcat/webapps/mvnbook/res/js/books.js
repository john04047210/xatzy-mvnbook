/**
 * Created by qiaopeng on 16-6-20.
 */
$(function(){
    //$('#books_dg').datagrid({'data':[]}).datagrid('clientPaging');    // 如果使用使用分页功能 此方法初始化分页信息
    $(window).resize(function(){
        $('#books_dg').datagrid('resize');
    });
});

// 检索书籍库信息
function searchbooks(value,name){
    var bool = $('#booksSearcherForm').form('enableValidation').form('validate');
    if(!bool) return bool;
    var ISBN = '';
    var BookTitle = '';
    var BookAuthor = '';
    if('ISBN' == name) {
        ISBN = value;
    }
    if('BookTitle' == name) {
        BookTitle = value;
    }
    if('BookAuthor' == name) {
        BookAuthor = value;
    }
    var url = 'async/table/getbooks.cc';
    var queryParams = {'ISBN':ISBN,'BookTitle':BookTitle,'BookAuthor':BookAuthor};
    loadDataGrid_data('books_dg', url, queryParams, 'POST');
}

function editbooks(type) {
    var rows = $('#books_dg').datagrid('getSelections');
    if(2 != type && rows.length) {
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(0 == type) {
                // 删除
                delBooksDlg(row.ISBN, row.BookAuthor, row.BookTitle);
            } else if(1 == type) {
                // 更新
                uptBooksDlg(row.ISBN, row.PubVersionCD, row.PubHouseCD, row.BookTitle, row.BookAuthor, row.Price);
            }
        }
    } else if(2 == type) {
        // 新增
        addBooksDlg();
    }  else if(3 == type) {
        // Excel导入
        importBooksDlg();
    } else {
        $.messager.alert('提示','请选中要修改的行','info');
    }
}

// 新增书籍信息对话框
function addBooksDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '新增书籍',
        width: 300,
        height: 240,
        closed: false,
        cache: false,
        href: 'table/addbooksdlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addbooksdlg').form('enableValidation').form('validate');
                if(bool) {
                    addBooksServ($('#ISBN').val(), $('#PubVersion').combobox('getValue'), $('#PubHouse').combobox('getValue'), $('#BookTitle').val(), $('#BookAuthor').val(), $('#Price').val());
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

// 新增书籍信息逻辑(服务器交互)
function addBooksServ(isbn, pubverCD, pubhouseCD, title, author, price) {
    var msg = '';

    $.ajax({
        url:'async/table/addbooks.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'isbn':isbn,'title':title,'author':author,'pubver':pubverCD,'pubhouse':pubhouseCD,'price':price},
        success:function(resp){
            if(200 == resp.code) {
                msg = '新增书籍信息成功<br/>书名: ' + title + '<br/>作者：' + author;
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

// 更新书籍信息对话框
function uptBooksDlg(isbn, pubverCD, pubhouseCD, bookTitle, author, price) {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '更新书籍',
        width: 300,
        height: 240,
        closed: false,
        cache: false,
        href: 'table/addbooksdlg.html',
        modal: true,
        onLoad:function(){
            $('#ISBN').textbox('readonly',true);
            $('#ISBN').textbox('setValue',isbn);
            $('#BookTitle').textbox('setValue',bookTitle);
            $('#BookAuthor').textbox('setValue',author);
            $('#Price').textbox('setValue',price);
            $('#PubVersion').combobox('select',pubverCD);
            $('#PubHouse').combobox('select',pubhouseCD);
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addbooksdlg').form('enableValidation').form('validate');
                if(bool) {
                    uptBooksServ($('#ISBN').val(), $('#PubVersion').combobox('getValue'), $('#PubHouse').combobox('getValue'), $('#BookTitle').val(), $('#BookAuthor').val(), $('#Price').val());
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

// 更新书籍信息逻辑(服务器交互)
function uptBooksServ(isbn, pubverCD, pubhouseCD, title, author, price) {
    var msg = '';

    $.ajax({
        url:'async/table/uptbooks.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'isbn':isbn,'title':title,'author':author,'pubver':pubverCD,'pubhouse':pubhouseCD,'price':price},
        success:function(resp){
            if(200 == resp.code) {
                msg = '更新书籍信息成功<br/>书名: ' + title + '<br/>作者：' + author;
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
                $.messager.alert('错误','更新书籍信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 删除书籍信息对话框
function delBooksDlg(isbn, title, author) {
    $.messager.confirm('确认','确定要删除此信息[' + author + ':' + title + ']...',function(r){
        if(r) {
            delBooksServ(isbn, title, author);
        }
    });
}

// 删除书籍信息逻辑(服务器交互)
function delBooksServ(isbn, title, author) {
    var msg = '';

    $.ajax({
        url:'async/table/delbooks.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'isbn':isbn},
        success:function(resp){
            if(200 == resp.code) {
                msg = '删除书籍信息成功<br/>书名: ' + title + '<br/>作者：' + author;
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
                $.messager.alert('错误','删除书籍信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}

// 导入书籍信息对话框
function addBooksDlg() {
    $('#dlgPopup').empty();
    $('#dlgPopup').dialog({
        title: '导入书籍',
        width: 300,
        height: 240,
        closed: false,
        cache: false,
        href: 'table/addbooksdlg.html',
        modal: true,
        onLoad:function(){
        },
        buttons:[{
            text:'Save',
            handler:function(){
                bool = $('#addbooksdlg').form('enableValidation').form('validate');
                if(bool) {
                    addBooksServ($('#ISBN').val(), $('#PubVersion').combobox('getValue'), $('#PubHouse').combobox('getValue'), $('#BookTitle').val(), $('#BookAuthor').val(), $('#Price').val());
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

// 导入书籍信息逻辑(服务器交互)
function addBooksServ(isbn, pubverCD, pubhouseCD, title, author, price) {
    var msg = '';

    $.ajax({
        url:'async/table/addbooks.cc',
        type:'POST',
        async:true,
        dataType:'json',
        data:{'isbn':isbn,'title':title,'author':author,'pubver':pubverCD,'pubhouse':pubhouseCD,'price':price},
        success:function(resp){
            if(200 == resp.code) {
                msg = '导入书籍信息成功<br/>处理条数: ' + resp.data;
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
                $.messager.alert('错误','导入书籍信息失败','error',function(){$('#dlgPopup').dialog('close');});
            }
        },
        error:function(err){
            $.messager.alert('错误','服务器错误','error',function(){$('#dlgPopup').dialog('close');});
        }
    });
    return;
}
