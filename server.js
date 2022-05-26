var path = require('path')
var express = require('express')

var app = express()

var port = process.env.PORT || 3000

app.use(express.static('public'))

app.use('/images', express.static('./images'))

app.get("/", function(req, res) {
    res.status(200).render('index')
})

app.get("/gameplay.html", function(req, res) {
    res.status(200).render('gameplay')
})

app.listen(port, function() {
    console.log("Listening on port", port)
})