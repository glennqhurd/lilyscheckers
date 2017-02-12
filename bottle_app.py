"""Web app for lily's checkers."""

from bottle import default_app, route
from checkers_ai.tree_search import find_move

# Checkers
# A simplistic checkers AI by Lyman Hurd.  Expects a 32 character string.  This
# endpoint means it is black's move.
@route('/checkers/black/<move_string>')
def black_computer_move(move_string):
    """Return move for checkers."""
    return find_move(move_string, True)

# Checkers
# A simplistic checkers AI by Lyman Hurd.  Expects a 32 character string with
# the first character being the player whose move it is.  This
# endpoint means it is red's move.
@route('/checkers/red/<move_string>')
def red_computer_move(move_string):
    """Return move for checkers."""
    return find_move(move_string, False)


application = default_app()