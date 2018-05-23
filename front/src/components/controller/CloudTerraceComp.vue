<template>
    <div>
        <h2>人脸识别</h2>
        <div class="left">
            <video width="800" height="600" id="video" ref="video"></video>
            <canvas id="myCanvas"
                    width="800"
                    height="600"
                    ref="canvas"
                    style="border:1px solid #d3d3d3;background:#ffffff;display:none">
            </canvas>
            <div class="frame-posi" v-show="isShow" :style="frame">
                <div class="frame-wrap">
                    <div class="bdr bdr1"></div>
                    <div class="bdr bdr2"></div>
                    <div class="bdr bdr3"></div>
                    <div class="bdr bdr4"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "CloudTerraceComp",
        data(){
		    return {
			    constraints: {
				    audio: false,
				    video: true,

			    },
			    frame: {},
			    isShow: false,
                ws: {},
                timer: 0
            }
        },
        mounted(){
            navigator.mediaDevices.getUserMedia(this.constraints)
                .then(this.successCallback)
                .catch(this.errorCallback);
            this.getScreen()
            this.ws = new WebSocket('ws://localhost:2337')
                // console.log("新建一个")
            this.ws.onopen = ev => {
				console.log('连接已经打开');
            }
            this.ws.onmessage = ev => {
                let servoConf = JSON.parse(ev.data)
                    // console.log(servoConf)
                this.isShow = servoConf.isShow
                this.frame = servoConf.info
                // this.ledState = ledConf.ledState
                // this.value = ledConf.pwm
            }
            this.timer = setInterval(() => {
            	let img = this.$refs.canvas.toDataURL('image/jpeg')

                this.ws.send(img)
            }, 150)
        },
        beforeDestroy(){
		    console.log("断开socket")
            clearInterval(this.timer)
		    this.ws.close()
            this.ws = {}
        },
        methods: {
			successCallback(stream) {
                this.$refs.video.srcObject = stream;
                this.$refs.video.play();
            },

            errorCallback(error) {
                console.log("navigator.getUserMedia error: ", error);
            },

            getScreen() {
				let ctx = this.$refs.canvas.getContext('2d')
                ctx.drawImage(this.$refs.video, 0, 0, 800, 600)
                window.requestAnimationFrame(this.getScreen)
            }
        }
	}
</script>

<style scoped>

.left {
    height: 100%;
    overflow: auto;
    position: relative;
}

.left {
    width: 800px;
    background-color: #ffffff;
}

.frame-posi {
    position: absolute;
    left: -300px;
    top: -300px;
    width: 100px;
    height: 100px;
    background-color: rgba(255, 104, 110, 0.41);
    z-index: 3;
}

.frame-wrap {
    width: 100%;
    height: 100%;
    position: relative;
}

.bdr {
    width: 20%;
    height: 20%;
    border: 2px solid red;
    position: absolute;
}

.bdr1 {
    left: 0;
    border-right: 0;
    border-bottom: 0;
}

.bdr2 {
    right: 0;
    border-left: 0;
    border-bottom: 0;
}

.bdr3 {
    bottom: 0;
    border-top: 0;
    border-right: 0;
}

.bdr4 {
    bottom: 0;
    right: 0;
    border-left: 0;
    border-top: 0;
}
</style>