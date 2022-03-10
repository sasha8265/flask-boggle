from boggle import Boggle
from flask import Flask, jsonify, request, render_template, session
from flask_debugtoolbar import DebugToolbarExtension


app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/')
def homepage():
    """Show the game board"""
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('index.html', board=board)

@app.route('/check-word')
def check_word():
    """Check if word is in the dictionary"""

    word = request.args['word']
    board = session['board']
    res = boggle_game.check_valid_word(board, word)

    print(res)

    return jsonify({"result":res})