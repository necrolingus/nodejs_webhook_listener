const cacheController = require("../controller/cacheController")

function appRouter(app) {
    const router = require("express").Router();

    router.get('/', cacheController.generateUniqueIdAndCookie)
    router.get('/:webhookId', cacheController.setCacheItem)// we dont really need a GET as GET and POST both saves the data and returns what was passed
    router.post('/:webhookId', cacheController.setCacheItem)
    router.delete('/:webhookId', cacheController.deleteCacheItem)

    // router.delete('/:webhookId', (req, res) => {
    //     res.send('the delete route')
    // })
    app.use('/webhookId',router)
}

module.exports = {appRouter}