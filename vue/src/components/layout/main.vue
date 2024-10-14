<style>
body,
html {
	width: 100%;
	min-width: 1000px;
	height: 100%;
	font-size: 14px;
}
</style>
<style lang="scss" scoped>
$color: rgb(48, 65, 86, 0.95);
$color2: rgb(255, 255, 255);


.n-main {
	width: 100%;
	overflow: hidden;
	height: 100%;
	background: #fafafa;
	@include n-row2;
	align-items: stretch;

	:deep(.n-nav) {
		.n-nav-routes {
			>li {
				color: rgba(255, 255, 255, 0.7);
			}

			>.n-nav-routes-check,
			>li:hover:not(.n-nav-subRoutes) {
				color: #fff;
			}
		}

		background: $color2 !important;
	}

	:deep(.n-slider-company) {
		background: $color !important;
		border-color: rgba(255, 255, 255, 0.3) !important;
	}

	:deep(.n-msg .el-dialog__header) {
		background: $color !important;
	}

	:deep(.n-slider-node-check) {
		color: #fff;
		border-right: none;
		// background: rgba(255,255,255,0.4);
	}

	:deep(.n-slider .n-slider-menu) {
		background: $color;
	}

	.n-main-right {
		flex: 1;
		width: 0;
		@include n-col1;
		align-items: stretch;

		:deep(.n-main-crumbs) {
			height: 36px;
			font-size: 14px;
			color: #bbb;
			padding: 0 20px;
			@include n-row1;

			>i {
				margin: 0 10px;
			}

			>span:last-child {
				color: $theme-color;
			}
		}

		>main {
			height: 0;
			flex: 1;
			overflow: auto;

		}

		>footer {
			font-size: 16px;
			padding: 0 20px;
			@include n-row2;
			height: 40px;
			color: #aaa;
		}

	}

	.anim-enter {
		transform: translate(10%);
		opacity: 0.3;
	}

	.anim-enter-active {
		transform-style: preserve-3d;
		transition: all 0.3s;
	}

	.anim-enter-to {
		transform: translate(0%);
		opacity: 1;
	}

	.anim-leave {
		transform: translate(0%);
		opacity: 1;
	}

	.anim-leave-active {
		transform-style: preserve-3d;
		transition: all 0.3s;

	}

	.anim-leave-to {
		transform: translate(10%);
		opacity: 0.1;
	}

	.n-main-logout {
		@include n-row3;
		font-size: 13px;
		margin-left: auto;
		color: #000000;

		>span {
			padding: 0 15px;
			cursor: pointer;

			&+span {
				border-left: 1px solid #ddd;
			}

			&:hover {
				color: $theme-color;
			}
		}

	}

}
</style>

<template>
	<div class="n-main">
		<n-slider @vue:mounted="getMenus()" v-show="showFrame" homeIcon="el-icon-eleme" title="同济大学"
			:intactSlider="intactSlider" />

		<div class="n-main-right">
			<n-nav v-show="showFrame" @delNavRoute="delNavRoute" @clearNavRoute="clearNavRoute" :compList="navCompList"
				v-model:intactSlider="intactSlider">
				<template #logout>
					<div class="n-main-logout">
						<span @click="edit">当前账号：{{ $store.state.userInfo && $store.state.userInfo.username }}</span>
						<span @click="logout">退出</span>
					</div>

				</template>
			</n-nav>
			<div class="n-main-crumbs" v-html="routerPaths"></div>
			<main>
				<router-view></router-view>
			</main>
			<footer>MIT©同济大学</footer>
		</div>
		<el-dialog title="用户信息" v-model="dialogFormVisible" width="500" :before-close="handleClose">
			<el-form :model="form" label-width="80px" size="small">
				<el-form-item label="密码">
					<el-input v-model="filteredList[0].password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="filteredList[0].email" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="filteredList[0].phone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input v-model="filteredList[0].address" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="handleClickAndCloseDialog">取消</el-button>
					<el-button type="primary" @click="save">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>


<script>
import { constantRoutes } from '@/router'
export default {
	data() {
		const intactSlider = JSON.parse(localStorage.intactSlider || '{}');
		return {
			intactSlider: !!intactSlider.PAGES,
			navCompList: [
				{ right: 1, type: "slot", slotName: 'logout' },
			],
			menus: this.$base.clone(constantRoutes.find(v => v.path === '/').children),
			showFrame: true,
			aliveRoutes: [],
			form: {},
			dialogFormVisible: false,
			headerBg: 'headerBg',
			listConf: [],
		}
	},

	watch: {
		intactSlider(v) {
			const intactSlider = JSON.parse(localStorage.intactSlider || '{}');
			intactSlider.PAGES = v;
			localStorage.setItem('intactSlider', JSON.stringify(intactSlider))
		},
	},
	created() {
		this.$bus.on('addAliveRoutes', r => !this.aliveRoutes.find(v => r.path === v.path) && (!r.meta || !r.meta.hide) && this.aliveRoutes.push(r))
		this.$bus.on('setShowFrame', v => this.showFrame = v);
		this.load();
	},
	computed: {
		routerPaths() {
			let paths = this.$base.getTreePath({ data: this.menus, id: 'path', id: this.$route.path, props: { id: 'path' } }) || [];
			if (this.$route.path !== '/home') {
				paths.unshift({ meta: { title: '首页' } })
			}
			paths = paths.map(v => v.meta && v.meta.title && `<span>${v.meta.title}</span>` || '').filter(v => v).join('<i>/</i>')
			return paths
		},
		filteredList() {
			const username = this.$store.state.userInfo.username;
			return this.listConf.filter(item => item.username === username);
		},
	},
	mounted() {
		while (this.aliveRoutes.length) {
			this.aliveRoutes.pop()
		}
	},
	beforeRouteLeave(to, from, next) {
		while (this.aliveRoutes.length) {
			this.aliveRoutes.pop()
		}
		this.$bus.emit('sliderMenu', [])
		this.$nextTick(() => next())
	},
	methods: {
		load() {
			this.$request.get("/user", {
				params: {}
			}).then(res => {
				this.listConf = res 
			})
		},

		async clearNavRoute() {
			while (this.aliveRoutes.length) {
				this.aliveRoutes.pop()
			}
			await this.$nextTick();
			this.menus[0].path === this.$route.path ? this.aliveRoutes.push(this.menus[0]) : this.$router.push(this.menus[0].path);
		},
		delNavRoute({ route }) {
			const idx = this.aliveRoutes.findIndex(v => v === route);
			if (idx === -1) return;

			const v = this.aliveRoutes[idx];
			this.aliveRoutes.splice(idx, 1);

			if (!this.menus[0]) return;

			if (this.aliveRoutes.length === 0) {
				if (this.menus[0].path === this.$route.path) return this.aliveRoutes.push({ ...this.menus[0], ...this.$route })
				return this.$router.push(this.menus[0].path)
			}
			if (v.path === this.$route.path) this.$nextTick(() => this.$router.push(this.aliveRoutes[0] && (this.aliveRoutes[0].fullPath || this.aliveRoutes[0].path) || this.menus[0].path));
		},
		getMenus() {
			this.$bus.emit('sliderMenu', this.menus);
		},
		logout() {
			this.$msg('已退出');
			this.$store.commit('SET_AND_STORAGE', { k: 'userInfo', v: '', encode: 0 });
			this.$router.replace('/login')
		},
		edit() {
			this.dialogFormVisible = true
		},
		handleClick(event) {
			// 点击后鼠标移开恢复按钮默认样式(如果按钮没有加icon图标的话，target.nodeName == "I"可以去掉)
			let target = event.target;
			if (target.nodeName == "I" || target.nodeName == "SPAN") {
				target = event.target.parentNode;
			}
			target.blur();
			//进行其他操作
		},
		handleClickAndCloseDialog(event) {
			// 点击后鼠标移开恢复按钮默认样式  
			let target = event.target;
			if (target.nodeName == "I" || target.nodeName == "SPAN") {
				target = event.target.parentNode;
			}
			// 移除焦点  
			if (target && target.blur) {
				target.blur();
			}
			// 关闭对话框  
			this.dialogFormVisible = false;
		},
		save(event) {
			this.handleClick(event)
			this.$request.post("/user", this.filteredList[0]).then(res => {
				if (res) {
					this.$message.success("保存成功")
					this.dialogFormVisible = false
					this.load()
				} else {
					this.$message.error("保存失败")
				}
			})
		},

	},


}


</script>