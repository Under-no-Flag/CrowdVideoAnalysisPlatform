export default Vue =>{
	const resizes = new Set();
	setInterval(() => {
		for (const el of resizes) {
			if (el.oWidth === el.clientWidth && el.oHeight === el.clientHeight) continue;
	
			el.oWidth = el.clientWidth;
			el.oHeight = el.clientHeight;
			if (typeof el.resizeFunc === 'function') el.resizeFunc(el);
		}
	}, 600)
	
	Vue.directive('resize', {
		bind(el, binding, vnode, old_vnode) {
			el.oWidth = el.clientWidth;
			el.oHeight = el.clientHeight;
			el.resizeFunc = binding.value;
			resizes.add(el)
		},
		unbind(el){
			resizes.delete(el);
		}
	})
}