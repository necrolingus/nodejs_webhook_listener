const cacheController = require("../controller/cacheController")
const cacheKeyCheck = require("../middleware/cacheKeyCheck")

function appRouter(app) {
    const router = require("express").Router();

    // you must use middleware on your routes if you want req.params to be populated. 
    // app.use(cacheKeyCheck) in app.js will have blank req.params
    router.get('/', cacheController.generateUniqueIdAndSetCacheKey)
    router.get('/:webhookId', cacheKeyCheck, cacheController.setCacheItem)
    router.post('/:webhookId', cacheKeyCheck, cacheController.setCacheItem)
    router.delete('/:webhookId', cacheKeyCheck, cacheController.deleteCacheItem)
    router.get('/retrieveData/:webhookId', cacheKeyCheck, cacheController.retrieveData)

    app.use('/',router)
}

module.exports = {appRouter}