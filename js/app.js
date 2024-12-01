var playerHand = [];
var dealerHand = [];
var deck = [];
var playerScore = 0;
var dealerScore = 0;

var playerHandDiv = document.getElementById("player-hand");
var dealerHandDiv = document.getElementById("dealer-hand");
var playerScoreSpan = document.getElementById("player-score");
var dealerScoreSpan = document.getElementById("dealer-score");
var message = document.getElementById("message");
var deckImage = document.getElementById("deck-image");

function createDeck() {
    var suits = ["hearts", "diamonds", "clubs", "spades"]; 
    var values = [
        "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
        "jack", "queen", "king"
    ]; 
    deck = []; 

    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            var card = {
                suit: suits[i],
                value: values[j],
                image: "./" + values[j] + "_of_" + suits[i] + ".png" 
            };
            deck.push(card);
        }
    }
}

function shuffleDeck() {
    for (var i = deck.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}

function calculateScore(hand) {
    var score = 0;
    var aces = 0;

    for (var i = 0; i < hand.length; i++) {
        var card = hand[i];
        if (card.value === "ace") {
            aces++;
            score += 11;
        } else if (card.value === "jack" || card.value === "queen" || card.value === "king") {
            score += 10;
        } else {
            score += parseInt(card.value, 10);
        }
    }

   
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

function dealCard(hand, handDiv) {
    var card = deck.pop(); 
    hand.push(card); 

    var cardBack = document.createElement("img");
    cardBack.src = "./back.png"; 
    cardBack.alt = "Card Back";

    var cardFace = document.createElement("img");
    cardFace.src = card.image; 
    cardFace.alt = card.value + " of " + card.suit;
    cardFace.style.visibility = "hidden";

    document.body.appendChild(cardBack);

    var deckRect = deckImage.getBoundingClientRect();
    var handRect = handDiv.getBoundingClientRect();

    var offsetX = hand.length * 90;

    gsap.fromTo(cardBack, {
        x: deckRect.left,
        y: deckRect.top
    }, {
        x: handRect.left - deckRect.left + offsetX,
        y: handRect.top - deckRect.top,
        duration: 0.5,
        onComplete: function () {
            cardBack.style.visibility = "hidden";
            cardFace.style.visibility = "visible";
            handDiv.appendChild(cardFace); 
        }
    });
}

function updateUI() {
    playerScoreSpan.textContent = playerScore;
    dealerScoreSpan.textContent = dealerScore;
}

function startGame() {
    createDeck();
    shuffleDeck();

    playerHand = [];
    dealerHand = [];
    playerHandDiv.innerHTML = ""; 
    dealerHandDiv.innerHTML = ""; 

    dealCard(playerHand, playerHandDiv);
    dealCard(playerHand, playerHandDiv);
    dealCard(dealerHand, dealerHandDiv);
    dealCard(dealerHand, dealerHandDiv);

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    updateUI();
    message.textContent = "Hit or Stand?";
}

document.getElementById("hit-btn").addEventListener("click", function () {
    dealCard(playerHand, playerHandDiv);
    playerScore = calculateScore(playerHand);
    updateUI();

    if (playerScore > 21) {
        message.textContent = "You busted! Dealer wins.";
    }
});

document.getElementById("stand-btn").addEventListener("click", function () {
    while (dealerScore < 17) {
        dealCard(dealerHand, dealerHandDiv);
        dealerScore = calculateScore(dealerHand);
    }

    updateUI();

    if (dealerScore > 21 || playerScore > dealerScore) {
        message.textContent = "You win!";
    } else if (playerScore === dealerScore) {
        message.textContent = "It's a tie!";
    } else {
        message.textContent = "Dealer wins!";
    }
});

document.getElementById("reset-btn").addEventListener("click", startGame);

startGame();
