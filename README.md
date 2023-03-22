# nodejs_webhook_listener
 
A basic app written in node to which you can post webhooks. Both GET and POST requests can be sent to it and will be saved in node-cache
There is also a dockerfile if you want to dockerize this app

### How to use it
* First make a request to /webhookid to get a unique URL that you can use. (A signed cookie is set with this unique URL)
* Then you can make GET and POST requests to e.g. /webhookId/407beaab-1111-1111-1111-33ab8db2a612
* The headers, body, form data, URL parameters, and cookies are then stored in an Array and sent to node-cache and the key is your unique URL
* Right now 50 items are stored in the cache

### To do
Parameterize things
