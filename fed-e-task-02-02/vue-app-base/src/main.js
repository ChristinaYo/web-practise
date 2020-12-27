import Vue from 'vue'
import App from './App.vue'

import './style.less'
import {aaa} from './shaking'

Vue.config.productionTip = false
console.log(aaa);
new Vue({
  render: h => h(App),
}).$mount('#app')
