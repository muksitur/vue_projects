import axios from "axios";

const baseURL = process.env.VUE_APP_LYNKS_URL;

const repo = axios.create({
  baseURL: baseURL
});
repo.defaults.withCredentials = true;
// repo.post("/pull", { url: "url:https://msk-server1.bauing.uni-weimar.de/public/balkenversuch/balkenversuch.lynks" }).catch(function(error) {
//   console.log("from repository.js");
//   console.log(error);
// });

export default repo;
