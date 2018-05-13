import Five from 'johnny-five'
import pwm from '/'

import ready from './config/five_conf'

;(async () => {
	let self = await ready
	let led = new Five.Led('11')
	
	led.brightness(pwm)
	
})()


