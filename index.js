const express = require('express')
var cors = require('cors')



const app = express()
app.use(cors())

app.get('/info', function (req, res) {
    //Get authorization header
    var authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) {
        res.send(400, {error: 'No authorization header sent'});
        return;
    }

    //Check if first part is 'Bearer'
    if(!authorizationHeader.startsWith('Bearer')) {
        res.send(400, {error: 'Authentication Header was no bearer token'});
        return;
    }
    res.send('Hello World')
})
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Mock Resource-Server is running on port ', port)
  })