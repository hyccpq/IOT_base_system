<template>
    <nav id="nav">
        <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
            <h2 class="title">何洋臣的物联网小站</h2>
            <el-menu-item index="1" class="right-menu">关于本站</el-menu-item>
            <el-submenu index="2" class="right-menu">
                <template slot="title">详细分类</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
                <el-submenu index="2-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="2-4-1">选项1</el-menu-item>
                    <el-menu-item index="2-4-2">选项2</el-menu-item>
                    <el-menu-item index="2-4-3">选项3</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="3" disabled class="right-menu">消息中心</el-menu-item>
            <el-menu-item index="4" class="right-menu">
                关于
            </el-menu-item>
        </el-menu>
    </nav>


</template>

<script>
	import {
		Menu,
		MenuItem,
		Submenu
	} from 'element-ui'
	export default {
		name: "my-nav",
		components: {
			elMenu: Menu,
			elMenuItem: MenuItem,
			elSubmenu: Submenu
		},
		data() {
			return {
				activeIndex: '5',
				isShowLogin: false
			};
		},
		methods: {
			handleSelect(key, keyPath) {
				console.log(key);
				if(key == 4){
					console.log(key);
					this.loginChange();
				}
			},
			loginChange(){
				this.isShowLogin = !this.isShowLogin
			}
		}
	}
</script>

<style scoped lang="less">
    #nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;

        .el-menu {
            .title {
                float: left;
                line-height: 60px;
                padding: 0 30px;
                color: #295687;
            }

            .right-menu {
                float: right;
            }
        }
    }
    .my-form{
        width: 500px;
        height: 300px;
        margin: 80px auto;
        background-color: #fff;
    }

</style>