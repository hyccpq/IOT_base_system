// const glob = require("glob")
// const { resolve } = require("path")

const Five = require('johnny-five')
const createLedCon = require('./units/led_controller')
const createTemCon = require('./units/tem_controller')
const createServoCon = require('./units/servo_controller')
require('colors')

const sleep = time => new Promise((resolve, reject) => {
	setTimeout(resolve, time)
})

const ready = require('./config/five_conf')

;(async () => {
	try {
		const self = await ready
		
		createLedCon(self, Five)
		createTemCon(self, Five)
		createServoCon(self, Five)
		// glob.sync(resolve(__dirname, './units/*.js')).forEach(async item => {
		// 	require(item)(self, Five)
		// 	await sleep(2000)
		// })
		
	} catch (e) {
		throw new Error(e)
	}
	
})()