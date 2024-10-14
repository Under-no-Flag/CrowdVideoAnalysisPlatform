export default{
	events: [],
	on(eventName,handler){
		this.events.push({ eventName, handler })
	},
		
	emit(eventName){
		for(const event of this.events){
			if(eventName === event.eventName) event.handler( ...[...arguments].slice(1))
		}
	},
	unEvent(eventName){
		for(let i = 0; i < this.events.length; i++){
			if(eventName !== this.events[i].eventName) continue;
			this.events.splice(i,1);
			i--;
		}
	}
}