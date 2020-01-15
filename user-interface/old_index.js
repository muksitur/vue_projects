const token = "zzNOj2jynH4b0RfxcZpjGoiEzDIcBxor2kDtmDooOXk";
const base_url = "/mmc/extension/";
const rpc_url = "/api/";

Vue.component("file_table_row", {
  props: ["filename"],
  template: `<tr><td>{{ filename }}</td><td>
               <button v-on:click="$emit('compute', filename)">Start computation</button></td></tr>`
});

Vue.component("file_list", {
  props: ["files"],

  template: `<table id="file_table"> 
                    <tr is="file_table_row"
                        v-for="filename in files"
                        v-on:compute="$emit('compute', $event)"
                        v-bind:key="filename.id"
                        v-bind:filename="filename.location">
                    </tr>
               </table>`
});

Vue.component("selector", {
  props: ["itemlist"],
  data: function() {
    return { item: "" };
  },
  template: `<select v-on:change="$emit('selected', item)" v-model="item">
        <option disabled selected value=""><slot></slot></option>
        <option v-for="item in itemlist">
            {{item}}
        </option>
    </select>`
});

Vue.component("addFileDialog", {
  components: { "top-modal": TopModal },
  props: ["open"],
  data: function() {
    return { value: "" };
  },
  template: `<top-modal :open="open">
        <template v-slot:content>
        <form>
            <input v-model="value" type="text">
        </form>
        </template>
        <template v-slot:footer>
            <button @click="cancel($event)">Cancel</button>
            <button @click="done($event)">Ok</button>
        </template>
        </top-modal> `,
  methods: {
    cancel: function(event) {
      if (event) event.preventDefault();
      this.$emit("cancelAddNewFile");
    },
    done: function(event) {
      if (event) event.preventDefault();
      this.$emit("doneAdd", this.value);
    }
  }
});

Vue.component("module-file-selector", {
  props: ["itemlist", "defval"],
  data: function() {
    return {
      item: "",
      added: [],
      showAddFileDialog: false
    };
  },
  template: `<div><select v-on:change="$emit('selected', item)" v-model="item">
        <option v-if="defval == ''" disabled selected value=""><slot></slot></option>
        <option v-for="item in items" :selected="item.location === defval" v-bind:value="item.location">
            {{item.location}}
        </option>
        
    </select>
    <br>
    <button @click="addNewFile($event)">Add new file</button>
    <addFileDialog :open="showAddFileDialog" @doneAdd="doneAdding($event)"
                @cancelAddNewFile="showAddFileDialog=false"></addFileDialog>
    </div>`,
  methods: {
    isDefault: function(item) {
      return item == this.defval;
    },
    addNewFile: function(event) {
      if (event) event.preventDefault();
      this.showAddFileDialog = true;
    },
    doneAdding: function(newItem) {
      this.added.push(newItem);
      this.item = newItem;
      this.showAddFileDialog = false;
      this.$emit("selected", newItem);
    }
  },
  computed: {
    items: function() {
      let its = this.itemlist.slice();
      its = its.concat(this.added);
      if (!(this.defval == "") && this.itemlist.indexOf(this.defval) == -1) {
        its.unshift(this.defval);
      }
      return its;
    }
  }
});

Vue.component("parameter-input", {
  props: ["parameter", "name", "filelist"],
  template: `<tr><td>{{name}}:</td><td>
                <module-file-selector v-if="parameter.type == 'file'" v-on:selected="selected(name, $event)"
                    v-bind:itemlist="filelist" :defval="parameter.default">Choose a file</module-file-selector>
                <input v-else v-bind:value="parameter.default" v-on:input="selected(name, $event.target.value)">   
                </td></tr> `,
  methods: {
    selected: function(name, value) {
      this.$emit("valueChanged", { name: name, value: value });
    }
  },
  created: function() {
    if (this.parameter.default !== "") {
      this.$emit("valueChanged", {
        name: this.name,
        value: this.parameter.default
      });
    }
  }
});

Vue.component("module-parameters", {
  props: ["module", "filelist"],
  data: function() {
    return {
      loaded: false,
      helptext: "",
      signatures: []
    };
  },
  template: `<div>
                <p>{{parameters.help}}</p>
                <form v-if="module">      
                <table>
                    <parameter-input v-for="(parm, name, index) in parameters.inputs" 
                            :key="index" v-bind:parameter="parm" v-bind:name="name" 
                            v-bind:filelist="filelist" @valueChanged="$emit('valueChanged', $event)">
                    </parameter-input>
                </table>
                </form>  </div>`,
  asyncComputed: {
    loadParameters: function(comp) {
      xmlRpcClient(
        rpc_url,
        "system.methodSignature",
        [token, comp.module],
        "xml",
        function(err, data) {
          if (err) {
            console.log("rpc error");
          } else {
            comp.signatures = data;
            let sig = [];
            for (let i = 0; i < data.length; i++) {
              sig.push({ name: data[i][0], isFile: data[i][1] == "file" });
            }
            comp.$emit("signatureChanged", sig);
          }
        }
      );
      xmlRpcClient(
        rpc_url,
        "system.methodHelp",
        [token, comp.module],
        "xml",
        function(err, data) {
          if (err) {
            console.log("rpc error");
          } else {
            comp.helptext = data;
          }
        }
      );
    }
  },
  computed: {
    parameters: function() {
      if (this.helptext === "") return [];
      let parameters = {};
      parameters.help = this.helptext;
      parameters.inputs = {};
      if (typeof this.signatures === "string") {
        return parameters;
      }
      for (let i = 0; i < this.signatures.length; i++) {
        let parm = this.signatures[i];
        parameters.inputs[parm[0]] = { type: parm[1], default: parm[2] };
      }
      return parameters;
    }
  }
});

Vue.component("pipemodal", {
  components: { "top-modal": TopModal },
  props: ["showmodal1", "modules", "filename", "filelist", "snapshot"],
  data: function() {
    return { selectedmodule: "", moduleParameters: {}, signature: [] };
  },
  template: `<top-modal 
        :open="showmodal1"
        :z-index="1000"
        :column-position="'center'"
        :modal-position="'center'"
        @bg-click="cancel">
        <template v-slot:header>Execute pipe module</template>
        <template v-slot:content>
           <selector v-bind:itemlist="modules" @selected="selectionChanged($event)"
                v-on:selected="">Select the module to execute</selector>
        <module-parameters v-bind:module="selectedmodule" v-bind:filelist="filelist"
            @valueChanged="updateValue($event)" @signatureChanged="signature=$event"></module-parameters>
        </template>
        <template v-slot:footer>
            <button @click="cancel">Cancel</button>
            <button @click="run">Ok</button>
        </template>
        </top-modal>`,
  methods: {
    selectionChanged: function(event) {
      this.selectedmodule = event;
      this.moduleParameters = {};
    },
    cancel: function() {
      this.$emit("cancel");
      this.selectedmodule = "";
    },
    run: function() {
      let comp = this;
      const mod = this.selectedmodule;
      let parameter = [token];
      for (let i in this.signature) {
        let param = this.signature[i].name;
        const isFile = this.signature[i].isFile;
        let value = this.moduleParameters[param];
        if (value === undefined) {
          alert("Missing input value: " + param);
          return;
        }
        if (isFile) {
          // add snapshot file prefix
          // TODO how to we get the file?????
          value = this.snapshot + "/" + value;
        }

        parameter.push(value);
      }
      xmlRpcClient(rpc_url, mod, parameter, "xml", function(err, data) {
        if (err) {
          console.log(mod);
          console.log(parameter);
          console.log("rpc error");
          console.log(err);
        } else {
          comp.$emit("computationDone");
        }
      });
    },
    updateValue: function(value) {
      this.moduleParameters[value.name] = value.value;
      console.log(this.moduleParameters);
    }
  }
});

var app = new Vue({
  el: "#snapshot_selector",
  data: {
    snapshots: [],
    snapshot: "none",
    showmodal1: false,
    modules: [],
    filename: ""
  },
  created: async function() {
    await this.setSnapshots();
    await this.setModules(this);
  },
  methods: {
    async setSnapshots() {
      const response = await fetch(base_url + "snapshots");
      this.snapshots = await response.json();
    },
    async setModules(vueapp) {
      xmlRpcClient(rpc_url, "system.getModules", [token], "xml", function(
        err,
        data
      ) {
        if (err) {
          console.log("rpc error");
          console.log(err);
          vueapp.modules = ["error"];
        } else {
          vueapp.modules = data;
        }
      });
    },
    showmodal: function(filename) {
      this.showmodal1 = true;
      this.filename = filename;
    },
    computationDone: function() {
      console.log(this.files);
    }
  },
  asyncComputed: {
    files: async function() {
      let response = await fetch(
        base_url + "snapshots/" + this.snapshot + "/resources"
      );
      if (!response.ok) {
        return [];
      } else {
        const resources = await response.json();
        let result = [];
        for (let i = 0; i < resources.length; i++) {
          response = await fetch(
            base_url + "resources/" + resources[i] + "/location"
          );
          if (response.ok) {
            result.push({ location: await response.json(), id: resources[i] });
          }
        }
        return result;
      }
    }
  }
});
