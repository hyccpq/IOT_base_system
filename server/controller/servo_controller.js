const socketServer = require('../lib/socket')

let servos = {}

const servosTurn = dir => {
	switch (dir) {
		case 'left':
			servos.x.step(2);
			break
		
		case 'right':
			servos.x.step(-2);
			break
		
		case 'top':
			servos.y.step(2);
			break
		
		case 'down':
			servos.y.step(-2);
			break
	}
}

module.exports = async (self, Five) => {
	servos = {
		x: new Five.Servo({
			pin: 4,
			startAt: 90
		}),
		
		y: new Five.Servo({
			pin: 5,
			startAt: 10
		})
	}
	
	self.repl.inject({
		serOff(){
			servos.x.stop()
			servos.y.stop()
		},
		serOn(){
			servos.x.on()
			servos.y.on()
		}
	})
	
	let conn =  await socketServer(2335)
	
	conn.on('text', function (dir) {
		console.log(dir);
		servosTurn(dir)
		conn.sendText(dir)
	})
}