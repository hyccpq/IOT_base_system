const Five = require('johnny-five')
const socketServer = require('../lib/socket')
require('colors')

const ready = require('./config/five_conf')

;(async () => {
	try {
		const self = await ready
		const conn = await socketServer(2334)
		let pwm
		let led = new Five.Led('11')

		self.repl.inject({
        on(){
            led.on()
        },
        off(){
            led.off()
        }
		})
		
		conn.on('text', function (strPWM) {
			console.log(strPWM);
			pwm = parseInt(strPWM)
			led.brightness(pwm)

			conn.sendText(pwm + "")
		})
		
	} catch (e) {
		throw new Error(e)
	}
	
})()


