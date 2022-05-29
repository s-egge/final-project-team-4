var path = require('path')
var express = require('express')
var Filter = require('bad-words')
var scores = require("./scores.json")
var fs = require('fs')

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
    res.status(200).sendFile(path.join(__dirname, 'public/gameplay.html'))
})

app.post("/gameover", function(req, res, next) { // push scores to DB if in top 10
    var json_obj = {}
    if (req.body.username && req.body.score) {
        Object.assign(scores, {[req.body.username]: req.body.score})
    }
    var sorted_keys = Object.keys(scores).sort(function(a,b){
        return scores[b]-scores[a]
    })
    var top_10 = sorted_keys.slice(0, 10)
    for (var i = 0; i < 10; i++) {
        if (top_10[i] == req.body.username) {
            json_obj[top_10[i]] = req.body.score 
        } else {
            json_obj[top_10[i]] = scores[top_10[i]]
        }
    }
    fs.writeFile('scores.json', JSON.stringify(json_obj), error => {
        if (error) throw error
    })
})

app.get("/scores", function(req, res) {
    res.status(200).send(scores)
})

app.post("/istop", function(req, res) { // GET request to /istop with a score returns true or false
    var score_values = Object.keys(scores).map(function(key) {
        return scores[key]
    })
    score_values.sort((a,b) => b-a)
    if (req.body.score > score_values[9]) {
        res.status(200).send(true)
    } else {
        res.status(200).send(false)
    }
})

app.listen(port, function() {
    console.log("Listening on port", port)
})