<template>
    <div>
        <h1 class="title">欢迎登录本站</h1>
        <p class="content">以下是对本设计的一点点介绍:</p>
        <ul class="content">
            <li>1.Led开关灯亮度调节</li>
            <li>2.温度实时数据及曲线</li>
            <li>3.摄像头监控跟随人脸</li>
        </ul>
    </div>

</template>

<script>
	export default {
		name: "welcome"
	}
</script>

<style scoped>
    div{
        text-align: center;
    }
    .title{
        font-size: 2rem;
        line-height: 3rem;
    }
    .content {
        font-size: 1.2rem;
        line-height: 2.5rem;
    }
</style>