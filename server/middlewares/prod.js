import serve from 'koa-static'
import views from 'koa-views'
import { resolve } from 'path'


export const prod = app => {
	
	app.use(serve(resolve(__dirname, '../../')))
	app.use(views(resolve(__dirname, '../../')), {
			extensions: 'html'
	})

	app.use(async (ctx, next) => {
		console.log('咦咦咦')
		await ctx.render('index.html')
	})
}