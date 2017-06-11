"""Web app for lily's checkers."""

from bottle import default_app, route, request
from checkers_ai.tree_search import find_move
from checkers_ai.checkers_email import send_email
from checkers_ai.checkers_email import read_email_from_gmail
from checkers_ai.checkers_email import translate_board_string
from checkers_ai.checkers_email import read_game_list
from checkers_ai.checkers_email import find_game_list
from checkers_ai.checkers_email import read_game_number
from checkers_ai.checkers_email import match_subject_to_number

# Checkers
# A simplistic checkers AI by Lyman Hurd.  Expects a 32 character string.  This
# endpoint means it is black's move.
# Changed by Glenn Hurd to use one method depending on a 34 character string.
# First character determines whose move it currently is, black uses True and
# red uses False.
@route('/checkers')
def computer_move():
    player = request.query.player
    board = request.query.board
    difficulty = request.query.difficulty

    if (player == "b"):
        #board = board[2:]
        """Return move for checkers."""
        return "r:" + find_move(board, True, difficulty)
    else:
        #board = board[2:]
        """Return move for checkers."""
        return "b:" + find_move(board, False, difficulty)

# Send email
# Sends an email through subject line to pbmserv@gamerz.net
@route('/send_email')
def send_checkers_email():
    board_number = request.query.board_number
    user = request.query.user or 'gqhprogram'
    password = request.query.password or 'checkers'
    move = request.query.move

    subject = 'move ' + board_number + ' ' + user + ' ' + password + ' ' + move
    #subject = 'checkers'
    """Send email based on subject line (user, pwd, recipient, subject, body)"""
    return send_email('gqhprograms@gmail.com', 'checkers', 'pbmserv@gamerz.net', subject, "")
    #return template('{board} {user} {password} {move}', board=board, user=user, password=password, move=move)

# Read email
# Reads an email based on subject line
@route('/read_email/<subject>')
def read_checkers_email(subject):
    split_subject = subject.split('_')
    subject = ' '.join(split_subject)
    """Read email matching subject line exactly (user, pwd, subject_string)
    then translate it into a 32 char string"""
    return translate_board_string(read_email_from_gmail('gqhprograms@gmail.com', 'checkers', subject))

# Read email about list of games in progress
# Reads an email sent from pbmserv@gamerz.net about a list of games currently in progress
@route('/read_list/<game_user>')
def read_list(game_user):
    return read_game_list('gqhprograms@gmail.com', 'checkers', game_user)

# Returns numbers of games in progress involving user name
@route('/find_games/<game_user>')
def find_games(game_user):
    #game_string = ' '.join(find_game_list('gqhprograms@gmail.com', 'checkers', game_user))
    game_list = find_game_list('gqhprograms@gmail.com', 'checkers', game_user)
    return game_list

@route('/read_numbers/<game_user>')
def read_numbers(game_user):
    game_numbers = read_game_number('gqhprograms@gmail.com', 'checkers', game_user)
    return game_numbers

@route('/match_subject/<game_number>')
def match_subject(game_number):
    return match_subject_to_number('gqhprograms@gmail.com', 'checkers', game_number)

application = default_app()
