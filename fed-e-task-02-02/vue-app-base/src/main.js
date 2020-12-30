import Vue from 'vue'
import App from './App.vue'
import { Button } from './sideEffect'
// import {test} from './shaking';
import './style.less'
// console.log(test())
Vue.config.productionTip = false
document.body.appendChild(Button())
new Vue({
  render: h => h(App)
}).$mount('#app')
