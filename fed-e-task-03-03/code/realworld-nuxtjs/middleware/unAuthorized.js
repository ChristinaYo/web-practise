/**
 * 中间件：登录状态直接访问login 或register页面，重定向/ （没必要再登录）
 */
export default function({ store, redirect }) {
    if(store.state.user) {
        return redirect('/')
    }
}