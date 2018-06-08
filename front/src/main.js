import Vue from 'vue'
import App from './App'
import router from './lib/router'
import $http from './lib/axios'
import { Notification } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'v-charts/lib/style.min.css'

Vue.prototype.$notify = Notification

router.beforeEach(async (to, from, next) => {
	if(to.matched.some(({meta}) => meta.auth)) {
		let checkInfo = await $http({
			method:'POST',
			url:'user/check'
		})
			console.log(checkInfo.data.success);
		if(checkInfo.data.success) {
			next()
		} else {
			next('/login')
		}
		
	} else {
		next()
	}
})

Date.prototype.format = function(fmt) {
     var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
     }
    return fmt;
}

export default new Vue({
	el:'#app',
	render: h => h(App),
	router,
	template:'<App/>',
	components: {App}
})