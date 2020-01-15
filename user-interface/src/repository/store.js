// store implemented according to the following post:
// https://vuedose.tips/tips/creating-a-store-without-vuex-in-vue-js-2-6/

import Vue from "vue";
import ResourcesRepository from "./resourcesRepository";
import ModuleRepository from "./moduleRepository";
import PublicRepository from "./publicRepository.js";

export const Store = new Vue({
  data: {
      multimodels: [],
      multimodel: {
        data:{},
        snapshots:[],
        models:[],
        methods:[]
      },
      methods: [],
      is_fetched : false
  },
    methods: {
        async fetch() {
            await this.fetchMultimodels();
            this.fetchMultimodel(this.multimodels[0].id);

            //this.fetchMethods();
        },

        async fetchMultimodels () {
        let vm = this;
        this.multimodels.splice(0);
        const { data: multiModelIds} = await ResourcesRepository.getMultiModels();
        for (const mmId of multiModelIds) {
            const { data: multiModel } = await ResourcesRepository.getMultimodel(mmId);
            vm.multimodels.push(multiModel);
        };
    },
        async fetchMultimodel(modelId) {
            let vm = this;
            return ResourcesRepository.getMultimodel(modelId).then(async(data) => {
                vm.multimodel.data = data.data;
              //  alert("in fetch model");
                await vm.fetchModels();
                await vm.fetchSnapshots();
                vm.is_fetched = true;
            });
        },
        async fetchModels() {
            let models = []
            // vm.multimodel.models = [];

            const id = this.multimodel.data.id;
            //alert("multimodel id " + id);
            let vm = this;
            vm.multimodel.models = [];
            return ResourcesRepository.getModels(id).then(async(data) => {

                data.data.forEach(async function(modId) {
                    const { data: mod } = await ResourcesRepository.getModel(id, modId);
                    if (!mod.resources) {
                        mod.resources = [];
                    }
                    const modelId = modId;
                    const { data: resourceIds } = await ResourcesRepository.getModelResources(id, modelId);
                    resourceIds.forEach(async function(resId) {
                        ResourcesRepository.getResource(id, modelId, resId).then(data => {
                            if (data.data.fileContainer == "FOLDER") {
                                let loc = data.data.location;
                                let type = data.data.formatType;
                                PublicRepository.getFolderList(loc, type).then(files => {
                                    data.data.files = files;
                                    //console.log(files);
                                });
                            }
                            mod.resources.push(data.data);
                        });
                    });
                    models.push(mod);
                    vm.multimodel.models.push(mod);
                });
                vm.multimodel.data.models = models;
            });
        },
        async fetchSnapshots() {
            let vm = this;
            vm.multimodel.snapshots = [];
            const id = this.multimodel.data.id;
            return ResourcesRepository.getSnapshots(id).then(async(data) => {
                let snaps = [];
                data.data.forEach(async function(snapId) {
                    const { data: snap } = await ResourcesRepository.getSnapshot(id, snapId);
                    const { data: resources } = await ResourcesRepository.getSnapshotResources(id, snapId);
                    if (!snap.resources) snap.resources = [];
                    resources.forEach(async function(resId) {
                        const { data: res } = await ResourcesRepository.getSnapshotResource(id, snapId, resId);
                        snap.resources.push(res);
                    });
                    snaps.push( snap);
                    vm.multimodel.snapshots.push(snap);
                });
                vm.multimodel.data.snapshots = snaps;
            });
        },
        async fetchMethods() {
            let vm = this;
            this.methods.splice(0);
            ModuleRepository.getMethods().then(data => {
                vm.methods = vm.methods.concat(data);
            });
        },
        async setMultimodel(id) {
        },
        async refresh() {
            this.fetchMultimodel(this.multimodel.data.id);
        }
    },
    computed: {},
    watch: {
    },
    created() {
        this.fetch();
    }
});

// export default Store;
