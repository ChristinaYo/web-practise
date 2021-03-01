// 仅在服务端渲染时加载 cookieparser
const cookieparser = process.server ? require('cookieparser') : null;

// 在服务端渲染期间运行都是同一个实例
// 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
export const state = () => {
    return {
        user: null
    }
}

export const mutations = {
    setUser(state, data) {
        state.user = data
    }
}

export const actions = {
     // nuxtServerInit 是一个特殊的 action 方法
  // 这个 action 会在服务端渲染期间自动调用
  // 作用：初始化容器数据，传递数据给客户端使用
    nuxtServerInit({ commit }, { req }) {
        let user = null
        if(req.headers.cookie) {
            // cookieparser 把 cookie 字符串转为 JavaScript 对象
            const cookie = cookieparser.parse(req.headers.cookie);
            try{
                user = JSON.parse(cookie.user)
            }catch(err) {
                // no valid cookie
            }
        }
        commit('setUser', user)
    }
}
