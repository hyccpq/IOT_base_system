import cp from 'child_process'
import { resolve } from 'path'


export default class Child_process {
	
	constructor (url){
		this.script = resolve(__dirname, url)
		this.child = cp.fork(this.script)
		
		let invoked = false
		
		this.child.on('error', err => {
			if(invoked)return
			invoked = true
			console.log(err)
		})
		
		this.child.on('exit', code => {
			if(invoked)return
			invoked = true
			let err = code === 0 ? null : new Error('exit code' + code)
			console.log(err);
		})
		
	}
	
	receive(callback){
		this.child.on('message', callback)
	}
}
