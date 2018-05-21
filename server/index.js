import Koa from 'koa'
import https from 'https'
import fs from 'fs'
import { resolve } from 'path'
import R from 'ramda'
import { initSchemas, connect, initAdmin } from './database/init'
import { createProcess } from './service/controller_process'
import 'colors'

const MIDDLEWARE = ['bodyparser', 'logs', 'router']

const prod = process.env.NODE_ENV === 'production'

if(!prod){
	MIDDLEWARE.push('webpack-dev')
} else {
	MIDDLEWARE.push('prod')
}

const app = new Koa()

;(async () => {
	initSchemas()

	connect()
	
	await initAdmin()
	
	createProcess()
	
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

// app.listen(55555, () => {
// 	console.log('服务运行在:'.bgGreen, 'http://localhost:55555')
// })
const options = {
	key: fs.readFileSync(resolve(__dirname, './config/server.key')),
	cert: fs.readFileSync(resolve(__dirname, './config/server.crt'))
}

https.createServer(options, app.callback()).listen(8443, () => {
	console.log('服务运行于:'.bgGreen, 'https://localhost:8443')
})