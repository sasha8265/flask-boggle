from boggle import Boggle
from flask import Flask, jsonify, request, render_template, session


app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"

boggle_game = Boggle()


@app.route('/')
def homepage():
    """Show the game board"""
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    num_plays = session.get("num_plays", 0)

    return render_template('index.html', board=board, highscore=highscore, num_plays=num_plays)

@app.route('/check-word')
def check_word():
    """Check if word is in the dictionary"""

    word = request.args['word']
    board = session['board']
    res = boggle_game.check_valid_word(board, word)

    return jsonify({"result":res})

@app.route('/game-over', methods=["POST"])
def end_game():
    """Recieve final score, update number of plays, update high score"""

    # gets the new player score from finished game post request
    score = request.json["score"]
    # checks if there is an existing highscore, and if not sets it to 0
    highscore = session.get("highscore",0)
    # checks if there is anexisting number of games played, and if not sets it to 0
    num_plays = session.get("num_plays", 0)
    # adds 1 to the number of games played in the session
    session["num_plays"] = num_plays + 1
    # finds the greater number between the current score and existing highscore
    session["highscore"] = max(score,highscore)

    # if current score is greater than highschoor, returns the new record
    return jsonify(new_record=score > highscore)

