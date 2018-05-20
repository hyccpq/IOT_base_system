const ws = require('nodejs-websocket')

const socketServer = port => new Promise((resolve, reject) => {
	console.log(`socket通信已经建立在:${port}`.bgCyan);
	ws.createServer(resolve).listen(port)
})

module.exports = socketServer

