<template>
	<div id="vue-pipe-resource-buttons">
		<div class="col-12 p-2">Available Modules</div>
		<div class="col-12">
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text"><i class="fa fa-sort"></i></span>
				</div>
				<input type="text" name="" class="form-control" v-model="search">
				<div class="input-group-append">
					<span class="input-group-text"><i class="fa fa-search"></i></span>
				</div>
			</div>
		</div>
		<button  class="btn col-12 btn-default text-left" v-for="module in filteredModules">
			{{module.name}}
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

</style>

<script>
export default {
  name: "ModuleButtons",
  props: ["modules"],
  components: {  },
  computed : {
  	filteredModules(){
  		// return _.orderBy(this.items.filter(item => {
  		//               if(!this.search) return this.items;
  		//                 return (item.title.toLowerCase().includes(this.search.toLowerCase()) ||
  		//                     item.action.toLowerCase().includes(this.search.toLowerCase())   ||
  		//                     item.headline.toLowerCase().includes(this.search.toLowerCase()) ||
  		//                     item.subtitle.toLowerCase().includes(this.search.toLowerCase()));
  		//             }), 'headline');
  		return this.modules.filter(item=>{
  			return item.name.toLowerCase().includes(this.search.toLowerCase());
  		});
  	}
  },
  data : function(){
  	return {
  		search : ''
  	};
  },
  methods:{
  	showDetails(module){
  		this.$emit('onModuleShowDetails', module);
  	},
  	func1(){
  		console.log("show details");
  	},
  	func2(){
		console.log("download");
  	}
  }
};
</script>