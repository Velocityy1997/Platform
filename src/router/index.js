import Vue from 'vue'
import Router from 'vue-router'

//组件模块
const Login = () =>
    import ('views/login/login')
const Main = () =>
    import ('views/mainPage/main')

const pastTaskManagement = () =>
    import ('views/contentPage/pastTaskManagement')
const telegramManagement = () =>
    import ('views/contentPage/telegramManagement')
const blackList = () =>
    import ('views/contentPage/blackList')
const terminal = () =>
    import ('views/contentPage/terminal')
const aircraft = () =>
    import ('views/contentPage/aircraft')
const District = () =>
    import ('views/contentPage/District')
const logManagement = () =>
    import ('views/contentPage/logManagement')
const orderManagement = () =>
    import ('views/contentPage/orderManagement')


const userManagement = () =>
    import ('views/contentPage/userManagement')
const cardManagement = () =>
    import ('views/contentPage/cardManagement')
const msgManagement = () =>
    import ('views/contentPage/msgManagement')
const card = () =>
    import ('views/contentPage/card')
const setting = () =>
    import ('views/setting/setting')

const map = () =>
    import ('views/map/Map')
const terminalHistoryTrack = () =>
    import ('views/map/terminalHistoryTrack')

// 1. 安装路由插件
Vue.use(Router)


// 2. 定义路由对象
const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/main',
        component: Main,
        children: [{
                path: '/',
                redirect: 'map'
            },
            {
                // 地图
                path: 'map',
                component: map
            },
            {
                path: 'userManagement',
                component: userManagement
            },
            {
                path: 'cardManagement',
                name: 'cardManagement',
                component: cardManagement
            },
            {
                path: 'setting',
                name: 'setting',
                component: setting
            },
            {
                path: 'card',
                name: 'card',
                component: card
            },
            {
                path: 'msgManagement',
                name: 'msgManagement',
                component: msgManagement
            },
            {
                path: 'pastTaskManagement',
                name: 'pastTaskManagement',
                component: pastTaskManagement
            },
            {
                path: 'telegramManagement',
                name: 'telegramManagement',
                component: telegramManagement
            },
            {
                path: 'blackList',
                name: 'blackList',
                component: blackList
            },
            {
                path: 'terminal',
                name: 'terminal',
                component: terminal
            },
            {
                path: 'aircraft',
                name: 'aircraft',
                component: aircraft
            },
            {
                path: 'District',
                name: 'District',
                component: District
            },
            {
                path: 'logManagement',
                name: 'logManagement',
                component: logManagement
            },
            {
                path: 'orderManagement',
                name: 'orderManagement',
                component: orderManagement
            }
        ]
    },
    {
        path: '/terminalHistoryTrack',
        name: 'terminalHistoryTrack',
        component: terminalHistoryTrack
    }
]

const router = new Router({
    // mode: 'history', // 去掉url中的#
    // base: '/webapp/',  
    routes
})

// 3. 导出路由
export default router