const SocketServer = require('../lib/socket')

module.exports = async (self, Five) => {
	try {
		let T = {
			T : 'null'
		}
		
		let temp = new Five.Thermometer({
			controller: "DS18B20",
			pin: 2,
			freq: 2 * 100
		})
		let socket = new SocketServer(2333, T)
		
		temp.on('change', function () {
			T = {
				T: this.celsius
			}
			console.log('温度为', JSON.stringify(T))
			socket.boardcast(JSON.stringify(T))
		})
		
		setInterval(function () {
			if(T.T < 50 && T.T > -20) {
				process.send(T.T)
			}
		}, 1000 * 30)
		
		
		
	} catch (e) {
		console.log(e);
	}
	
}