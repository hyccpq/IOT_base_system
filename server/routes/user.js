import { controller, get, post, auth, required } from '../lib/decorator'
import { getToken } from '../service/auth'
import { checkPassword } from '../service/admin'

@controller('/api/v0/user')
export class User {
	
	
	@post('/login')
	@required({
		body: ['username', 'password']
	})
	async loadControl (ctx, next) {
		
		const { username, password } = ctx.request.body
		console.log(username, password);
		const matchData = await checkPassword(username, password)
		
		if(matchData.match) {
			// ctx.session.views = {
			// 	_id: matchData.user._id,
			// 	email: matchData.user.email,
			// 	role: matchData.user.role,
			// 	username: matchData.user.username
			// }
			
			ctx.body = {
				username,
				token: getToken(username),
				success: true
			}
		} else {
			ctx.body = {
				success: false,
				errcode: '用户名或者密码不正确'
			}
		}
	}

	@post('/check')
	@auth
	async check (ctx, next) {
		ctx.body = {
			success: true
		}
	}
}