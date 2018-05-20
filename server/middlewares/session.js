import session from 'koa-session'

export const addSession = app => {
	app.keys = ['ioT']
	
	const CONFIG = {
		key:'koa:sess',
		maxAge: 86400000,
		overwrite: true,
		httpOnly: false,
		signed: true,
		rolling:false,
		renew: false
	}
	// console.log(session(CONFIG, app));
	app.use(session(CONFIG, app))
}