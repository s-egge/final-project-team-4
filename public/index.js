var startButton = document.getElementById('start-button')
var closeModalButton = document.querySelectorAll('.close-modal-button')
var modalBackdrop = document.getElementById('modal-backdrop')
var guideButton = document.getElementById('guide-button')
var guideModal = document.getElementById('guide-modal')
var highScoreButton = document.getElementById('scores-button')
var highScoreModal = document.getElementById('high-score-modal')

startButton.addEventListener('click', function(){
    window.location.href='./gameplay.html'
})

guideButton.addEventListener('click', function(){
    modalBackdrop.classList.remove('hidden')
    guideModal.classList.remove('hidden')
})

highScoreButton.addEventListener('click', function(){
    modalBackdrop.classList.remove('hidden')
    highScoreModal.classList.remove('hidden')
    console.log(highScoreModal)
})

//closes both the guide and high-score modal
for(var i = 0; i < closeModalButton.length; i++){
    closeModalButton[i].addEventListener('click', function(event){
        event.target.parentNode.parentNode.classList.add('hidden')
        modalBackdrop.classList.add('hidden')
    })
}