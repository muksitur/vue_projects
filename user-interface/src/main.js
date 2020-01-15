import Vue from "vue";
import App from "./App.vue";

import TreeView from "vue-json-tree-view";
Vue.use(TreeView);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
//nothing changed
