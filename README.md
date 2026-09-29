# Video Game API and Frontend

A full-stack video game management application built using a Flask REST API, SQLite database, and a plain HTML, CSS, and JavaScript frontend.

The application allows users to view, add, edit, and delete video games through a web interface.

## Features

### Backend API

The Flask API provides the following operations:

* Get all games
* Get a single game by ID
* Add a new game
* Update an existing game
* Delete a game
* API validation for required fields
* 404 handling when a game does not exist
* SQLite database for storing game information

### Frontend

The frontend provides:

* Game list view
* Individual game details
* Add game form
* Edit game form
* Delete game button
* Loading state while games are being retrieved
* Error messages from the API
* Validation error handling
* Responsive layout
* Fetch API integration with the Flask backend

## Technologies Used

### Backend

* Python
* Flask
* Flask-CORS
* SQLite

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

## Project Structure

```text
.
├── app.py
├── requirements.txt
├── .gitignore
├── games.db
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

> `games.db` is created automatically when the Flask application is first run and is ignored by Git.

## API Endpoints

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| GET    | `/games`      | Get all games  |
| GET    | `/games/<id>` | Get one game   |
| POST   | `/games`      | Add a new game |
| PUT    | `/games/<id>` | Update a game  |
| DELETE | `/games/<id>` | Delete a game  |

### Game Fields

Each game contains:

```text
id
title
genre
platform
release_year
developer
```

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_FOLDER
```

### 2. Create a virtual environment

Windows:

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### 3. Install the dependencies

```bash
python -m pip install -r requirements.txt
```

The required packages include Flask and Flask-CORS.

## Running the Backend

Start the Flask API with:

```bash
python app.py
```

The API will run at:

```text
http://127.0.0.1:5000
```

When the application starts for the first time, the SQLite database and initial game records are created automatically.

You can test the API by opening:

```text
http://127.0.0.1:5000/games
```

in your browser.

## Running the Frontend

After starting the Flask backend, open the `frontend` folder using a local development server such as VS Code Live Server.

Open:

```text
frontend/index.html
```

The frontend communicates with the Flask API at:

```text
http://127.0.0.1:5000/games
```

Flask-CORS is enabled so that the browser can make requests from the frontend to the backend when they are running on different ports.

## Adding a Game

Use the **Add New Game** form and provide:

* Title
* Genre
* Platform
* Release Year
* Developer

Click **Add Game** to send a POST request to the API.

## Editing a Game

Click the **Edit** button on a game.

The existing information will be loaded into the form. After making changes, click **Update Game** to send a PUT request to the API.

## Viewing a Game

Click the **View** button to retrieve and display the selected game's information using the GET-by-ID endpoint.

## Deleting a Game

Click the **Delete** button on a game and confirm the deletion.

The frontend sends a DELETE request to the API and refreshes the game list.

## Error Handling

The application handles several API errors.

### Validation Error

If a required field is missing when adding or editing a game, the API returns a `400` response with a validation message.

For example:

```json
{
    "error": "Missing required field: title"
}
```

The frontend displays this error message to the user.

### Game Not Found

If a game ID does not exist, the API returns a `404` response:

```json
{
    "error": "Game not found"
}
```

The frontend displays an appropriate error message instead of leaving the page blank.

## Database

The application uses SQLite.

The database file is:

```text
games.db
```

The database is automatically created by `app.py`.

The `games` table contains:

```text
id
title
genre
platform
release_year
developer
```

The application also inserts initial video game records when the database is empty.

## Git Ignore

The following files are excluded from Git:

```text
venv/
__pycache__/
*.pyc
games.db
```

These files are generated locally and do not need to be uploaded to the repository.