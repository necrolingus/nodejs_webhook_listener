const nodeCache = require("node-cache")
const myCache = new nodeCache({"stdTTL":7200, "checkperiod": 600, "deleteOnExpire": true, "maxKeys": 1000})

myCache.on( "set", function( key, val ){
    console.log('Key is set')
    console.log(key)
    console.log(val)
    console.log('-----------')
});



myObj = {"myKey1111": "123", "anotherKey": "abcd"}
outcome = myCache.set("myKey",myObj)
console.log(outcome)
myKeyVal = myCache.get("myKey")
console.log(myKeyVal)
