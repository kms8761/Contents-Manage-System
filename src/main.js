/* eslint-disable */ 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Foot from '@/components/Foot.vue'
import vuetify from './plugins/vuetify'
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import mydevice from './views/mydevice.vue'
import vueGoogleMapWrapper from '@/plugins/vue-google-map-wrapper'
import { Editor, Viewer } from '@toast-ui/vue-editor'
import moment from 'moment'
import * as VueGoogleMaps from "vue2-google-maps";
Vue.component('foot', Foot)
Vue.component('editor', Editor)
Vue.component('viewer', Viewer)

Vue.config.productionTip = false
Vue.use(vueGoogleMapWrapper, { apiKey: 'AIzaSyAoPWFtGvoaXPoDgGho6MqJ3K6S_RLSuPU' })
Vue.filter('formatDateYMDHMS', (value) => {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm:ss')
    }
})

Vue.filter('formatDateYMD', (value) => {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD')
    }
})
Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyAoPWFtGvoaXPoDgGho6MqJ3K6S_RLSuPU",
    },
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')