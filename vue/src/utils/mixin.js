export default{
	
	methods:{
		async _req(p, tg = this, code = 0) {
			if (!p) return false
			tg = tg || this
		
			tg.loading = true
			const res = await p
			tg.loading = false
			return res.code === code && res
		}
		
		
	}
	
	
}


