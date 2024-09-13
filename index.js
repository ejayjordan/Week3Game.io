const gridContainer = document.querySelector(".grid-container")
let cards = []
let firstCard, secondCard
let lockBoard = false
let matches = 0

document.querySelector(".score").textContent = matches

fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
    cards = [...data, ...data]
    shuffleCards()
    generateCards()
});

function shuffleCards(){
    let currentIndex = cards.length,
    randomIndex,
    temporaryValue
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = cards[currentIndex]
        cards[currentIndex] = cards[randomIndex]
        cards[randomIndex] = temporaryValue
    }
}

function generateCards() {
    for(let card of cards){
        const cardElement = document.createElement("div")
        cardElement.classList.add("cards")
        cardElement.setAttribute("data-name", cards.image)
        cardElement.dataset = `
            <div class="front">
            <img class="front-image" src=${card.image} />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement)
        cardElement.addEventListener("click", flipCard)
    }
}

function flipCard() {
    if (lockBoard) return
    if (this === firstCard) return

    this.classList.add("flipped")

    if(!firstCard){
        firstCard = this
        return
    }

    secondCard = this
    matches++
    document.querySelector(".score").textContent = score
    lockBoard = true

    checkMatch()
}

function checkMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name

    isMatch ? disableCards() : unflipCards()   
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard)
    secondCard.removeEventListener("click", flipCard)

    resetBoard()
}

function unflipCards(){
    setTimeout(() => {
        firstCard.classList.remove("flipped")
        secondCard.classList.remove("flipped")
        resetBoard()
    }, 1000)
}

function resetBoard(){
    firstCard = null
    secondCard = null
    lockBoard = false
}

function restart() {
    resetBoard()
    shuffleCards()
    score = 0
    document.querySelector(".score").textContent = matches;
    gridContainer.innerHTML = "";
    generateCards()
}