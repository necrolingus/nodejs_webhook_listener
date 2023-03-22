const { v4: uuidv4 } = require('uuid');
const nodeCache = require("node-cache");
const { exists } = require('fs');
//keys will live for 2 hours
const myCache = new nodeCache({"stdTTL":7200, "checkperiod": 600, "deleteOnExpire": true, "maxKeys": 1000})


function generateUniqueIdAndCookie(req, res) {
    webhookId = req.signedCookies.webhookId
    if (!webhookId){
        webhookId = uuidv4()
        res.cookie('webhookId', webhookId, {maxAge: 1000 * 60 * 60, // would expire after 60 minutes then user can get a new webhookId
                                            httpOnly: true,
                                            signed: true})
    }
    return res.status(200).send("Send your webhook responses to this unique URL: " + webhookId)
}

function checkCookieWebhookId(webhookId, cookieWebhookId){
    let messageToReturn = ""
    if (!cookieWebhookId){
        messageToReturn = "Make a GET request to / first to get a webhookId"
    } else {
        //Lets check if the key in the cache matches the key the user is passing through.
        //This is not really relevant if signed cookies are used, but lets keep this check
        if (webhookId != cookieWebhookId){
            messageToReturn = "Your webhook IDs do not match"
        }
    }
    return messageToReturn
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
    cookieWebhookId = req.signedCookies.webhookId
    
    //if the cookie is tampered with, i.e. the signature cannot be verified, false will be returned
    if (cookieWebhookId === false){
        return res.status(400).send("Cookie tampered!. Wait for you cookie to expire")
    }
    
    //check cookie value
    cacheOutcome = checkCookieWebhookId(webhookId, cookieWebhookId)
    if (cacheOutcome != "") {
        return res.status(500).send(cacheOutcome)
    }
    
    //generate the newly received data to be pushed onto the array
    cacheValue = generateJsonData(req)
    
    //get the existing value and check if it is an array
    //if it is, add the new value to it. If it is not, create a new array and set the key value
    existingValue = myCache.get(webhookId);
    if (Array.isArray(existingValue)){
        existingValue.unshift(cacheValue)
    } else {
        existingValue = []
        existingValue.unshift(cacheValue)
    }
    
    //lets only store the last 50 items on our array
    if (existingValue.length > 50){
        existingValue.pop() //pop removes the last item
    }

    //set the cache
    outcome = myCache.set(webhookId, existingValue)

    //return the array
    returnJson = {}
    returnJson[webhookId] = existingValue 
    return res.status(200).json(returnJson)
}

function deleteCacheItem(req, res) {
    webhookId = req.params.webhookId
    cookieWebhookId = req.signedCookies.webhookId

    //If there is no cookie with a unique URL, tell the user to get one first
    cacheOutcome = checkCookieWebhookId(webhookId, cookieWebhookId)
    if (cacheOutcome != "") {
        return res.status(500).send(cacheOutcome)
    }

    //check if they key exists before we delete so we can have nicer errors
    keyExists = myCache.has(webhookId);
    if (keyExists === false){
        return res.status(404).send('key does not exist')
    } else {
        outcome = myCache.del(webhookId)
        if (outcome == 1) {
            res.cookie('webhookId', '', {"maxAge":0})
            return res.status(200).send('key deleted')
        } else {
            return res.status(500).json('key cannot be deleted')
        }
    }
}

module.exports = {generateUniqueIdAndCookie, setCacheItem, deleteCacheItem}