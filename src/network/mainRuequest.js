import getAxios from "network/api"
import Qs from 'qs'

// --------------------------- made by xjj -----------------------
// 获取左侧树数据
export function getTreeList(data) {
    const url = "/terminal/getTerminalTreeByUser";
    const method = "post";

    return getAxios({ url, method, data });
}

// 获取短信管理表格数据
export function getMessageList(param) {
    const url = "/message/list";
    const method = "post";
    let params = param;

    return getAxios({ url, method, params });
}

// 获取订单列表
export function OrderList(param) {
    const url = "/orderForm/list";
    const method = "post";
    let params = param;

    return getAxios({
        url,
        params,
        method
    })
}
// 获取日志管理列表
export function logMessList(param) {
    const url = "/logInfo/list";
    const method = "post";
    let params = param;

    return getAxios({
        url,
        params,
        method
    })
}
// 获取日志管理删除
export function logMessDel(param) {
    const url = "/logInfo/del";
    const method = "post";
    let params = param;

    return getAxios({
        url,
        params,
        method
    })
}
// 获取日志管理清空
export function logMessClear(param) {
    const url = "/logInfo/clear";
    const method = "post";
    let params = param;

    return getAxios({
        url,
        params,
        method
    })
}
//获取区域管理列表
export function districtList(param) {
    const url = "/area/list";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//区域管理列表删除
export function districtdel(param) {
    const url = "/area/del";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//区域管理列表添加
export function districtadd(param) {
    const url = "/area/add";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//区域管理列表修改
export function districtedit(param) {
    const url = "/area/edit";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//区域管理添加修改弹框下拉获取
export function districtselect1(param) {
    const url = "/area/getAllProvince";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
export function districtselect2(param) {
    const url = "/area/getCitys";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//指挥机管理表格获取
export function aircraftList(param) {
    const url = "/zhj/list";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//指挥机管理列表删除
export function aircraftDel(param) {
    const url = "/zhj/del";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//指挥机管理列表添加
export function aircraftAdd(param) {
    const url = "/zhj/add";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//指挥机管理列表修改
export function aircraftEdit(param) {
    const url = "/zhj/edit";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//指挥机管理添加修改弹框下拉获取
export function aircraftselect1(param) {
    const url = "/area/getAllProvince";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
export function aircraftselect2(param) {
    const url = "/area/getCitys";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
export function aircraftselect3(param) {
    const url = "/area/getAllZone";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
export function aircraftselect4(param) {
    const url = "/industry/industList";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//终端管理表格获取
export function terminalList(param) {
    const url = "/terminal/getTerminalByPage";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//终端管理列表删除
export function terminalDel(param) {
    const url = "/terminal/deleteTerminal";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//终端管理列表添加
export function terminalAdd(param) {
    const url = "/terminal/addTerminal";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//终端管理列表修改
export function terminalEdit(param) {
    const url = "/terminal/editTerminal";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//终端管理添加修改弹框下拉获取
export function terminalselect1(param) {
    const url = "/area/getAllProvince";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
export function terminalselect2(param) {
    const url = "/area/getCitys";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
export function terminalselect3(param) {
    const url = "/area/getAllZone";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
export function terminalselect4(param) {
    const url = "/industry/industList";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//北斗卡管理表格获取
export function cardList(param) {
    const url = "/bdCard/list";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//北斗卡管理销卡
export function cardDel(param) {
    const url = "/bdCard/logout";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}


//北斗卡管理注册
export function cardAdd(param) {
    const url = "/bdCard/add";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//北斗卡管理充值
export function cardRecharge(param) {
    const url = "/bdCard/recharge";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//北斗卡管理上传
export function cardLoad(param) {
    const url = "/bdCard/upload";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//用户管理表格获取
export function userList(param) {
    const url = "/user/list";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//用户管理添加
export function userAdd(param) {
    const url = "/user/add";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//用户管理修改
export function userEdit(param) {
    const url = "/user/edit";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//用户管理删除
export function userDel(param) {
    const url = "/user/del";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//用户管理重置密码
export function userRePass(param) {
    const url = "/user/initial";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })

}

// 用户状态
export function getUserInfo() {
    const url = "/user/getUserInfo";
    const method = "post";

    return getAxios({
        url,
        method
    })
}
//系统设置获取
export function settingMes() {
    const url = "/sysInfo/info";
    const method = "post";
    return getAxios({
        url,
        method
    })
}
//设置通信频度
export function frequency(param) {

    const url = "/sysInfo/setComm";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//设置串口
export function setPort(param) {

    const url = "/sysInfo/setPort";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
// 修改密码
export function editPass(param) {

    const url = "/user/changePwd";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//左侧树右键菜单指令导航路线下拉
export function navigationSelect() {
   
    const url = "/route/getAll";
    const method = "get";
    return getAxios({
        url,
        method
    })
}
//指令导航执行
export function navigation(param) {

    const url = "/terminalTask/orderNav";
    const method = "post";
    let params = param;
    return getAxios({
        url,
        params,
        method
    })
}
//发送短信预置电文获取
export function noteTextSelect() {

    const url = "/preMessage/getAll";
    const method = "get";
    return getAxios({
        url,
        method
    })
}
//发送短信
export function sendNote(data) {
    const url = "/zhjTask/sendMsg";
    const method = "post";
    
    return getAxios({
        url,
        transformRequest: [function (data) {
            data = Qs.stringify(data);
            return data;
        }],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data,
        method
    })
}
// ---------------------- made by mc ------------------------------
// 地图指挥机位置查询
export function getPosition() {
    const url = "/zhj/getPosition";
    const method = "post";

    return getAxios({
        url,
        method
    })
}

// 获取所有的终端位置
export function getAllPosion() {
    const url = "/terminal/getAllPosion";
    const method = "get";

    return getAxios({
        url,
        method
    })
}

// 获取路线
export function getRoute(url) {
    const method = "get";
    return getAxios({
        url,
        method
    })
}

// 提示
export function getTipData(url, data) {

    const method = "post";
    return getAxios({
        url,
        method,
        transformRequest: [function (data) {
            data = Qs.stringify(data);
            return data;
        }],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data
    })
}

// 
export function getTerminalHisPositions(url, params) {
    const method = "get";

    return getAxios({
        url,
        method,
        params
    })
}

// 
export function getBdLocateList(url) {
    const method = "get";

    return getAxios({
        url,
        method
    })
}


// 预置电文
export function yzdwData(url) {
    const method = 'get';

    return getAxios({
        url,
        method
    })
}

// 短信通播提交
export function basePost(url, data) {
    const method = 'post';
    return getAxios({
        url,
        transformRequest: [function (data) {
          
            data = Qs.stringify(data);
            return data;
        }],
        data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method
    })
}

// 本机信息
export function getLocalInfo() {
    const method = 'get';
    const url = '/zhjTask/getZhjInfo';

    return getAxios({
        url,
        method
    })
}

// 本机定位
export function getNewLocalPos() {
   
    const method = 'get';
    const url = '/zhjTask/getLoaction';

    return getAxios({
        url,
        method
    })
}

// 友邻位置
export function getNeiLoc(data) {
    const method = 'post';
    const url = '/zhjTask/sharePosition';

    return getAxios({
        url,
        method,
        transformRequest: [function (data) {
            data = Qs.stringify(data);
            return data;
        }],
        data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

// 任务重置
export function resetTask() {
    const method = 'GET';
    const url = '/zhjTask/resetTask';

    return getAxios({
        url,
        method
    }) 
}


// 指令导航
export function getLocation(params) {
    const method = 'get';
    const url = '/terminalTask/getLocation';

    return getAxios({
        url,
        method,
        params
    }) 
}

// 历史轨迹
export function getTerminalHistoryTrack(data) {
    const method = 'post';
    const url = '/terminalTask/getHistoryLocation';

    return getAxios({
        url,
        method,
        transformRequest: [function (data) {
            data = Qs.stringify(data);
            return data;
        }],
        data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) 
}

// 本机定位
export function getFinishTask() {
    const method = 'get';
    const url = '/baudInfo/getFinishTask';

    return getAxios({
        url,
        method
    })  
}