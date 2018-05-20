const Five = require('johnny-five')
const socketServer = require('../lib/socket')
require('colors')

const ready = require('./config/five_conf')

;(async () => {
	try {
		let T ,conn
		await ready
		
		let temp = new Five.Thermometer({
			controller: "DS18B20",
			pin: 2,
			freq: 10 * 1000
		})
		
		temp.on('change', function () {
			T = this.celsius
			
			console.log('温度为 %d 度', this.celsius)
			if(conn){
				conn.sendText(T + '')
			}
		})
		
		setInterval(function () {
			process.send(T)

		}, 1000 * 20)
		
		conn = await socketServer(2333)
		
	} catch (e) {
		throw new Error(e)
	}
	
})()