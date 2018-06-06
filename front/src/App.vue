<template>
    <!--<div>哈哈哈哈</div>-->
    <router-view />

</template>

<script>
	export default {
		name: "app"
	}
</script>

<style>
    html *{
        padding: 0;
        margin: 0;
    }
    a{
        text-decoration:none;
        color:#333;
    }
    li{
        list-style: none;
    }
    html,body {
        width: 100%;
        height: 100%;
    }

</style>