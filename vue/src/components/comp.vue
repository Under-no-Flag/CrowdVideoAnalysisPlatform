<script>
	export default {
		name: 'n-comp',
		props:{
			comp:{
				type: Function,
				default:()=> (()=>{})
			},
			conf:{
				type: Object,
				default:()=> ({ })
			},
			row:{
				type: Object,
				default:()=> ({ })
			},
		},
		render(h){
			return this.comp({h,vm:this})
		},
	}
</script>