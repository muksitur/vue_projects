<template>
	<div id="vue-pipe-resource-buttons">
		<div class="col-12 p-2">Available Models</div>
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

		<div class="scroller2">
			<div  class="btn col-12 btn-default text-left p-0" v-for="modelll in filteredResources">
				<button class="btn col-12 btn-default text-left" @click="toggleResources">{{modelll.label.de}}</button>
				<div class="collapse">
					<div class="col-12 vue-pipe-model-selected">Total resources : {{modelll.resources.length}}</div>
					<button  class="btn col-12 btn-default text-left vue-pipe-resources" v-for="resource in modelll.resources">
						<div class="row">
							<div class="col-10" @click="showDetails(resource)">{{getLabel(resource.label)}}</div>

							<div v-if="showEyeBtn(resource)" class="col-2" @click="show(resource)"><i class="fa fa-eye"></i></div>
						</div>
					</button>
					<!-- <ResourceButtons :resources="modelll.resources"/> -->
				</div>

			</div>
		</div>


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

	.hide{
    visibility: hidden;
  }
	.scroller2{
		height: 500px;
		overflow-y: scroll;
	}

</style>

<script>
import Files from "../repository/files.js";
export default {
  name: "ModelBrowser",
  components: {

  },
  props: ["models"],
  computed : {
  	filteredResources(){
  		let result = this.models.filter(item=>{
				try{
					return item.label.de.toLowerCase().includes(this.search.toLowerCase());
				}
				catch(e){
					return false;
				}

  		});
  		return result;
  	}
  },
  data: function(){
		return {
			search : '',
			resources : []
		}
  },
  methods:{
  	async showDetails(resource){
			if(resource.formatType == "JPG" || resource.formatType == "PNG"){
				$(event.target.nextSibling).toggleClass("show");
		  	$(event.target).toggleClass("vue-pipe-model-selected");

				this.$emit('onImageShow', resource);
			}
  	},
		show(resource){
			// hide once the resource is loaded
			// console.log(resource);
			// alert(resource);
			if(resource.formatType == "POTREE" || resource.formatType == "OBJ"  || resource.formatType == "OUT")
				$(event.target.parentElement).toggleClass("hide");
			//console.log(event.target.parentElement);
			this.$emit('onResourceShow', resource);
		},
		showEyeBtn(resource){
			if(resource.formatType == "POTREE" || resource.formatType == "OBJ" || resource.formatType == "OUT")
	  		return true;
	  },
		toggleResources:function(event){
			// console.log(event.target.nextSibling);
	  	$(event.target.nextSibling).toggleClass("show");
	  	$(event.target).toggleClass("vue-pipe-model-selected");
		},
	  getLabel(label){
			try{
				return label.de;
			}catch(e){
				return "Unknown";
			}
		}
  }
};
</script>
