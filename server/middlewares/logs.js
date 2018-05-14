import logger from 'koa-logger'

export const logs = app => {
	app.use(logger())
}