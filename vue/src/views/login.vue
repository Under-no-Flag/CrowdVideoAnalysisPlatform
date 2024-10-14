<style lang="scss" scoped>
.login {
	background: url(../assets/img/1.png) no-repeat center/cover;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	@include n-row2;

	.login-form {
		width: 400px;
		position: relative;
		background: #fff;
		box-shadow: 0 0 20px 3px rgba(0, 0, 0, 0.07);
		border-radius: 10px;
		padding: 40px;

		>h1 {
			@include n-row2;
			margin-bottom: 40px;

			>img {
				height: 50px;
			}
		}

		:deep(> div) {
			>* {
				display: block;
				width: 100%;
			}

			.el-input {
				margin-bottom: 20px;

				>* {
					width: 100%;
				}

				.el-input__prefix,
				.el-input__suffix {
					color: inherit;
					font-size: 20px;
					margin-left: 5px;
				}
			}

			>button {
				height: 36px;
				color: #fff;
				margin-top: 30px;
				border-radius: 3px;
				@include n-row2;
				font-size: 15px;
				background: $theme-color;
			}
		}

	}

}

.custom-form-item {
	margin-bottom: 20px;
	padding-bottom: 0px;
}
</style>
<template>
	<div class="login">

		<div class="login-form">
			<h1><img src="@/assets/img/3.png" /></h1>

			<div>
				<el-form :model="user" :rules="rules" ref="userForm">
					<el-form-item class="custom-form-item" prop="username">
						<el-input size="large" v-model="user.username" type="text" placeholder="请输入账号">
							<template #prefix>
								<el-icon>
									<User />
								</el-icon>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item class="custom-form-item" prop="password">
						<el-input size="large" v-model="user.password" type="password" show-password
							placeholder="请输入密码">
							<template #prefix>
								<el-icon>
									<Key />
								</el-icon>
							</template>
						</el-input>
					</el-form-item>
				</el-form>
				<button @click="login()" v-loading="loading">登录</button>
			</div>

		</div>


	</div>

</template>

<script>
export default {
	data() {
		return {
			user: {
				username: '',
				password: ''
			},
			loading: false,
			rules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
				],
			}
		}
	},

	components: {
	},
	mounted() {
		if (this.$store.state.userInfo) this.$router.replace('/')
	},
	methods: {
		async login() {
			const { username, password } = this.user;
			if (!username || !password) return this.$msg('请完善信息！', 3)


			this.$refs['userForm'].validate((valid) => {
				if (valid) {  // 表单校验合法
					this.$request.post("/user/login", this.user).then(res => {
						if (!res) {
							this.$message.error("用户名或密码错误")
						} else {
							this.$router.push("/")
							this.$store.commit('SET_AND_STORAGE', { k: 'userInfo', v: { password, username } });
						}
					})
				} else {
					return false;
				}
			});
		}
	},


}
</script>
