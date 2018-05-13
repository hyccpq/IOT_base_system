import Koa from 'koa'

import R from 'ramda'
import 'colors'

const MIDDLEWARE = []
const app = new Koa()

;(async() => {
	
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
	
	app.listen(6666, () => {
		console.log('服务运行在:'.bgGreen, 'http://localhost:6666')
	})
	
})()