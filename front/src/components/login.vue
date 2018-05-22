<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <h3 class="title">物联网控制系统登录</h3>
        <el-form-item label="用户名" prop="name">
            <el-input v-model.number="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
	import { login } from '../lib/all_api'
	import { Form, FormItem, Input, Button } from 'element-ui'
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
					return callback(new Error('用户名不能为空'));
				}
			};
			let validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					callback();
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
				}
			};
		},
		methods: {
			async submitForm(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				})

				let info = await login(this.ruleForm.name, this.ruleForm.pass)
                if (info.data.success) {
	                localStorage.setItem('token', info.data.token)
	                this.$router.push('/')
                }

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style scoped lang="less">
    .title{
        padding: 20px;
        font-size: 1.3em;
    }
</style>