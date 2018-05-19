import session from 'koa-session'

export const addSession = app => {
	app.keys = ['movie-trailer']
	
	const CONFIG = {
		key:'koa:sess',
		maxAge: 86400000,
		overwrite: true,
		httpOnly: false,
		signed: true,
		rolling:false
	}
	
	app.use(session(CONFIG, app))
}