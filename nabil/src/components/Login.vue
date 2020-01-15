<template>
  <div id="logintestdiv">
    <h1>Login</h1>
    <p style="font-family: FFMarkW04-Medium;font-size: 14px;color: rgb(144, 144, 144); font-weight: bold">{{error}}</p>
    <form class="" @submit.prevent="execute">


    <div class="field nabilfield">
      <label class="nabillabel">User Name</label>
      <div class="control">
        <input class="input" style="width:100%" type="text" v-model="account.username" />
      </div>
    </div>

    <div class="field nabilfield">
      <label class="nabillabel">Password</label>
      <div class="control">
        <input class="input" style="width:100%" type="password" v-model="account.password" />
      </div>
    </div>

    <button class="nabilsubmit" type="submit">Submit</button>
  </form>
  </div>
</template>


<script>
import axios from "axios"

  export default {
    data: function (){
      return {
        error: "",
        account:{
          username: "",
          password: ""
        }
      }
    },
    methods:{
      execute(){
        alert("Username: "+this.account.username+" Password: "+this.account.password);
        axios.post('https://holeapi.com/api/authenticate', this.account)
        .then( (response) => {
          console.log(response);
        })
        .catch( (error) => {
          console.log("Login Error: ", error);
          this.error = error.response.data.title;
        });
      }
    }
  }
</script>

<style>
  #logintestdiv{
    width: 304px;
    height: 496px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(242, 242, 242);
    box-shadow: ;
    border-radius: 5px;
  }
  .submitlogin{
    width: 280px;
    height: 44px;
    box-shadow: ;
  }
</style>
