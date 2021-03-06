const Five = require('johnny-five')

const board = new Five.Board({port: "/dev/cu.usbmodem1411"})

const ready = new Promise((resolve, reject) => {
	board.on('ready', function () {
		console.log('Arduino连接成功！'.bgBlue)
		resolve(this)
	})
})

module.exports = ready