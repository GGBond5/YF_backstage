import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from 'moment'
import format from 'vue-text-format';
import fileDownload from "js-file-download";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts';
import ajax from '@/plugins/ajax.js'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import '@/assets/font_3347888_cql8k398dph/iconfont.css'
import '@/assets/style.css';
import '@/assets/supervision.css';

Vue.config.productionTip = false;
Vue.use(format);
Vue.use(ElementUI)
Vue.prototype.$http = ajax
Vue.prototype.$moment = moment
Vue.prototype.$echarts = echarts
Vue.prototype.$fileDownload = fileDownload

// 格式化数字显示
Vue.prototype.$toFixed = (str, n=0)=>{
  if(str===undefined || str===null || str===''){
    return '-'
  }else{
    return parseFloat(Number(str).toFixed(n))
  }
}

// 全局改变窗口
// window.onresize = () => {
//   console.log(document.documentElement.clientWidth,document.documentElement.clientHeight)
//   store.commit('setWidth', document.documentElement.clientWidth)
//   store.commit('setHeight', document.documentElement.clientHeight)
// }

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /Yf[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
