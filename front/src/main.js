import Vue from 'vue'
import App from './App'
import router from './lib/router'
import $http from './lib/axios'
import 'element-ui/lib/theme-chalk/index.css'

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

export default new Vue({
	el:'#app',
	render: h => h(App),
	router,
	template:'<App/>',
	components: {App}
})