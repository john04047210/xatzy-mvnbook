/**
 * Created by qiaopeng on 18-7-28.
 */
$(function(){
    $(window).resize(function(){
        $('#sysonline_dg').datagrid('resize');
    });
    searchOnlineInfo();
});

// 获取系统开放时间
function searchOnlineInfo(){
    var url = 'async/nav/getonline.cc';
    $.get(url, function(resp){
        if(200 == resp.code) {
            dateRange = resp.data;
            $('#startDate').datebox('setValue', dateRange[0]);	// set datebox value
            $('#endDate').datebox('setValue', dateRange[1]);
        }
    });
}

function editonline() {
    var startDate = $('#startDate').datebox('getValue');
    var endDate = $('#endDate').datebox('getValue');
    var url = 'async/nav/uptonline.cc';
    $.post(url, {startTime: startDate, endTime: endDate}, function(resp){
        if(200 == resp.code) {
            $.messager.alert('提示','更新成功','info');
        } else {
            $.messager.alert('提示',resp.msg,'error');
        }
    });
}