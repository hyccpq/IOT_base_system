const ws = require('nodejs-websocket')

const socketServer = port => new Promise((resolve, reject) => {
	ws.createServer(resolve).listen(port)
})

module.exports = socketServer

