<style lang="scss" scoped>
.n-nav {
	background: linear-gradient(90deg, $theme-color, #3ff);
	height: 60px;
	@include n-row1;
	padding: 0 20px;

	>i,
	:deep(>.el-badge) {
		font-size: 24px;
		font-weight: 100;
		color: #fff;
	}

	.n-nav-right {
		margin-left: auto;
	}

	:deep(>.el-badge)+*,
	>i+* {
		margin-left: 20px;
	}

	.n-nav-check,
	i:hover {
		color: #fff;
		text-shadow: 0 0 5px #fff;
	}

	.n-nav-screening {
		@include n-row1;

		:deep(.el-select) {
			margin: 0 10px;
			line-height: 32px;
			text-align: center;

			input {
				height: 32px;
				border-radius: 40px;
			}

			.el-input__suffix i {
				line-height: 32px;
			}
		}
	}

	.n-nav-routes {
		height: 100%;
		@include n-row1;
		overflow-x: auto;
		align-items: stretch;

		>li {
			white-space: nowrap;
			padding: 0 40px;
			color: rgba(255, 255, 255, 0.7);
			@include n-row5;
			cursor: pointer;
			font-size: 16px;
			position: relative;
			margin-left: 10px;

			>i {
				position: absolute;
				right: 10px;
				top: 50%;
				transform: translate(0, -50%);
				font-size: 14px;
				margin-left: 40px;
			}

			>i:hover {
				font-weight: bold;
			}
		}

		>.n-nav-routes-check,
		>li:hover {
			color: #fff;
			text-shadow: 0 0 2px #fff;
			border-bottom: 3px solid #eee;
			padding-top: 3px;
		}

	}

	.n-nav-subRoutes {
		z-index: 100;
		position: relative;
		padding: 0 10px;

		>i {
			margin: 0;
			font-size: 20px;
			color: #eee;

			&:hover {
				color: #fff;
				text-shadow: 0 0 2px #fff;
			}
		}

		>ul {
			z-index: 100;
			@include shadow;
			transition: all 0.3s;
			background: #fff;
			min-width: 120px;
			white-space: nowrap;
			position: absolute;
			top: 100%;
			color: #777;
			overflow: hidden;
			left: 0;

			>li {
				height: 50px;
				width: 100%;
				@include n-row2;
				padding: 0 20px;
				cursor: pointer;

				>i {
					font-size: 14px;
					color: #dadada;
					margin-left: 20px;
				}

				>span {
					white-space: nowrap;
					display: inline-block;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 100px;
				}

				>i:hover {
					color: $theme-color;
				}
			}

			>li:hover {
				background-color: #e8f4ff;
			}

			>.n-nav-routes-check {
				color: $theme-color;
				background-color: #e8f4ff;
			}
		}

	}

	.n-nav-routes-clear {
		font-size: 17px;
		margin: 0 10px;
		@include n-row2;
		margin-right: 20px;
		color: #eee;
	}
}

.custom-black-icon {
	color: black !important;
	/* 使用 !important 可以确保这个样式优先级最高，但最好避免过度使用 */
}
</style>

<style>
.n-nav-msg {
	background: #f00;
}
</style>
<template>
	<div class="n-nav">
		<el-icon @click="$emit('update:intactSlider', !intactSlider)">
			<component :is="intactSlider ? 'Expand' : 'Fold'" style="color: black;"></component>
		</el-icon>
		<template v-for="item, idx in compList">
			<div :key="'n-nav-comp' + idx" :class="['n-nav-screening', item.right ? 'n-nav-right' : '']"
				v-if="item.type === 'screening'">
				<el-select v-show="!sel.showFun || sel.showFun({ sel, item, params })" v-for="sel, idx in item.selects "
					:key="'n-nav-comp-sel' + idx" clearable v-model="params[sel.k]" v-bind="sel.props"
					v-on="onEvent(sel)">
					<el-option :label="opt.label" :value="opt.value" v-for="opt, idx in sel.options"
						:key="'n-nav-comp-sel-opt' + idx" />
				</el-select>
			</div>
			<ul :key="'n-nav-comp' + idx" v-if="item.type === 'aliveRoutes'"
				:class="['n-nav-routes', item.right ? 'n-nav-right' : '']">
				<li v-if="!item.noMenu" @click="link({ btn: { link: r.fullPath || r.path } })"
					:class="{ 'n-nav-routes-check': $base.getRouteCacheKey(r) === $base.getRouteCacheKey($route) }"
					v-for="r, idx2 in item.aliveRoutes.slice(0, (item.max || 5))" :key="'n-nav-comp-route1' + idx2">
					<span>{{ r.meta ? r.meta.title : '菜单' }}</span>
					<el-icon @click.stop="btnClick({ btn: { clickKey: 'delNavRoute' }, route: r })">
						<Close />
					</el-icon>
				</li>
			</ul>
			<div :key="'n-nav-comp-sub' + idx" @mouseenter="aliveMenuMouse(1)" @mouseleave="aliveMenuMouse()"
				class="n-nav-subRoutes"
				v-if="item.type === 'aliveRoutes' && item.aliveRoutes.length > (item.noMenu ? 0 : item.max || 5)">
				html
				<el-icon>
					<ArrowDown />
				</el-icon>
				<ul
					:style="{ 'height': `${subRoutesHover ? (item.aliveRoutes.length - (item.noMenu ? 0 : item.max || 5)) * 50 : 0}px` }">
					<li @click="link({ btn: { link: r.fullPath || r.path } })"
						:class="{ 'n-nav-routes-check': $base.getRouteCacheKey(r) === $base.getRouteCacheKey($route) }"
						v-for="r, idx2 in item.aliveRoutes.slice(item.noMenu ? 0 : item.max || 5)"
						:key="'n-nav-comp-route2' + idx2">
						<span>{{ r.meta ? r.meta.title : '菜单' }}</span>
						<el-icon @click.stop="btnClick({ btn: { clickKey: 'delNavRoute' }, route: r })">
							<Close />
						</el-icon>
					</li>
				</ul>
			</div>
			<el-tooltip v-if="item.type === 'aliveRoutes'" :key="'n-nav-comp-sub2-' + idx" effect="dark"
				content="关闭全部菜单">
				<el-icon @click="btnClick({ btn: { ...item, clickKey: 'clearNavRoute' } })">
					<Close />
				</el-icon>
			</el-tooltip>
			<i :key="'n-nav-comp' + idx" v-if="item.type === 'icon'" @click="btnClick({ btn: item })"
				:class="[item.icon, item.right ? 'n-nav-right' : '']"></i>
			<i :key="'n-nav-comp' + idx" v-if="item.type === 'fullScreen'"
				:class="{ 'el-icon-full-screen': 1, 'n-nav-check': item.open, 'n-nav-right': item.right }"
				@click="item.open = !item.open"></i>
			<slot :name="item.slotName" v-if="item.type === 'slot'" :item="item" :vm="vm"></slot>
		</template>
		<n-msg v-if="isMsg" ref="msg" :system_alias="isMsg.systemAlias" />
	</div>
</template>

<script>

export default {
	props: {
		intactSlider: {
			type: Boolean,
		},
		params: {
			type: Object,
			default: () => ({})
		},
		compList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			subRoutesHover: 0,
			aliveMenuMouseTime: null,
		}
	},
	computed: {
		isFullScreen() {
			return this.compList.find(v => v.type === 'fullScreen');
		}
	},
	watch: {
		'isFullScreen.open'(v, v2) {
			const el = document.querySelector('body');
			v ?
				el.requestFullScreen && el.requestFullScreen() || el.webkitRequestFullScreen && el.webkitRequestFullScreen() || el.mozRequestFullScreen && el.mozRequestFullScreen() || el.msRequestFullScreen && el.msRequestFullScreen() :
				document.cancelFullScreen && document.cancelFullScreen() || document.webkitCancelFullScreen && document.webkitCancelFullScreen() || document.mozCancelFullScreen && document.mozCancelFullScreen() || document.exitFullScreen && document.exitFullScreen()
		}
	},
	methods: {
		onEvent(item) {
			if (!item.on || item.isHandlerOn) return item.on;
			item.isHandlerOn = true;
			Object.keys(item.on).forEach(k => item.on[k] = item.on[k].bind(this, { item, vm: this }))
			return item.on;
		},
		btnClick(conf) {
			const clickKey = conf.btn.clickKey;
			this[clickKey] && this[clickKey](conf);
			this.$emit(clickKey, conf)
			this.$router.push('/login')
		},
		link({ btn }) {
			this.$router.push(btn.link)
		},
		aliveMenuMouse(on) {
			if (!on) return this.aliveMenuMouseTime = setTimeout(() => this.subRoutesHover = 0, 300);
			this.subRoutesHover = 1;
			clearTimeout(this.aliveMenuMouseTime);
		}
	},
}
</script>
