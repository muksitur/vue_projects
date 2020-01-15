<template>

  <div id="vue-pipe-resource-buttons">
    <select v-model="selectedValue" @change="passselectvalue">
      <option value="" disabled selected data-default>Select your multimodel</option>
      <option :value="i" v-for="mltmdl,i in multimodels">MultiModel : {{mltmdl.label.de}}</option>
    </select>

  </div>
</template>

<style>

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
  name: "MultimodelSelector",
  components: {

  },
  props: ["multimodels"],
  data: function(){
		return {
      selectedValue: ''
    }
  },

  methods:{

    passselectvalue(){
      // var selectedValue = document.getElementById("number").value;
      // alert(this.selectedValue);
      this.$emit('onMultimodelSelect', this.selectedValue);
    }
  }


}
</script>
