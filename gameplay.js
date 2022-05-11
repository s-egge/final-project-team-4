
var canvas = document.getElementById('canvas-1')
var c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var bugArray = []

var score = 0
var health = 10



//draws score in top right
function drawScore(){
    c.font = "30px Arial"
    c.fillStyle = "#000000"
    c.fillText("Score: "+score, canvas.width - 200, 40)
}
//draws health in top left
function drawHealth(){
    c.font = "30px Arial"
    c.fillStyle = "#000000"
    c.fillText("Health: "+health, 20, 40)
}

drawHealth()
drawScore()

/**
 * Bug class, with some functionality such as moving and spawning. Also includes random x spawn.
 */
class Bug {
    constructor(){
        this.x = (Math.random() * (canvas.width - 100)) 
        this.y = 0
        this.speedX = Math.random() * 3 + 1
    }
    move(){
        this.y += this.speedX
    }
    spawnBug(){
        c.fillStyle = '#4B3A2F'
        c.beginPath()
        c.arc(this.x, this.y, 25, 0, Math.PI * 2)
        c.fill()
    }
}
//creates a new bug object and pushes it into the main bug array
function createBug() {
    var bug = new Bug()
    bugArray.push(bug)
    bug.spawnBug()
}
createBug()
//base interval + interval object that needs to be reset every interval change
var spawnInterval = 1000
var interval = setInterval(createBug, spawnInterval)


//will move each bug in the bug array, and delete the bug if it reaches the bottom of the screen
function moveBugs(){
    for(var i = 0; i < bugArray.length; i++){
        bugArray[i].move()
        bugArray[i].spawnBug()
        if(bugArray[i].y + 30 >= window.innerHeight){
            health -= 1
            bugArray.splice(i, 1)
        }

    }
}

//the main animation function
function animate(){
    c.clearRect(0, 0, canvas.width, canvas.height)
    moveBugs()
    drawScore()
    drawHealth()
    if(health > 0) {
        requestAnimationFrame(animate)
    }else{
        clearInterval(interval)
    }
}
animate()

//click event listener
canvas.addEventListener('click', function(event){
    for(var i = 0; i < bugArray.length; i++){
        if(isPointValid(bugArray[i], event.x, event.y)){
            bugArray.splice(i, 1)
            score += 10
        }
    }
    if(score % 100 === 0){
        spawnInterval -= 50
        clearInterval(interval)
        interval = setInterval(createBug, spawnInterval)
    }
})

//will check if point clicked is within bug object area, is scaled with speed (slower = smaller hitbox)
function isPointValid(bug, x, y){
    var bugX = bug.x
    var bugY = bug.y
    var radius = 25
    var d = Math.sqrt(Math.pow((x - bugX), 2) + Math.pow((y - bugY), 2))
    return(d <= radius*bug.speedX)
}