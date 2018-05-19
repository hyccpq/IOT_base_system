import Koa from 'koa'
import { resolve } from 'path'
import R from 'ramda'
import { initSchemas, connect } from './database/init'
import 'colors'

const MIDDLEWARE = ['bodyparser', 'logs', 'router', 'session']

const app = new Koa()

;(async () => {
	initSchemas()
	
	connect()
	
	const useMiddleware = app => {
		R.map(
			R.compose(
				R.forEachObjIndexed(
					initWith => initWith(app)
				),
				require,
				name => resolve(__dirname, `./middlewares/${name}`)
			)
		)(MIDDLEWARE)
	}

	useMiddleware(app)
	
	await require('./service/controller_process')
	
	app.listen(55555, () => {
		console.log('服务运行在:'.bgGreen, 'http://localhost:55555')
	})
	
})()