const glob = require("glob") ;
const { resolve } = require("path") ;

const Five = require('johnny-five')
// const createLedCon = require('./led_controller')
// const createTemCon = require('./tem_controller')
// const createServoCon = require('./servo_controller')
require('colors')

const ready = require('./config/five_conf')

;(async () => {
	try {
		const self = await ready
		// createLedCon(self, Five)
		// createTemCon(self, Five)
		// createServoCon(self, Five)
		glob.sync(resolve(__dirname, './units/*.js')).forEach(item => {
			require(item)(self, Five)
		})
		
	} catch (e) {
		throw new Error(e)
	}
	
})()