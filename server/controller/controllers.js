const createLedCon = require('./led_controller')
require('colors')

const ready = require('./config/five_conf')

;(async () => {
	try {
		const self = await ready
		
		
	} catch (e) {
		throw new Error(e)
	}
	
})()