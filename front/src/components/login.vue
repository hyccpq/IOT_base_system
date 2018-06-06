<template>
    <div id="login">
        <canvas id="background"></canvas>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <h3 class="title">物联网控制系统登录</h3>
            <el-form-item label="用户名" prop="name">
                <el-input v-model.number="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>



<script>
	import { login } from '../lib/all_api'
	import { Form, FormItem, Input, Button } from 'element-ui'
    import Praticles from 'particlesjs'
	export default {
		name: "myform",
		components:{
			elForm:Form,
			elFormItem:FormItem,
			elInput:Input,
			elButton:Button
		},
		data() {
			let checkName = (rule, value, callback) => {
				if (!value) {
					callback(new Error('用户名不能为空'));
				}
			};
			let validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				}
			};
			return {
				ruleForm: {
					pass: '',
					name: ''
				},
				rules: {
					pass: [
						{ validator: validatePass, trigger: 'blur' }
					],
					name: [
						{ validator: checkName, trigger: 'blur' }
					]
				},
                bgOption: {
	                selector: '#background',
	                // maxParticles: 450,
	                color: ['#DA0463', '#f8ba45', '#63d5f3'],
	                connectParticles: true,
	                // options for breakpoints
	                responsive: [{
		                breakpoint: 800,
		                options: {
			                color: '#00C9B1',
			                maxParticles: 80,
			                connectParticles: false
		                }
	                }]
                }
			}
		},
		mounted(){
			Praticles.init(this.bgOption)
		},
        destroyed(){
		    // delete Praticles
        },
		methods: {
			async submitForm() {

				if (this.ruleForm.pass && this.ruleForm.name) {

					let info = await login(this.ruleForm.name, this.ruleForm.pass)
					if (info.data.success) {
						localStorage.setItem('token', info.data.token)
                        localStorage.setItem('user', info.data.username)
						this.$notify({
							title: '成功',
							message: '登录成功，欢迎回来！',
							type: 'success'
						})
						this.$router.push('/')
					} else {
						this.$notify.error({
							title: '错误',
							message: '用户名或密码错误'
						});
					}
				} else {
					this.$notify.error({
						title: '错误',
						message: '请填入正确的信息'
					})
				}
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style scoped lang="less">
    #login {
        width: 100%;
        height: 100%;
        #backgroud {
            position: fixed;
            display: block;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 0;
        }
        .demo-ruleForm {
            position: fixed;
            left: 50%;
            top:50%;
            width: 500px;
            height: 500px;
            margin: -250px 0 0 -250px;
            z-index: 2;
        }
        .title{
            padding: 45px;
            font-size: 1.3em;
            text-align: center
        }
    }

</style>