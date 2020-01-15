<template>
  <div id="vue-pipe-panel3d" class="col-12">
    <div class="potree_container">
      <div
        id="potree_render_area"
        ref="potree_render_area"
        style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; "
      ></div>
      <div id="potree_sidebar_container"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    show(resource) {
      // alert(resource.location);
      var path =
        "https:" + process.env.VUE_APP_PUBLIC + "/" + resource.location;

      // 		// resource show

      if (resource.formatType == "POTREE") {
        Potree.loadPointCloud(path, resource.label.de, function(e) {
          viewer.scene.addPointCloud(e.pointcloud);

          let material = e.pointcloud.material;
          material.size = 1;
          material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

          viewer.fitToScreen();
        });
        viewer.setEDLEnabled(false);
      } else if (resource.formatType == "OBJ") {
        let objpath = "https:" + process.env.VUE_APP_PUBLIC + "/";
        let objname =
          "https:" + process.env.VUE_APP_PUBLIC + "/" + resource.location;
        let obj = new THREE.OBJLoader();

        obj.load(objname, function(getmtl) {
          let mtlname = getmtl.materialLibraries[0];

          if (typeof mtlname === "undefined") {
            obj.load(path, function(object) {
              object.traverse(function(child) {
                if (child instanceof THREE.Line) {
                  child.material.color.setHex(0xff00ff);
                }
              });
              viewer.scene.scene.add(object);

              viewer.onGUILoaded(() => {
                // Add entries to object list in sidebar
                let tree = $(`#jstree_scene`);
                let parentNode = "pointclouds";

                let objID = tree.jstree(
                  "create_node",
                  parentNode,
                  {
                    text: resource.location.substring(
                      resource.location.lastIndexOf("/") + 1
                    ),
                    icon: `${Potree.resourcePath}/icons/triangle.svg`,
                    data: object
                  },
                  "last",
                  false,
                  false
                );
                tree.jstree(
                  object.visible ? "check_node" : "uncheck_node",
                  objID
                );
              });
            });
          } else {
            let mtlLoader = new THREE.MTLLoader();
            mtlLoader.setMaterialOptions({ side: THREE.DoubleSide });

            let filename = resource.location
              .substring(0, resource.location.lastIndexOf("/") + 1)
              .concat(mtlname);

            mtlLoader.load(objpath + filename, function(materials) {
              materials.preload();
              obj.setMaterials(materials);
              obj.load(objname, function(object) {
                viewer.scene.scene.add(object);
                object.visible = true;

                viewer.onGUILoaded(() => {
                  // Add entries to object list in sidebar
                  let tree = $(`#jstree_scene`);
                  let parentNode = "pointclouds";

                  let objID = tree.jstree(
                    "create_node",
                    parentNode,
                    {
                      text: resource.location.substring(
                        resource.location.lastIndexOf("/") + 1
                      ),
                      icon: `${Potree.resourcePath}/icons/triangle.svg`,
                      data: object
                    },
                    "last",
                    false,
                    false
                  );
                  tree.jstree(
                    object.visible ? "check_node" : "uncheck_node",
                    objID
                  );
                });
              });
            });
          }
        });
      } else if (resource.formatType == "OUT"){

        console.log("open out file from " + resource.location);
        // set path to out file
        let out_file = "https:" + process.env.VUE_APP_PUBLIC + "/" + resource.location;

        // find list path in meta data under the key 'list'
        // TODO: check if list key was found afterwards
        var list_file = [];
        resource.metaData.entries.forEach((value, index) => {
          if (value.key == "list") {
            console.log("found list file on " + value.value);
            list_file.push(value.value);
          }
        });

        // append file url to public folder
        list_file = "https:" + process.env.VUE_APP_PUBLIC + "/" + list_file[0];

        // load bundler and list file
        let bundler = new Potree.Bundler();
        bundler.visualizeBundler(list_file, out_file);
      }
    },
    loadSnapshotResources(resources) {
      let temp = this;
      // console.log(this);
      // console.log(resources);
      resources.forEach(function(resource) {
        // console.log(resource);
        temp.show(resource);
      });
    }
  },
  mounted: function() {
    window.viewer = new Potree.Viewer(this.$refs.potree_render_area);

    viewer.setEDLEnabled(true);
    viewer.setFOV(60);
    viewer.setPointBudget(1 * 1000 * 1000);
    viewer.loadSettingsFromURL();

    viewer.setDescription("");
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    var light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(-1, -1, -1).normalize();
    var light2 = new THREE.AmbientLight(0x555555);
    viewer.scene.scene.add(light);
    viewer.scene.scene.add(light1);
    viewer.scene.scene.add(light2);

    viewer.loadGUI(() => {
      viewer.setLanguage("en");
      $("#menu_appearance")
        .next()
        .show();
      //viewer.toggleSidebar();
    });
  }
};
</script>

<style>
#vue-pipe-panel3d {
  height: 800px;
  background-color: #444;
  color: white;
}

#vue-pipe-panel3d button {
  background-color: #4caf50;
  color: white;
  border-radius: 10;
}
</style>
