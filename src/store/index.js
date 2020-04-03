import Vue from 'vue'
import Vuex from 'vuex'

import { getUserInfo } from 'network/mainRuequest'

// 1. 安装插件
Vue.use(Vuex)


// 2. 定义store对象
let state = {
    isActive: 0,
    userType: localStorage.getItem("userType"),
    userName: localStorage.getItem("userName"),
    flag: false
}
const store = new Vuex.Store({
    state,
    mutations: {
        changeHeadActive(state, payload) {
            state.isActive = payload;
        },
        mutGetUserType(state, payload) {
            localStorage.setItem("userType",  payload.type);
            localStorage.setItem("userName",  payload.name);
            state.userType =  payload.type;
            state.userName = payload.name;
        },
        changeFlag(state) {
            state.flag = true;
        }
    },
    actions: {
        getUserType(context) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    let data = res.data.data;
                    context.commit('mutGetUserType', data);
                    resolve(res);
                }).catch(err => console.log('用户状态获取错误'));
            })
        }
    }
})


// 3. 导出
export default store