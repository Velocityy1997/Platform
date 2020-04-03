import originAxios from "axios";

export default function getApi(option) {
    // 1、创建axios的实例
    const instance = originAxios.create({
        baseURL: 'http://localhost:8089/ZHRJSystem',
        timeout: 5000,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    });

    // 2、传入对象进行网络请求
    return instance(option);
}