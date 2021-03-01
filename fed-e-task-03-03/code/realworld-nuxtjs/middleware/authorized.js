/**
 * 中间件：未登录状态直接访问需要登录的页面，重定向/login
 */
export default function({ store, redirect }) {
    if(!store.state.user) {
        return redirect('/login')
    }
}