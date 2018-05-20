import Koa from 'koa'
import { resolve } from 'path'
import R from 'ramda'
import { initSchemas, connect, initAdmin } from './database/init'
import { createTemProcess } from './service/controller_process'
import 'colors'

const MIDDLEWARE = ['bodyparser', 'logs', 'router']

const app = new Koa()

;(async () => {
	initSchemas()

	connect()
	
	await initAdmin()
	
	createTemProcess()
	
})()

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

app.listen(55555, () => {
	console.log('服务运行在:'.bgGreen, 'http://localhost:55555')
})