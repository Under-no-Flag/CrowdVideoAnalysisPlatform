import {
	createWebHashHistory,
	createRouter
} from "vue-router"
import { KeepAlive, h, resolveComponent } from 'vue'
import store from '@/store/index'
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

export const constantRoutes = [
	{
		path: "/login",
		component: () => import("@/views/login.vue"),
		meta: {
			title: "登录",
			hide: true,
		}
	},
	{
		path: "/",
		component: () => import('@/components/layout/main.vue'),
		redirect: '/home',
		meta: {
			title: "",
		},
		children: [
			{
				path: "/home",
				component: () => import("@/views/Home/home.vue"),
				meta: {
					title: "首页",
					icon: 'House'
				}
			},
			{
				path: "/sys",
				redirect: '/sys/user',
				component: { render: () => h(resolveComponent('router-view')) },
				meta: {
					title: "系统管理",
					icon: 'Setting'
				},
				children: [
					{
						path: "/sys/user",
						component: () => import("@/views/sys/user.vue"),
						meta: {
							title: "用户管理",
							icon: "UserFilled",
							requiresAuth: true,
						}
					},

				]
			},
			{
				path: '/no-permission',
				name: 'no-permission',
				component: () => import("@/views/nopermission.vue"),
				meta: {
					title: "无权限",
					icon: 'CircleCloseFilled'
				}
			},
		],

	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes
})

router.beforeEach(async (to, from, next) => {
	document.title = to.meta.title;

	// 对于登录和404页面，直接放行  
	if (['/login', '/404'].includes(to.path)) {
		return next();
	}

	// 检查用户信息是否存在  
	if (!store.state.userInfo) {
		// 如果用户信息不存在且目标路由不是登录页，则重定向到登录页  
		if (to.path !== '/login') {
			// 如果来源页面不是登录页，则使用replace进行无历史记录跳转  
			if (from.path !== '/login') {
				return router.replace({ path: '/login' });
			}
			// 如果来源页面是登录页，则直接放行，可能是用户在登录页刷新了页面  
			return next();
		}
	}

	// 如果用户已登录，或者目标路由不需要登录，则直接放行  
	next();
});


router.beforeEach((to, from, next) => {
	// 检查路由是否需要权限  
	if (to.matched.some(record => record.meta.requiresAuth)) {
		// 需要权限的路由，检查用户权限  
		axios.get('/user')
			.then(response => {
				const hasPermission = response.data.some(user =>
					user.username === store.state.userInfo.username && user.role === '管理员'
				);
				if (hasPermission) {
					next(); // 有权限，继续路由导航  
				} else {
					next('/no-permission');  
				}
			})
			.catch(error => {
				console.error(error); // 处理请求错误  
				next('/no-permission'); 
			});
	} else {
		next(); // 不需要权限的路由，直接继续导航  
	}
});

export default router
