from flask import Flask, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = "games.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_database():
    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            genre TEXT NOT NULL,
            platform TEXT NOT NULL,
            release_year INTEGER NOT NULL,
            developer TEXT NOT NULL
        )
    """)

    # Check if the table already has data
    game_count = connection.execute(
        "SELECT COUNT(*) FROM games"
    ).fetchone()[0]

    if game_count == 0:
        games = [
            ("Minecraft", "Sandbox", "PC", 2011, "Mojang Studios"),
            ("Stardew Valley", "Simulation", "PC", 2016, "ConcernedApe"),
            ("Terraria", "Sandbox", "PC", 2011, "Re-Logic"),
            ("Hollow Knight", "Metroidvania", "PC", 2017, "Team Cherry"),
            ("Celeste", "Platformer", "PC", 2018, "Maddy Makes Games"),
            ("Hades", "Action RPG", "PC", 2020, "Supergiant Games"),
            ("Portal 2", "Puzzle", "PC", 2011, "Valve"),
            ("Undertale", "RPG", "PC", 2015, "Toby Fox"),
            ("Cuphead", "Platformer", "PC", 2017, "Studio MDHR"),
            ("Overcooked! 2", "Cooking Simulation", "PC", 2018, "Ghost Town Games"),
            ("Subnautica", "Survival", "PC", 2018, "Unknown Worlds Entertainment"),
            ("Dead Cells", "Roguelike", "PC", 2018, "Motion Twin"),
            ("Slay the Spire", "Card RPG", "PC", 2019, "Mega Crit"),
            ("Ori and the Blind Forest", "Metroidvania", "PC", 2015, "Moon Studios"),
            ("Risk of Rain 2", "Roguelike", "PC", 2020, "Hopoo Games")
        ]

        connection.executemany("""
            INSERT INTO games
            (title, genre, platform, release_year, developer)
            VALUES (?, ?, ?, ?, ?)
        """, games)

    connection.commit()
    connection.close()


@app.route("/")
def home():
    return "Video Game API is running!"
    

@app.route("/games", methods=["GET"])
def get_games():
    connection = get_db_connection()
    games = connection.execute("SELECT * FROM games").fetchall()
    connection.close()

    return [dict(game) for game in games], 200


@app.route("/games/<int:game_id>", methods=["GET"])
def get_game(game_id):
    connection = get_db_connection()
    game = connection.execute(
        "SELECT * FROM games WHERE id = ?",
        (game_id,)
    ).fetchone()
    connection.close()

    if game is None:
        return {"error": "Game not found"}, 404

    return dict(game), 200


@app.route("/games", methods=["POST"])
def create_game():
    data = request.get_json(silent=True)

    if not data:
        return {"error": "Request body must contain JSON data"}, 400

    required_fields = [
        "title",
        "genre",
        "platform",
        "release_year",
        "developer"
    ]

    for field in required_fields:
        if field not in data or data[field] == "":
            return {"error": f"Missing required field: {field}"}, 400

    connection = get_db_connection()

    cursor = connection.execute("""
        INSERT INTO games
        (title, genre, platform, release_year, developer)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data["title"],
        data["genre"],
        data["platform"],
        data["release_year"],
        data["developer"]
    ))

    connection.commit()

    new_game_id = cursor.lastrowid

    game = connection.execute(
        "SELECT * FROM games WHERE id = ?",
        (new_game_id,)
    ).fetchone()

    connection.close()

    return dict(game), 201


@app.route("/games/<int:game_id>", methods=["PUT"])
def update_game(game_id):
    data = request.get_json(silent=True)

    if not data:
        return {"error": "Request body must contain JSON data"}, 400

    required_fields = [
        "title",
        "genre",
        "platform",
        "release_year",
        "developer"
    ]

    for field in required_fields:
        if field not in data or data[field] == "":
            return {"error": f"Missing required field: {field}"}, 400

    connection = get_db_connection()

    game = connection.execute(
        "SELECT * FROM games WHERE id = ?",
        (game_id,)
    ).fetchone()

    if game is None:
        connection.close()
        return {"error": "Game not found"}, 404

    connection.execute("""
        UPDATE games
        SET title = ?,
            genre = ?,
            platform = ?,
            release_year = ?,
            developer = ?
        WHERE id = ?
    """, (
        data["title"],
        data["genre"],
        data["platform"],
        data["release_year"],
        data["developer"],
        game_id
    ))

    connection.commit()

    updated_game = connection.execute(
        "SELECT * FROM games WHERE id = ?",
        (game_id,)
    ).fetchone()

    connection.close()

    return dict(updated_game), 200


@app.route("/games/<int:game_id>", methods=["DELETE"])
def delete_game(game_id):
    connection = get_db_connection()

    game = connection.execute(
        "SELECT * FROM games WHERE id = ?",
        (game_id,)
    ).fetchone()

    if game is None:
        connection.close()
        return {"error": "Game not found"}, 404

    connection.execute(
        "DELETE FROM games WHERE id = ?",
        (game_id,)
    )

    connection.commit()
    connection.close()

    return {"message": "Game deleted successfully"}, 200


if __name__ == "__main__":
    create_database()
    app.run(debug=True)