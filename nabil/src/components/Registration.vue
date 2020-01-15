<template>
  <div id="registrationtestdiv">
    <h1>Registration</h1>
    <p style="font-family: FFMarkW04-Medium;font-size: 14px;color: rgb(144, 144, 144); font-weight: bold">{{error}}</p>
    <div class="field nabilfield">
      <label class="nabillabel">User Name</label>
      <div class="control">
        <input class="input" style="width:100%" type="text" v-model="account.login" />
      </div>
    </div>

    <div class="field nabilfield">
      <label class="nabillabel">Password</label>
      <div class="control">
        <input class="input" style="width:100%" type="password" v-model="account.password" />
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
          password: ""
        }
      }
    },
    methods:{
      execute(){
        alert("Username: "+this.account.login+" Password: "+this.account.password);
        axios.post('https://holeapi.com/api/register', this.account)
        .then( (response) => {
          console.log(response);
          this.$emit('onRegistration', "activation");
        })
        .catch( (error) => {
          console.log("Registration Error: ", error);
          this.error = error.response.data.title;
        });


      }
    }
  }
</script>

<style>
  #registrationtestdiv{
    width: 304px;
    height: 496px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(242, 242, 242);
    box-shadow: ;
    border-radius: 5px;
  }
  .nabilsubmit{
    width: 280px;
    height: 44px;
    background: rgb(250,41,34);
    color: white;
    font-weight: bold;
    border-radius: 5px;
  }
  .nabilfield{
    width: 280px;
    height: 61px;
    box-shadow: ;
  }
  .nabillabel{
    width: 280px;
    height: 12px;
    color: rgb(144, 144, 144);
    font-size: 10px;
    font-family: FFMarkW04-Bold;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.81px;
    box-shadow: ;
  }
</style>
