var startButton = document.getElementById('start-button')
var closeGuideButton = document.querySelector('.close-guide-button')
var modalBackdrop = document.getElementById('modal-backdrop')
var guideButton = document.getElementById('guide-button')
var guideModal = document.getElementById('guide-modal')

startButton.addEventListener('click', function(){
    window.location.href='/gameplay.html'
})

guideButton.addEventListener('click', function(){
    modalBackdrop.classList.remove('hidden')
    guideModal.classList.remove('hidden')
})

closeGuideButton.addEventListener('click', function(){
    modalBackdrop.classList.add('hidden')
    guideModal.classList.add('hidden')
})