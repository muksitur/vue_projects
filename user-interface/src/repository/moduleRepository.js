const xmlrpc = require("xmlrpc");
const baseDomain = process.env.VUE_APP_API_HOST;
const port = process.env.VUE_APP_API_PORT;
const path = "/api/";
const TOKEN = "pipetoken";

let client = xmlrpc.createClient({ host: baseDomain, port: port, path: path });

let callRPCMethod = (methodName, params = []) => {
  return new Promise((resolve, reject) => {
    client.methodCall(methodName, [TOKEN].concat(params), function(
      error,
      value
    ) {
      if (error) reject(error);
      resolve(value);
    });
  });
};

export default {
  getMethodNames() {
    return callRPCMethod("system.listMethods");
  },
  getMethodSignature(methodName) {
    return callRPCMethod("system.methodSignature", [methodName]);
  },
  getMethodHelp(methodName) {
    return callRPCMethod("system.methodHelp", [methodName]);
  },
  async getMethods() {
    let repo = this;
    const names = await this.getMethodNames();
    let methods = [];
    for (let j = 0; j < names.length; j++) {
      let name = names[j];
      if (name.split(".")[0] == "system" || name == "add") {
        continue;
      }
      let method = { name: name };
      let signature = {};
      const sig = await repo.getMethodSignature(name);
      for (let i = 0; i < sig.length; i++) {
        signature[sig[i][0]] = {
          name: sig[i][0],
          type: sig[i][1],
          default: sig[i][2]
        };
      }
      method["signature"] = signature;
      const help = await repo.getMethodHelp(name);
      method["help"] = help;
      methods.push(method);
    }
    return methods;
  }
};
