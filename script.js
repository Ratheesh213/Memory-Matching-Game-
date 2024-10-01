const levelConfigurations = [
    { range: [1, 5], icons: ['🍎', '🍌', '🍒', '🍇', '🍉'], cardCount: 6, flipBackTime: 1000 },
    { range: [6, 12], icons: ['🐶', '🐱', '🐭', '🐹', '🐰'], cardCount: 8, flipBackTime: 900 },
    { range: [13, 18], icons: ['🍓', '🍈', '🍊', '🍋', '🍍'], cardCount: 10, flipBackTime: 800 },
    { range: [19, 25], icons: ['🚗', '🚕', '🚙', '🚌', '🚎'], cardCount: 12, flipBackTime: 700 },
    { range: [26, 35], icons: ['⚽', '🏀', '🏈', '⚾', '🎾'], cardCount: 14, flipBackTime: 600 },
    { range: [36, 45], icons: ['🎣', '🏋️', '🏊', '🚴', '🏄'], cardCount: 16, flipBackTime: 500 },
    { range: [46, 55], icons: ['❤️', '💛', '💚', '💙', '💜'], cardCount: 18, flipBackTime: 400 },
    { range: [56, 75], icons: ['🌟', '🌈', '☀️', '☁️', '🌧️'], cardCount: 20, flipBackTime: 300 },
    { range: [76, 100], icons: ['🔔', '🎵', '🎶', '🎼', '🎤'], cardCount: 22, flipBackTime: 250 },
    { range: [101, 120], icons: ['🌍', '🌎', '🌏', '🪐', '⭐'], cardCount: 24, flipBackTime: 200 },
    { range: [121, 180], icons: ['🎨', '🖌️', '🎭', '🎤', '🎹'], cardCount: 26, flipBackTime: 150 },
    { range: [181, 250], icons: ['🍕', '🍔', '🌭', '🍟', '🍗'], cardCount: 28, flipBackTime: 100 },
    { range: [251, 300], icons: ['🍳', '🥚', '🧂', '🍳', '🧊'], cardCount: 30, flipBackTime: 90 },
    { range: [301, 350], icons: ['🍽️', '🍾', '🍷', '🥂', '🍸'], cardCount: 32, flipBackTime: 80 },
    { range: [351, 400], icons: ['🎷', '🎺', '🥁', '🪕', '🪗'], cardCount: 34, flipBackTime: 70 },
    { range: [401, 500], icons: ['🍩', '🍦', '🍰', '🍪', '🍫'], cardCount: 36, flipBackTime: 60 },
];

const gameContainer = document.getElementById("game-container");
const levelDisplay = document.getElementById("level");
const nextLevelButton = document.getElementById("next-level-button");
const notification = document.getElementById("notification");
const backgroundSound = document.getElementById("background-sound");
const cardSound = document.getElementById("card-sound");

let level = 1;
let iconSet = [];
let cardValues = [];
let flippedCards = [];
let matchedCards = [];
let flipBackTime = 1000; // Default flip back time

function startGame() {
    backgroundSound.play();
    iconSet = getIconSet(level);
    createCards(iconSet);
    levelDisplay.innerText = level;
    nextLevelButton.classList.remove("show"); // Hide next level button at the start
}

function getIconSet(level) {
    for (const config of levelConfigurations) {
        if (level >= config.range[0] && level <= config.range[1]) {
            flipBackTime = config.flipBackTime; // Set flip back time based on level
            return shuffle([...config.icons.slice(0, config.cardCount / 2), ...config.icons.slice(0, config.cardCount / 2)]); // Use only the required number of icons
        }
    }
    return [];
}

function createCards(iconSet) {
    gameContainer.innerHTML = ''; // Clear previous cards
    cardValues = [];
    matchedCards = [];
    
    iconSet.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerText = "?";
        card.dataset.icon = icon;

        card.addEventListener("click", () => flipCard(card));
        gameContainer.appendChild(card);
        cardValues.push(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
        cardSound.play(); // Play sound when card is clicked
        card.classList.add("flipped");
        card.innerText = card.dataset.icon;

        flippedCards.push(card);

        // Show notification for card flip (removed as per request)
        // showNotification(`You flipped a card with icon: ${card.dataset.icon}`);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.icon === secondCard.dataset.icon) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedCards.push(firstCard, secondCard);
        flippedCards = [];

        if (matchedCards.length === cardValues.length) {
            completeLevel();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            firstCard.innerText = "?";
            secondCard.classList.remove("flipped");
            secondCard.innerText = "?";
            flippedCards = [];
        }, flipBackTime); // Use the flipBackTime for flipping back
    }
}

function completeLevel() {
    showNotification(`Level ${level} completed!`);
    nextLevelButton.classList.add("show"); // Show the button after completing the level
}

nextLevelButton.addEventListener("click", () => {
    level++;
    startGame();
});

// Function to show notifications
function showNotification(message) {
    notification.innerText = message;
    notification.classList.add("visible");
    setTimeout(() => {
        notification.classList.remove("visible");
    }, 3000); // Notification displays for  seconds
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

startGame();

// Memory Matching Game API Endpoint
const apiUrl = "https://api.sheety.co/ca979bdf24da2fab3e4a91bc4c537097/memoryMatchingGameSheet/sheet1";

// Check if a user ID exists in localStorage
let userId = localStorage.getItem('userId');
if (!userId) {
    // Generate a new user ID
    userId = 'user_' + Math.random().toString(36).substr(2, 9); 
    localStorage.setItem('userId', userId);
    
    // Store the new user in the API
    createUser(userId);
} else {
    // Update the user's last active date if they already have an ID
    updateUserActivity(userId);
}

// Create a new user
function createUser(userId) {
    const userData = {
        sheet1: {
            userId: userId,
            lastActive: new Date().toISOString().split('T')[0] // Current date
        }
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(response => response.json())
      .then(data => console.log("User created:", data))
      .catch(error => console.error("Error:", error));
}

// Update user last active date
function updateUserActivity(userId) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const user = data.sheet1.find(u => u.userId === userId);
            if (user) {
                const userIdToUpdate = user.id;
                const updatedUserData = {
                    sheet1: {
                        lastActive: new Date().toISOString().split('T')[0]
                    }
                };
                fetch(`${apiUrl}/${userIdToUpdate}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedUserData)
                })
                .then(response => response.json())
                .then(data => console.log("User activity updated:", data))
                .catch(error => console.error("Error:", error));
            }
        });
}

// Delete users inactive for 30 days
function deleteInactiveUsers() {
    const today = new Date();
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.sheet1.forEach(user => {
                const lastActiveDate = new Date(user.lastActive);
                const daysInactive = Math.floor((today - lastActiveDate) / (1000 * 60 * 60 * 24));
                
                if (daysInactive > 30) {
                    // Delete the user if inactive for more than 30 days
                    fetch(`${apiUrl}/${user.id}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => console.log("User deleted:", data))
                    .catch(error => console.error("Error:", error));
                }
            });
        });
}
