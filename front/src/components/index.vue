<template>
    <el-container class="center">
        <el-header style="padding: 0">
            <my-nav></my-nav>
        </el-header>
        <el-container class="main">
            <el-aside width="200px">
                <my-menu />
            </el-aside>
            <el-main class="my-main">
                <router-view />
            </el-main>
        </el-container>
        <el-footer class="my-footer">@2018 何洋臣的物联网小站</el-footer>
    </el-container>

</template>

<script>
    import { Container, Header, Aside, Main, Footer } from 'element-ui'
    import myMenu from './layout/aside'
    import myNav from './layout/nav'
	export default {
		name: "index",
        components: {
			elContainer: Container,
            elHeader: Header,
            elAside: Aside,
            elMain: Main,
            elFooter: Footer,
            myMenu,
            myNav
        }
	}
</script>

<style scoped>
    .my-footer {
        line-height: 60px;
        text-align: center;
        border-top: #e9e9e9 solid 1px;
        background-color: #fff;
    }
    .my-main {
        height: inherit;
    }
    .center {
        height: 100%;
    }
</style>