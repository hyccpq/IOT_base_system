import Koa from 'koa'
import { resolve } from 'path'
import R from 'ramda'
import 'colors'

const MIDDLEWARE = ['bodyparser', 'prod', 'logs']

const app = new Koa()

;(() => {
	
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
	
	require('./tasks/led_process')
	
	app.listen(55555, () => {
		console.log('服务运行在:'.bgGreen, 'http://localhost:55555')
	})
	
})()