const Five = require('johnny-five')
const socketServer = require('../lib/socket')
require('colors')

const ready = require('./config/five_conf')

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

;(async () => {
	await ready
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
	
	let conn =  await socketServer(2333)
	
	conn.on('text', function (dir) {
		console.log(dir);
		servosTurn(dir)
		conn.sendText(dir)
	})
})()