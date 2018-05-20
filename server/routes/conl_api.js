import { controller, get, post, auth, admin, required } from '../lib/decorator'
import { getAllTem } from "../service/getTemDatabase";
import { createLedProcess, createServosProcess } from "../service/controller_process"

@controller('/api/v0')
export class Controllers {
	static _ledProcess = true
	static _servosProcess = true
	
	
	@get('/led')
	async getLedCon (ctx, next) {
		if(Controllers._ledProcess) {
			createLedProcess()
				// console.log("led语言");
			Controllers._ledProcess = false
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
		if(Controllers._servosProcess) {
			createServosProcess()
			Controllers._servosProcess = false
		}
		
	}
	

}