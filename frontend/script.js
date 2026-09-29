const API_URL = "http://127.0.0.1:5000/games";

const gameForm = document.getElementById("gameForm");
const gamesContainer = document.getElementById("gamesContainer");
const loading = document.getElementById("loading");
const gameCount = document.getElementById("gameCount");
const statusMessage = document.getElementById("statusMessage");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const refreshButton = document.getElementById("refreshButton");

let editingGameId = null;


// Show success/error messages
function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-${type}`;

    setTimeout(() => {
        statusMessage.className = "status-message";
    }, 4000);
}


// Get all games
async function loadGames() {

    loading.style.display = "block";
    gamesContainer.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load games.");
        }

        const games = await response.json();

        gameCount.textContent = `${games.length} game(s)`;

        games.forEach(game => {
            displayGame(game);
        });

    } catch (error) {

        gamesContainer.innerHTML = `
            <p class="status-error">
                Unable to connect to the API. Make sure the Flask server is running.
            </p>
        `;

        gameCount.textContent = "Unable to load games.";

    } finally {

        loading.style.display = "none";
    }
}


// Display one game
function displayGame(game) {

    const gameCard = document.createElement("div");

    gameCard.className = "game-card";

    gameCard.innerHTML = `
        <h3>${escapeHTML(game.title)}</h3>

        <div class="game-info">
            <p><strong>ID:</strong> ${game.id}</p>
            <p><strong>Genre:</strong> ${escapeHTML(game.genre)}</p>
            <p><strong>Platform:</strong> ${escapeHTML(game.platform)}</p>
            <p><strong>Release Year:</strong> ${game.release_year}</p>
            <p><strong>Developer:</strong> ${escapeHTML(game.developer)}</p>
        </div>

        <div class="game-actions">
            <button class="view-button" onclick="viewGame(${game.id})">
                View
            </button>

            <button class="edit-button" onclick="editGame(${game.id})">
                Edit
            </button>

            <button class="delete-button" onclick="deleteGame(${game.id})">
                Delete
            </button>
        </div>
    `;

    gamesContainer.appendChild(gameCard);
}


// View one game
async function viewGame(gameId) {

    try {

        const response = await fetch(`${API_URL}/${gameId}`);

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || "Game not found.", "error");
            return;
        }

        alert(
            `Game Details\n\n` +
            `ID: ${data.id}\n` +
            `Title: ${data.title}\n` +
            `Genre: ${data.genre}\n` +
            `Platform: ${data.platform}\n` +
            `Release Year: ${data.release_year}\n` +
            `Developer: ${data.developer}`
        );

    } catch (error) {

        showMessage("Unable to connect to the API.", "error");
    }
}


// Load game into edit form
async function editGame(gameId) {

    try {

        const response = await fetch(`${API_URL}/${gameId}`);

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || "Game not found.", "error");
            return;
        }

        editingGameId = gameId;

        document.getElementById("title").value = data.title;
        document.getElementById("genre").value = data.genre;
        document.getElementById("platform").value = data.platform;
        document.getElementById("release_year").value = data.release_year;
        document.getElementById("developer").value = data.developer;

        formTitle.textContent = "Edit Game";
        submitButton.textContent = "Update Game";
        cancelEditButton.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        showMessage("Unable to connect to the API.", "error");
    }
}


// Add or update game
gameForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const gameData = {
        title: document.getElementById("title").value.trim(),
        genre: document.getElementById("genre").value.trim(),
        platform: document.getElementById("platform").value.trim(),
        release_year: document.getElementById("release_year").value,
        developer: document.getElementById("developer").value.trim()
    };

    const url = editingGameId
        ? `${API_URL}/${editingGameId}`
        : API_URL;

    const method = editingGameId
        ? "PUT"
        : "POST";

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gameData)
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || "Something went wrong.", "error");
            return;
        }

        if (editingGameId) {
            showMessage("Game updated successfully!", "success");
        } else {
            showMessage("Game added successfully!", "success");
        }

        resetForm();

        loadGames();

    } catch (error) {

        showMessage(
            "Unable to connect to the API. Make sure Flask is running.",
            "error"
        );
    }
});


// Delete game
async function deleteGame(gameId) {

    const confirmed = confirm(
        "Are you sure you want to delete this game?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${gameId}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || "Unable to delete game.", "error");
            return;
        }

        showMessage("Game deleted successfully!", "success");

        loadGames();

    } catch (error) {

        showMessage("Unable to connect to the API.", "error");
    }
}


// Cancel edit
cancelEditButton.addEventListener("click", function() {
    resetForm();
});


// Reset form
function resetForm() {

    gameForm.reset();

    editingGameId = null;

    formTitle.textContent = "Add New Game";
    submitButton.textContent = "Add Game";

    cancelEditButton.classList.add("hidden");
}


// Refresh games
refreshButton.addEventListener("click", function() {
    loadGames();
});


// Basic HTML escaping
function escapeHTML(value) {

    const div = document.createElement("div");
    div.textContent = value;

    return div.innerHTML;
}


// Load games when page opens
loadGames();