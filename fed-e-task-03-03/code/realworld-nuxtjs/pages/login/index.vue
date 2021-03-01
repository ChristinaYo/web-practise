<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">{{ is_login ? 'Sign In' : 'Sign up' }}</h1>
                    <p class="text-xs-center">
                        <nuxt-link 
                            :to="is_login ? '/register' : '/login'"
                        >
                            {{ is_login ? 'Need an account?' : 'Have an account?' }}
                        </nuxt-link>
                    </p>

                    <ul class="error-messages">
                        <li v-for="(val, key) in errors" :key="key">
                            {{ `${key}: ${val}` }}
                        </li>
                    </ul>

                    <form @submit.prevent="onSubmit">
                        <fieldset v-if="!is_login" class="form-group">
                            <input 
                                v-model="user.username" 
                                class="form-control form-control-lg" 
                                type="text" 
                                placeholder="Your Name" 
                                required 
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input 
                                v-model="user.email" 
                                class="form-control form-control-lg" 
                                type="email" 
                                placeholder="Email" 
                                required 
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input 
                                v-model="user.password" 
                                class="form-control form-control-lg" 
                                type="password" 
                                placeholder="Password" 
                                required
                                minlength="8"
                            />
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            {{ is_login ? 'Sign In' : 'Sign up' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { login, register } from '@/api/user.js'
// 仅在客户端渲染时加载 js-cookie
const Cookie = process.client ? require('js-cookie') : null;

export default {
    middleware: 'unAuthorized',
    data() {
        return {
            user: {
                username: '',
                email: '',
                password: ''
            },
            errors: {},
        }
    },
    computed: {
        is_login() {
            return this.$route.name === 'login'
        },
    },
    watch: {
        '$route.name': {
            handler() {
                this.errors = {}
            }
        }
    },
    methods: {
        async onSubmit() {
            try{
                const { user } = this.is_login
                    ? await login({ user: this.user }) 
                    : await register({ user: this.user });

                this.$store.commit('setUser', user)

                // 为了防止刷新页面数据丢失，需要把数据持久化
                Cookie && Cookie.set('user', user)

                this.$router.push('/')
            }catch(err) {
                console.log("onSubmit -> err", err)
                this.errors = err
            }
        }
    }
}
</script>

<style>
</style>