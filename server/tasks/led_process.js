import cp from 'child_process'
import { resolve } from 'path'

(async () => {
	const script = resolve(__dirname, '../controller/led_controller.js')
	const child = cp.fork(script, [])
	
	child.on('message', data => {
		let result = data.result
		
		console.log('当前的亮度为',result)
	})
})()