const { v4: uuidv4 } = require('uuid');
const myCache = require('./cacheDeclaration')


function generateUniqueIdAndSetCacheKey(req, res) {
    webhookId = uuidv4()
    myCache.set(webhookId, [])
    return res.status(200).send(`<html>
                                <head>
                                <title>Webhook tester</title>
                                </head>
                                <body>
                                    <p><strong>Send your webhook responses to this unique URL:</strong> ` + webhookId + `
                                    <br>
                                    <strong>You can check the readme here:</strong> 
                                    <a href='https://github.com/necrolingus/nodejs_webhook_listener' target='_blank'>https://github.com/necrolingus/nodejs_webhook_listener</a>
                                    <br>
                                    <strong>Want to host it yourself? Get the package here: </strong>
                                    <span>docker pull ghcr.io/necrolingus/nodejs_webhook_listener:latest</span></p>
                                    <p>
                                    <strong>What do I do with the data you send here?</strong>
                                    <br>
                                    Absolutely nothing. I do no care about your data nor do I have the time to get rummage through 
                                    the data you send.
                                    <br>
                                    If you are worried about privacy, then host this project yourself, that it the reason I created
                                    this project in the first place so that I dont have to send my data to a 
                                    3rd party like webhook.site. 
                                    </p>
                                </body>
                                </html>`)
}

function generateJsonData(req){
    allReqHeaders = req.headers
    allReqCookies = req.cookies
    allReqParams = req.params
    allReqQuery = req.query
    allReqBody = req.body
    host = allReqHeaders.host

    //build up the Object key
    let requestDate = new Date()
    requestDate.toISOString()    
    fullKey = host + " -- " + req.method + " -- " + requestDate
    
    let cacheValue = {}
    cacheValue[fullKey] = {                           
                            "Headers": allReqHeaders, 
                            "Cookies": allReqCookies, 
                            "Params": allReqParams, 
                            "Query": allReqQuery, 
                            "Body": allReqBody        
                        }
    return cacheValue
}

function setCacheItem(req, res) {
    webhookId = req.params.webhookId
         
    //generate the newly received data to be pushed onto the array
    cacheValue = generateJsonData(req)    
    existingValue = myCache.get(webhookId)
    existingValue.unshift(cacheValue)
        
    //lets only store the last 50 items on our array
    if (existingValue.length > 50){
        existingValue.pop() //pop removes the last item
    }
    outcome = myCache.set(webhookId, existingValue)
    return res.status(200).send('OK')
}

function deleteCacheItem(req, res) {
    webhookId = req.params.webhookId
   
    outcome = myCache.del(webhookId)
    if (outcome == 1) {
        return res.status(200).send('key deleted')
    } else {
        return res.status(500).json('key cannot be deleted')
    }
}

function retrieveData(req, res) {
    webhookId = req.params.webhookId
    
    existingValue = myCache.get(webhookId);
    returnJson = {}
    returnJson[webhookId] = existingValue 
    return res.status(200).json(returnJson)
}

module.exports = {generateUniqueIdAndSetCacheKey, setCacheItem, deleteCacheItem, retrieveData}