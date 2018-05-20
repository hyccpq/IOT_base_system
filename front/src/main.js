import Vue from 'vue'
import App from './App'
import router from './lib/router'

// router.beforeEach((to, from, next) => {
//
// })

new Vue({
	el:'#app',
	render: h => h(App),
	router,
	template:'<App/>',
	components: {App}
})