const SocketServer = require('../lib/socket')
const facialRecognition = require('../lib/face')
const { resolve } = require('path')
const fs = require('fs-extra')

fs.removeSync(resolve(__dirname, '../../public/static/img'))
fs.mkdir(resolve(__dirname, '../../public/static/img'))

let servos = {}
// let socket = {}

// const servosTurn = dir => {
// 	switch (dir) {
// 		case 'left':
// 			servos.x.step(2);
// 			break
//
// 		case 'right':
// 			servos.x.step(-2);
// 			break
//
// 		case 'top':
// 			servos.y.step(2);
// 			break
//
// 		case 'down':
// 			servos.y.step(-2);
// 			break
// 	}
// }



module.exports = async (self, Five) => {
	let X = 90, Y = 30
	let x = new Five.Servo({
		pin: 4,
		startAt: X
	})
	let y = new Five.Servo({
		pin: 7,
		startAt: Y
	})
	servos = {
		x,
		y
	}
	
	
	let socket =  new SocketServer(2337, false, receiveBinary, false)
	
	// socket =  new SocketServer(2337, false, receive, false)
	
	
	// function receive (dir) {
	// 	servosTurn(dir)
	// 	socket.boardcast(dir)
	// }
	
	
	
	function receiveBinary (stream) {
		let time = +(new Date())
		let ArrBuffer = stream.split('data:image/jpeg;base64,')
		let dataBuffer = new Buffer(ArrBuffer[1], 'base64')
		let filename = resolve(__dirname, `../../public/static/img/${time}.jpg`)

		fs.writeFileSync(filename, dataBuffer)

		facialRecognition(filename, socket, getFacePosition)
	}

	function getFacePosition (obj) {
		if(obj.isShow) {
			console.log(obj.conf)
			let dx = Math.floor((obj.conf.left + (obj.conf.width / 2) - 400) * 0.05625)
			let dy = Math.floor((300 - (obj.conf.top + (obj.conf.height / 2))) * 0.05625)
			X = X - dx
			Y = Y + dy
			
				console.log(dx, dy);
			servos.x.to(X)
			servos.y.to(Y)
		}

	}
}