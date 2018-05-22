const SocketServer = require('../lib/socket')

module.exports = (self, Five) => {
	try {
		
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
		
		let socket = new SocketServer(2334, ledConf, receive)
		
		// let clientLedConf = {}
		
		function receive(clientLedConf) {
			console.log(clientLedConf);
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
			
			socket.boardcast(JSON.stringify(ledConf))
		}
		
		// socket.receiveMsg(receive)
		
	} catch (e) {
		console.log(e)
	}
	
}


