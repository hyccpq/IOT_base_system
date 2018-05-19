import dev from './dev/devMiddleware'
import hot from './dev/hotMiddelware'
import webpack from 'webpack'
import serve from 'koa-static'
import views from 'koa-views'
import { resolve } from 'path'
import webpackConfig from '../../front/build/webpack.dev.conf'

const compiler = webpack(webpackConfig)

const opt = {
	writeToDisk:true,
	logTime: true
}

export const webpackDev = app => {
	app.use(dev(compiler, opt))
	app.use(hot(compiler, opt))
	
	app.use(serve(resolve(__dirname, '../../front/dist')))
	app.use(views(resolve(__dirname, '../../front/dist')), {
			extensions: 'html'
	})

	app.use(async (ctx, next) => {
		await ctx.render('index.html')
	})
}