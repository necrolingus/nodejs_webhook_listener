const { v4: uuidv4 } = require('uuid');
const nodeCache = require("node-cache");
const { exists } = require('fs');
//keys will live for 2 hours
const myCache = new nodeCache({"stdTTL":7200, "checkperiod": 600, "deleteOnExpire": true, "maxKeys": 1000})


function generateUniqueId(req, res) {
    webhookId = uuidv4()
    myCache.set(webhookId, [])
    return res.status(200).send("Send your webhook responses to this unique URL: " + webhookId)
}

function checkIfCacheKeyExists(webhookId) {
    keyExists = myCache.has(webhookId);
    if (keyExists === false){
        return 'Key does not exist. Get a key from /'
    }
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
    doesKeyEsist = checkIfCacheKeyExists(webhookId)
    if (doesKeyEsist){
        return res.status(404).send(doesKeyEsist)
    }
       
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
    doesKeyEsist = checkIfCacheKeyExists(webhookId)
    if (doesKeyEsist){
        return res.status(404).send(doesKeyEsist)
    }
    
    outcome = myCache.del(webhookId)
    if (outcome == 1) {
        return res.status(200).send('key deleted')
    } else {
        return res.status(500).json('key cannot be deleted')
    }
}

function getData(req, res) {
    webhookId = req.params.webhookId
    doesKeyEsist = checkIfCacheKeyExists(webhookId)
    if (doesKeyEsist){
        return res.status(404).send(doesKeyEsist)
    }

    existingValue = myCache.get(webhookId);
    returnJson = {}
    returnJson[webhookId] = existingValue 
    return res.status(200).json(returnJson)
}

module.exports = {generateUniqueId, setCacheItem, deleteCacheItem, getData}