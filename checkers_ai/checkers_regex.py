import logging
import re

def filter_board(inputString):
    regex = re.compile(r'(\|.{3}\|.{3}\|.{3}\|.{3}\|.{3}\|.{3}\|.{3}\|.{3}\|)')
    searchResult = regex.findall(inputString)
    return searchResult

def filter_checkers(inputString):
    regex = re.compile(r':C:|:::|\*C\*|:K:|\*K\*')
    search_result = regex.findall(inputString)
    return search_result

def regex_game_list(inputString, game_user):
    search_string = '.*{}.*'.format(game_user)
    search_result = re.findall(search_string, inputString)
    return search_result

def regex_game_number(inputString, game_user):
    search_result = re.findall(r'^\s*(\d+).+\b{}\b'.format(game_user), inputString, re.M)
    return search_result

def regex_show_match(subject, game_number):
    search_result = re.match(r'Checkers Board {}.*'.format(game_number), subject)
    if search_result:
        return search_result.group(0)
    else:
        return None

def find_current_color(email):
    search_result = re.search(r'It is (\w*)\'s turn.*', email)
    if search_result:
        search_result2 = re.search(r'(Black|White) \({}\)'.format(search_result.group(1)), email)
        search_result3 = search_result2.group(1)
    else:
        search_result3 = 'Black'
    return search_result3

def find_current_player(email):
    search_result = re.search(r'(\w*)\'s turn.*', email)
    return search_result.group(1)

def regex_current_number(inputString, game_user):
    search_result = re.findall(r'\s*(\d+\s*\d+.*{}.*)'.format(game_user), inputString, re.M)
    return search_result

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)