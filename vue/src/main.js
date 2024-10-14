import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
import App from './App.vue';

// Global styles  
import '@/assets/css/global.scss';

// Element Plus  
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包  

// Icons  
import * as ElementPlusIcons from '@element-plus/icons-vue';

// Custom components  
import nNav from '@/components/layout/nav.vue';
import nSlider from '@/components/layout/slider.vue';
import nSliderNode from '@/components/layout/slider-node.vue';

// Utilities  
import base from '@/utils/base';
import bus from '@/utils/bus';
import request from '@/utils/request';
import directive from '@/utils/directive';
import mixin from '@/utils/mixin';


import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// Message function  
import { ElMessage } from 'element-plus';
export const msg = (message = '操作成功', type = 1) =>
    ElMessage({
        message: message,
        type: ['', 'success', 'error', 'warning', 'info'][type],
    });

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

// Use plugins and store  
app.use(ElementPlus, { locale: zhCn }); // Set Element Plus to use Chinese locale  
app.use(router);
app.use(store);

// Register global components  
app.component('n-nav', nNav);
app.component('n-slider', nSlider);
app.component('n-slider-node', nSliderNode);

// Register Element Plus icons  
Object.entries(ElementPlusIcons).forEach(([keyName, IconComponent]) => {
    const componentName = `el-icon-${base.params.humpToSplit(keyName, '-')}`;
    app.component(componentName, IconComponent);
});

// Register global utilities and the message function  
app.config.globalProperties.$base = base;
app.config.globalProperties.$bus = bus;
app.config.globalProperties.$request = request;
app.config.globalProperties.$msg = msg;

// Apply custom directives and mixins globally  
directive(app);
app.mixin(mixin);

// Mount the app and expose it to window for debugging  
const vm = app.mount('#app');
window.vm = vm;

import * as echarts from 'echarts';  
  
  
// 添加 ECharts 到全局属性  
app.config.globalProperties.$echarts = echarts;  
  
import VideoPlayer from 'vue-video-player'

Vue.use(VideoPlayer)
