const socketServer = require('../lib/socket')

module.exports = async (self, Five) => {
	try {
		const conn = await socketServer(2334)
		let pwm = 0,
			ledState = false
		let led = new Five.Led('11')
		
		self.repl.inject({
			on(){
				led.on()
			},
			off(){
				led.off()
			}
		})
		
		let ledConf = {
			pwm,
			ledState
		}
		
		conn.sendText(JSON.stringify({
			pwm,ledState
		}))
		
		let clientLedConf = {}
		
		conn.on('error',function (err) {
			console.log(err)
		})
		
		conn.on('close', function () {
			console.log('连接已经断开')
		})
		
		conn.on('text', function (clientStrLedConf) {
			console.log(clientStrLedConf);
			clientLedConf = JSON.parse(clientStrLedConf)
			if(clientLedConf.ledState) {
				if(!ledState) {
					led.on()
					ledState = true
				}
				pwm = parseInt(clientLedConf.pwm)
				led.brightness(pwm)
				
			} else {
				led.off()
				ledState = false
			}
			ledConf = {
				pwm,
				ledState
			}
			conn.sendText(JSON.stringify(ledConf))
		})
		
		
		
	} catch (e) {
		console.log(e)
	}
	
}


