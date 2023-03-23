# nodejs_webhook_listener
 
A basic app written in node to which you can post webhooks. Both GET and POST requests can be sent to it and will be saved in node-cache
There is also a dockerfile if you want to dockerize this app

### How to use it
* First make a request to / to get a webhookId that you can use.
* Then you can make GET and POST requests to /:webhookId
* The headers, body, form data, URL parameters, and cookies are all stored in an Array and sent to node-cache and the key is your unique URL
* You can also DELETE your endpoint to delete the data by making a DELETE request to /:webhookId
* To retrieve your data make a request to /getData/:webhookId
* Right now 50 items are stored in the cache

### To do
Parameterize things and middleware some checks
