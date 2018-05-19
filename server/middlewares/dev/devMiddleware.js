import webpackDev from 'webpack-dev-middleware'

export default (compiler, opts) => {
	const middleware = webpackDev(compiler, opts)
		// console.log(middleware.fileSystem);
	return async (ctx, next) => {
		await middleware(ctx.req, {
			end: content => {
				ctx.body = content
			},
			setHeader: (name, value) => {
				ctx.set(name, value)
			}
		}, next)
	}
}