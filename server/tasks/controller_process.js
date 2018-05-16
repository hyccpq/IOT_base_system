import Child_process from './process'
import mongoose from 'mongoose'

const Temp = mongoose.model('Temperature')

export const ledProcess = new Child_process('../controller/led_controller.js')

export const temProcess = new Child_process('../controller/tem_controller.js')

;(async () => {
	let data = await temProcess.receive()
	
	
})()