const Five = require('johnny-five')
require('colors')

const ready = require('./config/five_conf')

;(async () => {
	try {
		await ready
		// const conn = await socketServer(2333)
		let temp = new Five.Thermometer({
			controller: "DS18B20",
			pin: 2
		})
		
		temp.on('change', function () {
			console.log('温度为 %d C', this.celsius)
		})


	} catch (e) {
		throw new Error(e)
	}
	
})()