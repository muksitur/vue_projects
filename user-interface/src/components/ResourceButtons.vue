<template>
	<div id="vue-pipe-resource-buttons">
		<div class="col-12 vue-pipe-model-selected">Total resources : {{resources.length}}</div>
		<button  class="btn col-12 btn-default text-left vue-pipe-resources" v-for="resource in resources">
			<div class="row">
				<div class="col-10" @click="showDetails(resource)">{{getLabel(resource.label)}}</div>
				<div v-if="showViewBtn(resource)" class="col-1" @click="show(resource)"><i class="fa fa-eye"></i></div>
			</div>
		</button>
	</div>
</template>


<style>
	#vue-pipe-resource-buttons{
		background-color: #555;
		color: white;
	}

	#vue-pipe-resource-buttons button{
		color: #aaa;
		border-radius: 0;
	}

	#vue-pipe-resource-buttons button:hover{
		background-color: #444;
	}

	#vue-pipe-resource-buttons .input-group-text{
		background-color: #444;
		color: white;
	}

	#vue-pipe-resource-buttons input[type="text"]{
		background-color: #555;
		color: white;
	}

	.vue-pipe-resources{
		background-color: #666;
	}

	.vue-pipe-model-selected{
		background-color: #444;
	}

</style>

<script>
export default {
  name: "ResourceButtons",
  props: {
  	resources : {
  		type : Array,
  		default : function(){
  			return [];
  		}
  	}
  },
  components: {  },
  computed : {
  	filteredResources(){
  		
  		// if(typeof this.resources !== "undefined"){
  		// 	return this.resources.filter(item=>{
  		// 		return item.label.de.toLowerCase().includes(this.search.toLowerCase());
  		// 	});
  		// }
  		
  		// return this.resources;
  		let result = this.resources.filter(item=>{
  			return item.label.de.toLowerCase().includes(this.search.toLowerCase());
  		});
  		return result;
  	}
  },
	data(){
		return {
			search : ''
		}
  },
  methods:{
  	showDetails(resource){
		// this one is for tree view on View3dPanel component
  		// this.$emit('onResourceShowDetails', resource);
  	},
	show(resource){
		this.$emit('onResourceShow', resource);
	},
	showViewBtn(resource){
  		return resource.formatType == "POTREE";
  	},
  	getLabel(label){
  		try{
  			return label.de;
  		}catch(e){
  			return "Unknown";
  		}
  	}
  },
  // mounted:function(){
  // 	console.log("resource buttons loaded");
  // 	this.$emit('onModelsComponentCreated', {});
  // }
};
</script>
