<template>
    <el-row class="tac">
        <el-col :span="24" class="colhe">
            <el-menu
                default-active="1"
                class="el-menu-vertical"
                @select="handleOpen"
            >
                <h3 class="aside-title">系统菜单</h3>
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">Led模块</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-document"></i>
                    <span slot="title">温度模块</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span slot="title">摄像头云台</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
    import { Row, Col, Menu, MenuItem } from 'element-ui'
	export default {
		name: "myMenu",
        components: {
			elRow: Row,
            elCol: Col,
            elMenu: Menu,
            elMenuItem: MenuItem
		},
        methods: {
			handleOpen(key) {
				switch (key) {
                    case '1':
                    	this.$router.push('/welcome')
                        break

                    case '2':
                    	this.$router.push('/ledController')
                        break

                    case '3':
                    	this.$router.push('/temController')
                        break

                    case '4':
                    	this.$router.push('/ledController')
                        break
                }

            }
        }
	}
</script>

<style scoped lang="less">
    .tac {
        height: 100%;
        .colhe {
            height: 100%;
            .el-menu-vertical {
                height: 100%;
                .aside-title {
                    margin: 1rem auto 0 auto;
                    text-align: center;
                }
            }
        }

    }
</style>