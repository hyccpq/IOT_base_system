<template>
    <div>
        <div class="led-bgc" :style="{backgroundColor : `rgb(${bgc}, ${bgc}, ${bgc})`}"></div>
        <div class="led-img">
            <img src="../../public/led.png" alt="" :style="{ filter: `brightness(${value+30}%)` }">
        </div>
        <div class="block">
            <el-slider
                :max="255"
                :min="0"
                v-model="value"
                show-input
                :debounce="10"
                :disabled="!ledState"
            >
            </el-slider>
        </div>
        <el-switch
            style="display: block"
            v-model="ledState"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="关灯"
            inactive-text="开灯"
            @change="changeState"
        >
        </el-switch>
    </div>

</template>

<script>
    import { Slider, Switch } from 'element-ui'
	export default {
		name: "ledComponent",
        components: {
			elSlider: Slider,
            elSwitch: Switch,
            ws: {}
        },
        data() {
			return {
				value: 0,
                ledState: false
            }
        },
        watch:{
			value () {
				this.sendState()
            }
        },
        computed:{
		    bgc(){
		    	return (this.value) * 155 / 255 + 100
            }
        },
        mounted(){
			this.ws = new WebSocket('ws://localhost:2334')
                // console.log("新建一个")
            this.ws.onopen = ev => {
				console.log('连接已经打开');
            }
            this.ws.onmessage = ev => {
                let ledConf = JSON.parse(ev.data)
                this.ledState = ledConf.ledState
                this.value = ledConf.pwm
            }
        },
        beforeDestroy(){
		    console.log("断开socket")
		    this.ws.close()
            this.ws = {}
        },
        methods: {
			changeState() {
				if(this.ledState){
					this.value = 100
                } else {
					this.value = 0
                }
                this.sendState()
            },
			sendState(){
				let ledConf = {
                    ledState: this.ledState,
                    pwm: this.value
                }

				this.ws.send(JSON.stringify(ledConf))

            }
        }
	}
</script>

<style scoped>
.led-img {
    margin: 50px auto;
    width: 222px;
}
.led-bgc{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -2;
}
</style>