
var canvas = document.getElementById('canvas-1')
var c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var bugArray = []
var smooshArray = []

var score = 0
var health = 2

var game_paused = false
var window_focused = true

var homeButtons = document.querySelectorAll('.return-home-button')
for(var i = 0; i < homeButtons.length; i++){
    homeButtons[i].addEventListener('click', function(){
        window.location.href='./index.html'
    })
}

var playAgainButtons = document.querySelectorAll('.play-again-button')
for(var i = 0; i < playAgainButtons.length; i++){
    playAgainButtons[i].addEventListener('click', function(){
        location.reload()
    })
}

//draws score in top right

function drawScore() {
    document.getElementById('score_text').innerHTML = (`Score: ${score}`)
}

//draws health in top left
function drawHealth() {
    document.getElementById('health_text').innerHTML = (`Health: ${health}`)
}

drawHealth()
drawScore()

//Spider object
var Spider = {
    type: "Spider",
    imageSrc: "./images/spider_spritesheet.png",
    widthScale: .5,
    heightScale: 2.5,
    totalFrames: 4,
    row: 0,
    sX_multiplier: 16,
    radius: 50,
    animSpeed: 16
}
/**
 * Lady bug object. The spritesheet has two rows, but the animation works well without worrying about that.
 */
var Ladybug = {
    type: "LadyBug",
    imageSrc: "./images/__red_ladybird_fly.png",
    widthScale: .015,
    heightScale: .09,
    totalFrames: 4,
    row: 750,
    sX_multiplier: 1050,
    radius: 100,
    animSpeed: 16
}
/* Smoosh object. width/height Scale is weighted depending on frames in
spritesheet (16h x 128w). i.e., width scale is 0.375 because overall spritesheet
width is 128. 128 * 0.375 = 48 (px), height scale is 3. 3 * 16 = 48 (px). Square. */
var SpiderSmoosh = {
    imageSrc: "./images/smooshSpider_spritesheet.png",
    widthScale: 0.375,
    heightScale: 3,
    totalFrames: 8,
    sX_multiplier: 16,
    animSpeed: 3
}

var LadyBugSmoosh = {
    imageSrc: "./images/smooshLadyBug_spritesheet.png",
    widthScale: 0.375,
    heightScale: 3,
    totalFrames: 8,
    sX_multiplier: 16,
    animSpeed: 3
}
/*
 * Main Smoosh class. Only one smoosh type right now. input smooshX,Y input from
 * bug on the click event
 */
class Smoosh {
    constructor({ imageSrc, widthScale, heightScale, totalFrames, sX_multiplier, animSpeed}){
        this.smooshX = 0
        this.smooshY = 0
        this.sX = 0

        this.img = new Image()
        this.img.src = imageSrc
        this.framesDrawn = 0
        this.animSpeed = animSpeed //frames per step through spritesheet

        this.widthScale = widthScale
        this.heightScale = heightScale
        this.totalFrames = totalFrames
        this.sX_multiplier = sX_multiplier
    }
    // Creates a smoosh image where bug was killed
    drawSmoosh(){
        c.drawImage(
            this.img,
            this.sX,
            0,
            this.img.width / this.totalFrames,
            this.img.height,
            this.smooshX,
            this.smooshY,
            (this.img.width * this.widthScale),
            (this.img.height * this.heightScale),
        )
    }
    anim() {
        this.framesDrawn++;
    }
}
/**
 * Main bug class. Abstraction allows for input of different insect objects.
 */
class Bug {
    constructor({ type, imageSrc, widthScale, heightScale, totalFrames, row, sX_multiplier, animSpeed }){
        this.type = type
        this.x = (Math.random() * (canvas.width - 100))
        this.sX = 0
        this.y = 10
        this.speedY = Math.random() * 2 + 1
        this.img = new Image()
        this.img.src = imageSrc
        this.framesDrawn = 0

        this.row = row
        this.animSpeed = animSpeed //frames per step through spritesheet

        this.widthScale = widthScale
        this.heightScale = heightScale
        this.totalFrames = totalFrames
        this.sX_multiplier = sX_multiplier

    }
    move(){
        this.y += this.speedY
        this.x += Math.sin(this.y/50)
        this.framesDrawn++
    }
    spawnBug(){
        c.drawImage(
            this.img,
            this.sX,
            this.row,
            this.img.width / this.totalFrames,
            this.img.height,
            this.x,
            this.y,
            (this.img.width * this.widthScale),
            (this.img.height * this.heightScale),
        )
    }
    // creates a new smoosh object and pushes it into the main smoosh array
    smooshBug(){
      console.log("==smooshBug called. Type: ", this.type);
      if (!(game_paused)) {
          switch(this.type){
            case "Spider":
              var smoosh = new Smoosh(SpiderSmoosh)
              break;
            case "LadyBug":
              var smoosh = new Smoosh(LadyBugSmoosh)
              break;
          }
          smoosh.smooshX = this.x
          smoosh.smooshY = this.y
          smooshArray.push(smoosh)
          smoosh.drawSmoosh()
      }
    }
}

const bugType = [Spider, Ladybug]


// creates a new bug object and pushes it into the main bug array
function createBug() {
    if (!(game_paused)) {
        var x = Math.floor(Math.random() * bugType.length)
        var i = new Bug(bugType[x])
        bugArray.push(i)
        i.spawnBug()
    }
}

// changes game state based on pause button
var pause_button = document.getElementsByClassName('pause_button')[0]
// if game is paused, unpause it, if game is unpaused, pause it
pause_button.addEventListener('click', toggle_game_paused)

function toggle_game_paused() {
    if (game_paused) {
        game_paused = false
        document.getElementById('game_paused_screen').classList.add('hidden')
        document.querySelector(".play-pause-img").src = "./images/pause_white.png"
    } else {
        game_paused = true
        document.getElementById('game_paused_screen').classList.remove('hidden')
        document.querySelector(".play-pause-img").src = "./images/play_white.png"
    }
}

//base interval + interval object that needs to be reset every interval change
var spawnInterval = 1000
var interval = setInterval(createBug, spawnInterval)



/**
 * Will move each bug in the bug array, and delete the bug if it reaches the bottom of the screen
 * This function will also animate the bugs by increasing bug.sX.
 */
function moveBugs(){
    if (!(game_paused)) {
        for(var i = 0; i < bugArray.length; i++){
            bugArray[i].move()
            bugArray[i].spawnBug()

            if(bugArray[i].framesDrawn > bugArray[i].animSpeed){
                bugArray[i].sX += bugArray[i].sX_multiplier
                if(bugArray[i].sX > (bugArray[i].sX_multiplier * (bugArray[i].totalFrames - 1))){
                    // console.log((bugArray[i].sX_multiplier * (bugArray[i].totalFrames - 1)))
                    bugArray[i].sX = 0

                }
                bugArray[i].framesDrawn = 0
            }
            if(bugArray[i].y + 30 >= window.innerHeight){
                health -= 1
                bugArray.splice(i, 1)
            }
        }
    }
}
/*
 * This function animates the smoosh graphic spiritesheet in 16px frames.
 */
function animSmoosh(){
    if (!(game_paused)) {
        for(var i = 0; i < smooshArray.length; i++){
            smooshArray[i].anim()
            smooshArray[i].drawSmoosh()
            if(smooshArray[i].framesDrawn > smooshArray[i].animSpeed){
                smooshArray[i].sX += smooshArray[i].sX_multiplier
                if(smooshArray[i].sX > (smooshArray[i].sX_multiplier * (smooshArray[i].totalFrames - 1))){
                    console.log((smooshArray[i].sX_multiplier * (smooshArray[i].totalFrames - 1)))
                }
                smooshArray[i].framesDrawn = 0
            }
        }
    }
}

// the main animation function
function animate(){
    c.clearRect(0, 0, canvas.width, canvas.height)
    moveBugs()
    animSmoosh()
    drawHealth()
    drawScore()
    if(health > 0) {
        requestAnimationFrame(animate)
    }else{
        clearInterval(interval)
        gameOver()
    }
}

animate()

//click event listener
document.addEventListener('click', onClickBug)

//Main click event function. Calls isPointValid to check whether click hits a bug, and resets spawn interval if score hits a certain thershold
function onClickBug(event){
    console.log(event.x + ", " + event.y)
    for(var i = 0; i < bugArray.length; i++){
        if(isPointValid(bugArray[i], event.x, event.y)){
            // createSmoosh(bugArray[i].x, bugArray[i].y)
            bugArray[i].smooshBug()
            bugArray.splice(i, 1)
            score += 10
        }
    }
    if((score % 100 === 0 && score !== 0) && health > 0){
        spawnInterval -= 50
        clearInterval(interval)
        interval = setInterval(createBug, spawnInterval)
    }
}


//uses distance formula to determine if point is within bugs radius
function isPointValid(bug, x, y){
    var bugX = bug.x
    var bugY = bug.y
    var radius = 100

    var d = Math.sqrt(Math.pow((x - bugX), 2) + Math.pow((y - bugY), 2))
    return(d <= radius)
}

window.onfocus = function() {
    window_focused = true
}

window.onblur = function() {
    window_focused = false
}

function pause_if_unfocused() {
    if (!(window_focused)) {
        if (!(game_paused)) {
            toggle_game_paused()
        }
    }
}

var check_focus_interval = setInterval(pause_if_unfocused, 500)




/*-----------Score / gameover handling-----------*/
function gameOver(){
    var top_10_request = new XMLHttpRequest()
    top_10_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //grab scoreData from JSON file and check if user made it
            //into the leaderboard
            var is_top_10 = this.responseText
            if(is_top_10 == "true"){
                madeHighScore()
            } else{
                noHighScore()
            }
        }
    };
    top_10_request.open("POST", "/istop", true)
    top_10_request.setRequestHeader('Content-Type', 'application/json')
    top_10_request.send(JSON.stringify({score: score}))
}

function madeHighScore(){
    console.log("Inside madeHighScore")
    document.getElementById('win-modal').classList.remove('hidden')
    document.getElementById('modal-backdrop').classList.remove('hidden')

    var scoreTextElement = document.getElementById('win-modal').querySelector('.score-text')
    var scoreText = document.createTextNode(score)
        scoreTextElement.appendChild(scoreText)
}

function noHighScore(){
    console.log("Inside noHighScore")
    document.getElementById('lose-modal').classList.remove('hidden')
    document.getElementById('modal-backdrop').classList.remove('hidden')

    var scoreTextElement = document.getElementById('lose-modal').querySelector('.score-text')
    var scoreText = document.createTextNode(score)
        scoreTextElement.appendChild(scoreText)
}

var inputSubmitButton = document.getElementById('input-submit-button')
inputSubmitButton.addEventListener('click', function(){

    var playerInput = document.getElementById('player-input')
    var playerName = playerInput.value

    if(!playerName){
        alert('Please input a name for the scoreboard!')
    } else {
        var username_request = new XMLHttpRequest()
        username_request.open("POST", "/gameover", true)
        username_request.setRequestHeader('Content-Type', 'application/json')
        username_request.send(JSON.stringify({username: playerName, score: score}))
        
        document.getElementById('input-submitted-screen').classList.remove('hidden')
        document.getElementById('win-modal').classList.add('hidden')
    }
})
