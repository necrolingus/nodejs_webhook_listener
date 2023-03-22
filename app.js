const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()

//these middlewares MUST come before the route require otherwise we cannot get the request body
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support url-encoded bodies

//import the cookie middleware
app.use(cookieParser('mycookiesecret', {}));

const webhookRouter = require('./routes/apiRoutes')
const appRouter = webhookRouter.appRouter(app)

app.listen(3000, () => {
    console.log('App is running')
})