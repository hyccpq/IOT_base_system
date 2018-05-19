import Child_process from '../tasks/process'
import mongoose from 'mongoose'

const Temp = mongoose.model('Temperature')

export const createLedProcess = () => {
	let ledProcess = new Child_process('../controller/led_controller.js')
	return ledProcess
}

export const temProcess = new Child_process('../controller/tem_controller.js')

;(() => {
	temProcess.receive(async data => {
		let temp = new Temp({ temperature:data })
		console.log(data)
		await temp.save()
	})

})()

export const createServosProcess = () => {
	let servosProcess = new Child_process('../controller/servo_controller.js')
	return servosProcess
}