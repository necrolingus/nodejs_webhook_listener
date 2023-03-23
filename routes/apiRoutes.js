const cacheController = require("../controller/cacheController")

function appRouter(app) {
    const router = require("express").Router();

    router.get('/', cacheController.generateUniqueId)
    router.get('/:webhookId', cacheController.setCacheItem)
    router.post('/:webhookId', cacheController.setCacheItem)
    router.delete('/:webhookId', cacheController.deleteCacheItem)
    router.get('/getData/:webhookId', cacheController.getData)

    // router.delete('/:webhookId', (req, res) => {
    //     res.send('the delete route')
    // })
    app.use('/',router)
}

module.exports = {appRouter}