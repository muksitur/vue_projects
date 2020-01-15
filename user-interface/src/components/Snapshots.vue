<template>
  <div id="vue-pipe-snapshot-browser">
    <div class="col-12 p-2">Available Snapshots</div>
    <button  class="btn col-12 btn-default text-left" v-for="snapshot in snapshots">
      <div class="row">
        <div class="col-10" @click="showResources">{{getLabel(snapshot)}}</div>
        <div class="col-1" @click="loadSnapshotResources(snapshot)"><i class="fa fa-eye"></i></div>
      </div>
    </button>

  </div>
</template>

<style>
  #vue-pipe-snapshot-browser{
    background-color: #555;
    color: white;
  }

  #vue-pipe-snapshot-browser button{
    color: #aaa;
    border-radius: 0;
  }

  #vue-pipe-snapshot-browser button:hover{
    background-color: #444;
  }

  #vue-pipe-snapshot-browser .input-group-text{
    background-color: #444;
    color: white;
  }

  #vue-pipe-snapshot-browser input[type="text"]{
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

</style>

<script>

export default {
  name: "Snaphots",
  props: ["snapshots"],
  components: {

  },
  methods:{
  	showResources(event){
      // $(event.target.nextSibling).toggleClass("show");
      // $(event.target).toggleClass("vue-pipe-model-selected");
    },
    loadSnapshotResources(snapshot){
      // hide once the resource is loaded
      $(event.target.parentElement).toggleClass("hide");
      //console.log(event.target.parentElement);
      this.$emit('onSnapshotLoadResource', snapshot.resources);
    },
    getLabel(snapshot){
  		try{
  			return snapshot.label.de;
  		}catch(e){
  			return "Unknown";
  		}
  	}
  },
  computed:{

  }
};
</script>
