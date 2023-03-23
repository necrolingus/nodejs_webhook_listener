const myCache = require('../controller/cacheDeclaration')

function checkIfCacheKeyExists(req, res, next) {
    webhookId = req.params.webhookId
    keyExists = myCache.has(webhookId);
    if (keyExists === false){
        return res.status(404).send('webhookId does not exist. Get one from / If you already did, update your webhookId')
    }
    next()
}
module.exports = checkIfCacheKeyExists