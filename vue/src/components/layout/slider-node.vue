<style lang="scss" scoped>
@mixin line {
	width: 100%;
	height: 60px;
	white-space: nowrap;
	user-select: none;
	font-size: 15px;
}

.n-slider-node {
	@include line;
	height: auto;
	position: relative;
	transition: all 0.5s;
	color: #666;

	.n-slider-node-line {
		@include line;
		@include n-row5;
		padding: 0 24px;
		cursor: pointer;

		>i {
			transition: all 0.5s;
			margin-right: 10px;
		}

		>span {
			@include n-row1;
			color: rgb(191, 203, 217);

			>i {
				width: 40px;
				margin-left: 3px;
				font-size: 19px;
				@include n-row2;
			}
		}
	}

	.n-slider-node-line.n-slider-node-check {
		background-color: #263445 !important;

		span {
			color: rgb(64, 158, 255);
		}

	}

	.n-slider-node-line:hover {
		background-color: #263445 !important
	}

	.n-slider-sub {
		width: 100%;
		transition: height 0.5s;
		overflow: hidden;
	}

	&:hover>.n-slider-subRight {
		opacity: 1;
		box-shadow: 4px 4px 16px 1px rgba(0, 0, 0, 0.12);
		display: block;
		width: 160px;
		opacity: 1;
		overflow: visible;
		transform: translate(100%);
	}

	.n-slider-subRight {
		position: absolute;
		transition: all 0.5s;
		background: #263445;
		max-height: 360px;
		top: 0;

		width: 0px;
		opacity: 0;
		border-radius: 3px;
		right: 0;
		transform: translate(90%);

		.n-slider-seat {
			display: none !important;
		}
	}


}

.n-slider-node-check {
	border-right: 4px solid $theme-color;
	color: $theme-color;
}

.custom-black-icon {
	color: white !important;
}
</style>

<template>
	<div class="n-slider-node">
		<div :style='{ "padding-left": padLeft + "px" }'
			:class="{ 'n-slider-node-check': slider.curr.path === menu.path, 'n-slider-node-line': 1 }"
			@click='changeMenu()'>
			<span>
				<el-icon v-if="menu.meta.icon" :size="size" :color="color">
					<component :is="menu.meta.icon"></component>
				</el-icon>
				<el-icon v-else :size="size" :color="color">
					<View />
				</el-icon>
				<span v-show="!slider.intactSlider || !top">{{ menu.meta.title }}</span>

			</span>
			<el-icon class="custom-black-icon" v-show="children.length" :style='{ transform: menu.open ? "rotateZ(90deg)" : "" }'>
				<ArrowRight />
			</el-icon>
		</div>
		<!-- 展开侧边栏时候的下拉菜单  固定在下边-->
		<div class="n-slider-sub" :style="{ height: (slider.intactSlider ? 0 : subMenuHeight) + 'px' }"
			v-if="children.length">
			<n-slider-node v-for="item in children " :menu='item' :key='item.path' :pad-left="padLeft + 10" />
		</div>
		<!-- 不展开侧边栏时候的下拉菜单   固定在右边 -->
		<div class="n-slider-subRight"
			:style="{ height: children.length * 60 + 'px', overflow: children.length * 60 <= 360 ? 'hidden' : 'auto' }"
			v-if="children.length" v-show="slider.intactSlider">
			<n-slider-node v-for="item in children " :menu='item' :key='item.path' :pad-left="10" />
		</div>
	</div>
</template>
<script>
export default {
	props: {
		padLeft: {
			type: Number,
			default: 0
		},
		top: Boolean,
		menu: {
			type: Object,
			default: () => ({})
		}
	},
	inject: ['slider'],
	computed: {
		menuHeight() {
			let [h, i, arr] = [0, 0, [this.menu]];
			while (i < arr.length) {
				const v = arr[i];
				if (!v.meta || !v.meta.hide) h += 1;
				if (v.open && v.children && v.children.length) arr.push(...v.children);
				i++;
			}
			return (this.slider.intactSlider ? 1 : h) * 60;
		},
		subMenuHeight() {
			let [h, i, arr] = [0, 0, [this.menu]];
			while (i < arr.length) {
				const v = arr[i];
				if (!v.meta || !v.meta.hide) h += 1;
				if (v.open && v.children && v.children.length) arr.push(...v.children);
				i++;
			}
			return (h - 1) * 60;
		},
		children() {
			return this.menu.children ? this.menu.children.filter(v => !v.meta || !v.meta.hide) : []
		}
	},
	data() {
		return {
			hover: 0,
		}
	},
	mounted() {

	},
	methods: {
		changeMenu() {
			if (!this.slider.intactSlider) this.menu.open = !this.menu.open;
			if (!this.children.length) this.slider.curr = this.menu
		}
	}

}
</script>
