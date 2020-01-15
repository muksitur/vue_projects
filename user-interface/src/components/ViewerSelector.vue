<template>
  <div id="vue-pipe-resource-buttons">

    <select class="" name="" id="viewchoice" @change="saveselectvalue()">
      <option :value="viewoptions[i]" v-for="viewoption,i in viewoptions">Viewer Option {{i+1}} : {{viewoptions[i]}}</option>
    </select>

  </div>
</template>



<style>

</style>



<script>
export default {

  name: "ViewerSelector",

  components: {

  },

  props:["viewchoices"],

  data: function(){
		return {
      viewoptions: ['JPEG Viewer','Point-cloud Viewer']
    }
  },

  methods : {
    saveselectvalue(){
      var selectedValue = document.getElementById("viewchoice").value;
      //alert(selectedValue);
      this.$emit('onViewSelect', selectedValue);
    }

  }


}



</script>
