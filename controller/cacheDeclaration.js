const nodeCache = require("node-cache");
const myCache = new nodeCache({"stdTTL":7200, "checkperiod": 600, "deleteOnExpire": true, "maxKeys": 1000})
module.exports = myCache