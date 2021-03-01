import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io', 
})

// 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
// 插件导出函数必须作为 default 成员

// 记录注册拦截器id （id一般从0开始递增）
let reqInterceptor = null;
let resInterceptor = null;

export default ({ store, redirect }) => {
    // 移除已有的拦截器，避免重复拦截同一个请求
    reqInterceptor !== null && request.interceptors.request.eject(reqInterceptor);
    resInterceptor !== null && request.interceptors.response.eject(resInterceptor);

    reqInterceptor = request.interceptors.request.use(
        (config) => {
            const { user } = store.state
            if(user && user.token) {
                config.headers.Authorization = `Token ${user.token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    resInterceptor = request.interceptors.response.use(
        response => {
            const { code } = response.data || {}
            if ( code == 401 || code == 403 ) {
                redirect('/login');
            }
            return response.data;
        },
        error => {
            const { status, data } = error.response || {}
            if (status === 401 || status === 403) {
                redirect('/login');
            }
            if (status === 404) {
                alert(' Not found requests')
            }
            if (status === 422) {
                return  Promise.reject(data && data.errors)
            }
        }
    );
}