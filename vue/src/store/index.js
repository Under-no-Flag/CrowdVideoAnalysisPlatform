import { createStore } from 'vuex'

export default createStore({
	state: {
		userInfo: localStorage.userInfo && localStorage.userInfo !== 'undefined' && JSON.parse(localStorage.userInfo) || null
	},

	mutations: {
		SET(state, { k, v }) {
			state[k] = v;
		},
		SET_AND_STORAGE(state, { sk, k, v, encode = 1 }) {
			state[k] = v;
			window.localStorage.setItem(sk || k, encode ? JSON.stringify(v) : v);
		},
	},
})