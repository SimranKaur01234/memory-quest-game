const levels = [
    { name: "Beginner", pairs: 4 },
    { name: "Intermediate", pairs: 6 },
    { name: "Advanced", pairs: 8 },
    { name: "Pro", pairs: 10 },
];

let currentLevel = 0;
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timer;
let timeLeft = 60;
const emojis = ["💻", "🧪", "🩺", "🎨", "⚖️", "✈️", "📚", "🚀", "🎬", "🎧"];

function startGame() {
    resetGame();
    document.getElementById("levelName").textContent = levels[currentLevel].name;
    const pairs = levels[currentLevel].pairs;
    const cards = generateCards(pairs);
    shuffle(cards);
    renderBoard(cards);
    startTimer();
}

function generateCards(pairs) {
    const selected = emojis.slice(0, pairs);
    const cardSet = [...selected, ...selected];
    return cardSet.map((emoji, index) => ({
        id: index,
        emoji,
        matched: false,
    }));
}

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function renderBoard(cards) {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";

    const cols = Math.min(levels[currentLevel].pairs, 5);
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.emoji = card.emoji;

        cardElement.innerHTML = `
      <div class="front"></div>
      <div class="back">${card.emoji}</div>
    `;

        cardElement.addEventListener("click", () => flipCard(cardElement));
        board.appendChild(cardElement);
    });
}

function flipCard(card) {
    if (lockBoard || card.classList.contains("flip")) return;

    card.classList.add("flip");
    playSound("flip.mp3");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        playSound("match.mp3");
        score += 10;
        document.getElementById("score").textContent = score;

        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetFlippedCards();

        if (document.querySelectorAll(".card:not(.flip)").length === 0) {
            clearInterval(timer);
            setTimeout(() => {
                alert("🎉 Level Cleared!");
                currentLevel++;
                if (currentLevel < levels.length) {
                    startGame();
                } else {
                    alert("🏆 Congratulations! You’ve completed all levels!");
                }
            }, 800);
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            resetFlippedCards();
        }, 1000);
    }
}

function resetFlippedCards() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function startTimer() {
    timeLeft = 60;
    document.getElementById("timer").textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            alert("⏰ Time’s up! Try again.");
            startGame();
        }
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    score = 0;
    document.getElementById("score").textContent = "0";
    firstCard = secondCard = null;
    lockBoard = false;
}

// Sound effects
function playSound(filename) {
    const audio = new Audio(filename);
    audio.play();
}