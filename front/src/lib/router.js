import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import('../components/login')
// const detail = () => import('../components/detail')

export default new Router({
	mode: 'history',
	routes:[
		{
			path: '/',
			name: '登录页',
			component: login,
		}
	// 	{
	// 		path: '/detail/:id',
	// 		name: '详情页面',
	// 		component: detail
	// 	}
	]
})