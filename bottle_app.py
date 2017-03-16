"""Web app for lily's checkers."""

from bottle import default_app, route
from checkers_ai.tree_search import find_move

# Checkers
# A simplistic checkers AI by Lyman Hurd.  Expects a 32 character string.  This
# endpoint means it is black's move.
# Changed by Glenn Hurd to use one method depending on a 34 character string.
# First character determines whose move it currently is, black uses True and
# red uses False.
@route('/checkers/<move_string>')
def computer_move(move_string):
    if (move_string[0] == "b"):
        move_string = move_string[2:]
        """Return move for checkers."""
        return "r:" + find_move(move_string, True)
    else:
        move_string = move_string[2:]
        """Return move for checkers."""
        return "b:" + find_move(move_string, False)

# Checkers
# A simplistic checkers AI by Lyman Hurd.  Expects a 32 character string with
# the first character being the player whose move it is.  This
# endpoint means it is red's move.
@route('/checkers/red/<move_string>')
def red_computer_move(move_string):
    """Return move for checkers."""
    return find_move(move_string, False)


application = default_app()