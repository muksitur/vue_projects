<template>
  <div id="activationtestdiv">
    <h1>Activation</h1>
    <p style="font-family: sans-serif;font-size: 14px;color: rgb(144, 144, 144); font-weight: bold">{{error}}</p>
    <div class="field nabilfield">
      <label class="nabillabel">User Name</label>
      <div class="control">
        <input class="input" style="width:100%" type="text" v-model="account.login" />
      </div>
    </div>

    <div class="field nabilfield">
      <label class="nabillabel">Key</label>
      <div class="control">
        <input class="input" style="width:100%" type="password" v-model="account.key" />
      </div>
    </div>

    <button class="nabilsubmit" @click="execute">Submit</button>
  </div>
</template>


<script>
import axios from "axios"

  export default {
    data: function (){
      return {
        error: "",
        account:{
          login: "",
          key: "",
          method: "sms"
        }
      }
    },
    methods:{
      execute(){
        alert("Username: "+this.account.login+" Key: "+this.account.key+" Method: "+this.account.method);
        axios.post('https://holeapi.com/api/activate', this.account)
        .then( (response) => {
          console.log(response);
          this.$emit('onActivation', "login");
        })
        .catch( (error) => {
          console.log("Activation Error: ", error);
          this.error = error.response.data.title;
        });


      }
    }
  }
</script>

<style>
  #activationtestdiv{
    width: 304px;
    height: 496px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(242, 242, 242);
    box-shadow: ;
    border-radius: 5px;
  }
</style>
