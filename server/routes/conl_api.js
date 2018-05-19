import { controller, get, post, auth, admin, required } from '../lib/decorator'
import { getAllTem } from "../service/getTemDatabase";
import { createLedProcess, createServosProcess } from "../service/controller_process"

@controller('/api/v0/')
export class User {
	_ledProcess = true
	_servosProcess = true
	
	@get('/led')
	async getLedCon (ctx, next) {
		if(this._ledProcess) {
			createLedProcess()
			this._ledProcess = false
		}
		
		ctx.body = {
			success: true
		}
	}
	
	@get('/tem')
	async getTem (ctx, next) {
		const tem = await getAllTem()
		ctx.body = {
			success: true,
			tem
		}
	}
	
	@get('/servo')
	async getServoCon (ctx, next) {
		if(this._servosProcess) {
			createServosProcess()
			this._servosProcess = false
		}
		
	}
	

}