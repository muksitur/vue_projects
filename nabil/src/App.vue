<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <img src="./assets/dent.jpeg" style="width: 152px; height: 80px;">
    <select class="" name="" id="page" @change="saveselectvalue()">
      <option :value="slct" v-for="slct in selectoptions">{{slct}}</option>
    </select>

    <Registration v-if="selectedValue === 'registration'" @onRegistration="selectactivation($event)"/>
    <Activation v-if="selectedValue === 'activation'" @onActivation="selectlogin($event)"/>
    <Login v-if="selectedValue === 'login'" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Activation from './components/Activation.vue'
import Login from './components/Login.vue'
import Registration from './components/Registration.vue'

export default {
  data: function(){
    return{
      selectedValue: "",
      selectoptions : ["-- Select Page --","registration","login"]
    }
  },
  name: 'app',
  components: {
    HelloWorld,
    Activation,
    Login,
    Registration
  },
  methods:{
    saveselectvalue(){
      this.selectedValue = document.getElementById("page").value;
      // alert(this.selectedValue);

    },
    selectactivation(string){
      this.selectedValue = string;
      alert(this.selectedValue);
    },
    selectlogin(string){
      this.selectedValue = string;
      alert(this.selectedValue);
    }
  }
}
</script>

<style>
#app {
  width: 304px;
  height: 496px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(red 30%, white 30% 100%);
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
