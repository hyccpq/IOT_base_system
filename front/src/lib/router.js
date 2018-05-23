import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import('../components/login')
const welcome = () => import('../components/welcome')
const index = () => import('../components/index')
const ledComponent = () => import('../components/controller/ledComponent')
const temComponent = () => import('../components/controller/temComp')
const cloudTerrace = () => import('../components/controller/CloudTerraceComp')

export default new Router({
	mode: 'history',
	routes:[
		{
			path: '/login',
			name: '登录页',
			component: login,
		},
		{
			path: '/',
			name: '欢迎页面',
			redirect: '/welcome/',
			component: index,
			children: [
				{
					path: '/welcome',
					meta: { auth: true },
					name: 'welcome',
					component: welcome
				},
				{
					path: '/ledController',
					meta: { auth: true },
					name: 'ledController',
					component: ledComponent
				},
				{
					path: '/temController',
					meta: { auth: true },
					name: 'temController',
					component: temComponent
				},
				{
					path: '/cloudTerraceController',
					meta: { auth: true },
					name: 'cloudTerraceController',
					component: cloudTerrace
				}
			]
		}
	]
})