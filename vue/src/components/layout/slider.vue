<style lang="scss" scoped>
.n-slider {
	@include n-col1;
	align-items: stretch;
	z-index: 10;
	transition: width 0.3s;

	.n-slider-company {
		@include n-row2;
		height: 60px;
		cursor: pointer;
		border-right: 1px solid #555;
		background: rgb(10, 170, 195);
		color: #eee;
		font-size: 25px;
		font-weight: 100;
		white-space: nowrap;
		overflow: hidden;
		@include n-row2;

		>img {
			height: 40px;
		}

		i {
			text-shadow: 0 0 7px #fff;
			color: #fff;
			font-size: 30px;
		}

		>span {
			margin-left: 5px;
		}
	}

	.n-slider-menu {
		flex: 1;
		background: #fff;
		height: 0;
		box-shadow: 0px 2px 1px 1px rgba(0, 0, 0, 0.03);

		:deep(.el-menu) {
			border: none;
		}

	}

	.n-slider-menu::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}



}
</style>


<template>
	<div class="n-slider" :style="{ width: intactSlider ? '60px' : '180px' }">
		<div class="n-slider-company" @click="goTocup">
			<img src="@/assets/img/2.png" />
			<span v-if="!intactSlider">{{ title }}</span>
		</div>
		<div class="n-slider-menu" :style="{ 'overflow-y': intactSlider ? 'visible' : 'scroll' }">
			<n-slider-node v-for="item in menuList.filter(v => !v.meta || !v.meta.hide)" :key="item.path" :menu="item"
				top />
		</div>

	</div>
</template>

<script>
export default {
	props: {
		homeIcon: {
			type: String,
			default: 'el-icon-s-home'
		},
		intactSlider: {
			type: Boolean,
		},
		title: String,
	},
	data() {
		return {
			menuList: [],
			curr: '',
		}
	},
	provide() {
		return {
			slider: this,
		}
	},
	watch: {
		'$route'(v) {
			if (!this.posiMenu(v.path)) this.curr = '';
		},
		curr(v) {
			if (!v) return;
			this.posiMenu(v.path);
			let aliveRoute = { ...v, ...this.$route };
			if (this.$route.path !== v.path) {
				aliveRoute = v;
				this.$router.push(v.path);
			}
			this.$bus.emit('addAliveRoutes', aliveRoute)
		}
	},
	created() {
		this.$bus.on('sliderMenu', routes => {
			this.menuList = this.initMenus(routes);
			this.$nextTick(() => this.posiMenu(this.$route.path))
		})
	},
	methods: {
		// 初始化菜单
		initMenus(menus) {
			return menus.filter(menu => {
				if (menu.name === 'no-permission') {
					return false; // 跳过名为 ''no-permission' 的路由  
				}
				if (menu.children) {
					menu.children = this.initMenus(menu.children); // 递归处理子菜单  
				}
				return true;
			});
		},
		// 定位目标菜单
		posiMenu(path, menus = this.menuList) {
			for (const v of menus) {
				if (v.path === path) return this.curr = v
				if (v.children) {
					const res = this.posiMenu(path, v.children);
					if (res) return v.open = true;
				}
			}
			return false;
		},
		goTocup() {
			window.location.href = 'https://www.tongji.edu.cn/';
		}
	},
}
</script>
