var path = require('path')
var express = require('express')
var Filter = require('bad-words')
filter = new Filter()

var app = express()

var port = process.env.PORT || 3000

app.use(express.static('public'))

app.use('/images', express.static('./images'))
app.use(express.json())

app.get("/", function(req, res) {
    res.status(200).sendFile(path.join(__dirname, 'public/index.html'))
})

app.get("/gameplay", function(req, res) {
    console.log("Serving gameplay")
    res.status(200).sendFile(path.join(__dirname, 'public/gameplay.html'))
})

app.post("/gameover", function(req, res, next) {
    if (req.body.username && req.body.score) {
        console.log(req.body.username, req.body.score)
    }
})

app.listen(port, function() {
    console.log("Listening on port", port)
})