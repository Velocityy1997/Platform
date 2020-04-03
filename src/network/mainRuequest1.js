import getAxios from "network/api"

// 获取短信管理表格数据
export function getMessageList(param) {
    const url = "/message/list";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}
// 删除短信
export function deleteMessage(param) {
    const url = "/message/del";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}
//清空短信
export function clearMessage(param) {
    const url = "/message/clearMes";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//获取历史任务表格数据
export function getHistoryList(param) {
    const url = "/historyTask/list";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}
//删除历史任务
export function delHistory(param) {
    const url = "/historyTask/del";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}
//清空历史任务
export function clearHistory(param) {
    const url = "/historyTask/clearTask";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//获取预置电文列表 
export function getpreMessageList(param) {
    const url = "/preMessage/list";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}
//添加预置电文
export function addpreMessage(param) {
    const url = "/preMessage/add";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//修改预置电文
export function editpreMessage(param) {
    const url = "/preMessage/edit";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//删除预置电文
export function delpreMessage(param) {
    const url = "/preMessage/del";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//获取黑名单列表
export function getblackListTable(param) {
    const url = "/blackList/list";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}
//添加黑名单
export function addblackList(param) {
    const url = "/blackList/add";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//删除黑名单
export function delblackList(param) {
    const url = "/blackList/del";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//修改黑名单
export function editblackList(param) {
    const url = "/blackList/edit";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//获取此刻时间、电量、信号
export function getTime(param) {
    const url = "/baudInfo/signal";
    const method = "get";
    let params = param;
    return getAxios({ url, method, params });
}
//获取最新消息列表
export function getNewMsgList(param) {
    const url = "/historyTask/newTasklist";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}
//获取待执行任务列表
export function getExecuteTaskList(param) {
    const url = "/taskList/list";
    const method = "post";
    let params = param;
    return getAxios({ url, method, params });
}

//判断是否被踢下线的接口
export function ifRelogin(param) {
    const url = '/baudInfo/getIsRelogin';
    const method = 'get';
    let params = param;
    return getAxios({ url, method, params });
}