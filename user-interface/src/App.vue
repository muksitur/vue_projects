<template>
  <div id="app">

    <div class="scroller3">
      <div class="row">
        <div class="col-12 px-0">
          <View3dPanel ref="panel3d"/>
        </div>
        <div class="col-9 px-0">
          <JpegViewer @onJpegShow="showInViewers($event)" ref="jpeg"/>
        </div>
        <div class="col-3 px-0">
          <!-- <ViewerSelector @onViewSelect="loadViewer($event)"/> -->
          <MultimodelSelector v-if="store.is_fetched" @onMultimodelSelect="loadMultimodel($event)" :multimodels="store.multimodels"/>
          <Snapshots v-if="store.is_fetched"  @onSnapshotLoadResource="loadSnapshotResources($event)" :snapshots="store.multimodel.snapshots"/>
          <ModelBrowser v-if="store.is_fetched" @onImageShow="loadinImage($event)" @onResourceShow="showInViewers($event)" :models="store.multimodel.models"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { Store } from "./repository/store.js";

import TitleBar from "./components/TitleBar.vue";
import View3dPanel from "./components/View3dPanel.vue";
import ResourceButtons from "./components/ResourceButtons.vue";
import ModuleButtons from "./components/ModuleButtons.vue";
import FileList from "./components/FileList.vue";
import Snapshots from "./components/Snapshots.vue";
import ModelBrowser from "./components/ModelBrowser.vue"
import MultimodelSelector from "./components/MultimodelSelector.vue"
import JpegViewer from "./components/JpegViewer.vue"

export default {
  name: "app",
  components: {
    View3dPanel,
    Snapshots,
    ModelBrowser,
    MultimodelSelector,
    JpegViewer
  },
  data: function() {
    return {
      store: Store
    };
  },
  methods: {
    displayObjectInPanel3d(resource){
    // this one is for tree view on View3dPanel component
      // this.$refs.panel3d.showDetails(resource);
      // this method is not currently used
    },
    showInViewers(resource){
      //alert(resource.location);
      if(resource.formatType == "POTREE" || resource.formatType == "OBJ" || resource.formatType == "OUT")
        this.$refs.panel3d.show(resource);
      else
        this.$refs.jpeg.showinImage(resource);
    },
    loadSnapshotResources(resources){
      this.$refs.panel3d.loadSnapshotResources(resources);
    },
    loadinImage(resource){
      // these functions should be initialized when image folder (resource folder) is selected
      this.$refs.jpeg.load(resource);
      this.$refs.jpeg.init_poly();
      this.$refs.jpeg.panzoomfunc();
    },
    async loadMultimodel(index){
      //alert(index);
      await this.store.fetchMultimodel(this.store.multimodels[index].id);
    },
    async loadViewer(value){
      //alert(value);
      // later to be used for image viewer
      //await this.$refs.panel3d.loadviewervalue(value);
      await this.$refs.jpeg.loadviewervalue(value);
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.scroller3{
  height: 800px;
  /* width: 100%; */
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
