<template>
    <nav id="nav">
        <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
            <h2 class="title">何洋臣的物联网小站</h2>
            <el-menu-item index="1" class="right-menu">关于本站</el-menu-item>
            <el-submenu index="2" class="right-menu">
                <template slot="title">详细分类</template>
                <el-menu-item index="2-1">LED模块</el-menu-item>
                <el-menu-item index="2-2">温度模块</el-menu-item>
                <el-menu-item index="2-3">摄像头云台</el-menu-item>

            </el-submenu>
            <el-menu-item index="3" class="right-menu">登出</el-menu-item>
            <el-menu-item index="4" class="right-menu">
                欢迎您，{{ name }}
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
				isShowLogin: false,
                name: localStorage.getItem('user')
			};
		},
		methods: {
			handleSelect(key, keyPath) {
				console.log(key)
				switch (key){
                    case '1':
                    	this.$notify.success({
                            title: '还没有呢！'
                        })
                        break
                    case '3':
                    	this.openUnLogin()

                    	break
                    case '4':
                    	this.$notify.success({
                            title: '你好啊！'
                        })
                        break
                }

			},
			openUnLogin() {
				this.$confirm('此操作将退出系统, 是否继续?', '提示', {
					confirmButtonText: '确 定',
					cancelButtonText: '取 消',
					type: 'warning'
				}).then(() => {
					localStorage.removeItem('token')
                    this.$notify({
						type: 'success',
						message: '登出成功!'
					})
					this.$router.replace('/login')
				}).catch(() => {
					this.$notify({
						type: 'info',
						message: '已取消'
					})
				})
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