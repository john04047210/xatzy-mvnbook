function initDataGrid_localpage(datagrid_id) {
    var jquery_id = '#'+datagrid_id;
    $(jquery_id).datagrid({
        pagination:true,
        pagePosition:'bottom',
        pageNumber:1,
        pageSize:20,
        pageList:[10,20,30,50,100]
    });
    $(jquery_id).datagrid({'data':[]}).datagrid('clientPaging');
}

function loadDataGrid_data(datagrid_id, url, queryParams, method, dataType) {
    var jquery_id = '#'+datagrid_id;
    $.ajax({
        url:url,
        type:method,
        async:true,
        dataType:dataType,
        data:queryParams,
        success:function(resp){
            if(200 == resp.code) {
                $(jquery_id).datagrid('loadData',{'total':resp.data.length,'rows':resp.data});
            } else if(404 == resp.code) {
                $.messager.alert('提示','没有符合条件的数据，请重新输入查询条件','info');
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else {
                $.messager.alert('错误',resp.msg,'error');
            }
        },
        error:function(err){
            $.messager.alert('错误','数据加载失败','error');
        }
    });
}

function loadTreeGrid_data(datagrid_id, url, queryParams, method, dataType) {
    var jquery_id = '#'+datagrid_id;
    $.ajax({
        url:url,
        type:method,
        async:true,
        dataType:dataType,
        data:queryParams,
        success:function(resp){
            if(200 == resp.code) {
                $(jquery_id).treegrid('loadData',{'total':resp.data.length,'rows':resp.data});
            } else if(404 == resp.code) {
                $.messager.alert('提示','没有符合条件的数据，请重新输入查询条件','info');
            } else if(401 == resp.code) {
                $.messager.alert('错误','登陆失效，请重新登陆','error',function(){window.location.href=com.global.login_href;});
            } else {
                $.messager.alert('错误',resp.msg,'error');
            }
        },
        error:function(err){
            $.messager.alert('错误','数据加载失败','error');
        }
    });
}


