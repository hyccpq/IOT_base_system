const socketServer = require('../lib/socket')

module.exports = async (self, Five) => {
	try {
		let T ,conn
		
		let temp = new Five.Thermometer({
			controller: "DS18B20",
			pin: 2,
			freq: 10 * 1000
		})
		
		temp.on('change', function () {
			T = this.celsius
			
			console.log('温度为 %d 度', this.celsius)
			if(conn){
				conn.sendText(T + '')
			}
		})
		
		setInterval(function () {
			if(T < 50 && T > -20) {
				process.send(T)
			}
		}, 1000 * 20)
		
		conn = await socketServer(2333)
		
	} catch (e) {
		throw new Error(e)
	}
	
}