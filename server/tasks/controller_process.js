import Child_process from './process'
import mongoose from 'mongoose'

const Temp = mongoose.model('Temperature')

// export const ledProcess = new Child_process('../controller/led_controller.js')

// export const temProcess = new Child_process('../controller/tem_controller.js')
//
// ;(() => {
// 	temProcess.receive(async data => {
// 		let temp = new Temp({ temperature:data })
// 		console.log(data)
// 		await temp.save()
// 	})
//
// })()

export const servosProcess = new Child_process('../controller/servo_controller.js')