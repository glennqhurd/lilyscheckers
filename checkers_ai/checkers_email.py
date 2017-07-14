# Import smtplib for the actual sending function
import smtplib

# Import the email modules we'll need
#from email.mime.text import MIMEText

import checkers_regex
import email
import imaplib
import logging
import time

def send_email(user, pwd, recipient, subject, body):

    gmail_user = user
    gmail_pwd = pwd
    FROM = user
    TO = recipient if type(recipient) is list else [recipient]
    SUBJECT = subject
    TEXT = body

    # Prepare actual message
    message = """From: %s\nTo: %s\nSubject: %s\n\n%s
    """ % (FROM, ", ".join(TO), SUBJECT, TEXT)
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login(gmail_user, gmail_pwd)
        server.sendmail(FROM, TO, message)
        server.close()
        return 'successfully sent the mail'
    except:
        return "failed to send mail"

def read_email_from_gmail(user, pwd, subject_string):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(user, pwd)
        mail.select('inbox')

        subject_string = '(SUBJECT "{}")'.format(subject_string)
        type, data = mail.search(None, subject_string, '(FROM "pbmserv@gamerz.net")')
        mail_ids = data[0]

        #id_list = mail_ids.split()
        #first_email_id = int(id_list[0])
        #latest_email_id = int(id_list[-1])

        type, data = mail.fetch(mail_ids, '(RFC822)' )

        for response_part in data:
            if isinstance(response_part, tuple):
                msg = email.message_from_string(response_part[1])
                if msg.is_multipart():
                    for payload in msg.get_payload():
                        # if payload.is_multipart(): ...
                        return checkers_regex.filter_board(payload.get_payload())
                else:
                    return checkers_regex.filter_board(msg.get_payload())

    except Exception, e:
        print str(e)

def translate_board_string(email_list, current_color):
    if email_list is None:
        return None
    board_string = ""
    if current_color == 'White':
        board_string += 'r:'
    else:
        board_string += 'b:'
    for email_string in email_list:
        checker_list = checkers_regex.filter_checkers(email_string)
        for checker in checker_list:
            if checker == ':C:':
                board_string += 'r'
            elif checker == '*C*':
                board_string += 'b'
            elif checker == ':K:':
                board_string += 'R'
            elif checker == '*K*':
                board_string += 'B'
            else:
                board_string += '-'
    return board_string

def read_game_list(email_user, pwd, game_user):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(email_user, pwd)
        mail.select('inbox')

        subject_string = '(SUBJECT "{}")'.format('List of Checkers games')
        type, data = mail.search(None, subject_string, '(FROM "pbmserv@gamerz.net")')
        mail_ids = data[0]

        id_list = mail_ids.split()
        #first_email_id = int(id_list[0])
        latest_email_id = int(id_list[-1])

        type, data = mail.fetch(latest_email_id, '(RFC822)' )

        for response_part in data:
            logging.info('Entering for statement')
            if isinstance(response_part, tuple):
                logging.info('Entering if statement')
                msg = email.message_from_string(response_part[1])
                if msg.is_multipart():
                    for payload in msg.get_payload():
                        # if payload.is_multipart(): ...
                        logging.info('Entering payload for statement')
                        logging.info(checkers_regex.regex_game_list(payload.get_payload(), game_user))
                        if len(checkers_regex.regex_game_list(payload.get_payload(), game_user)) != 0:
                            return checkers_regex.regex_game_list(payload.get_payload(), game_user)
                else:
                    logging.info('Entering else statement')
                    logging.info(checkers_regex.regex_game_list(msg.get_payload(), game_user))
                    return checkers_regex.regex_game_list(msg.get_payload(), game_user)

    except Exception, e:
        print str(e)


def find_game_list(email_user, pwd, game_user):
    send_email(email_user, pwd, 'pbmserv@gamerz.net', 'list checkers', '')
    time.sleep(15)
    game_numbers = []
    email_list = read_game_list(email_user, pwd, game_user)
    for email_string in email_list:
        logging.info(checkers_regex.regex_game_number(email_string, game_user))
        if len(checkers_regex.regex_game_number(email_string, game_user)) > 0:
            game_numbers.append(checkers_regex.regex_game_number(email_string, game_user)[0])
    game_dict = {}
    for i in xrange(len(game_numbers)):
        game_dict[i] = game_numbers[i]
    if game_dict:
        return game_dict
    else:
        return 0

def read_game_number(email_user, pwd, game_user):
    try:
        send_email(email_user, pwd, 'pbmserv@gamerz.net', 'list checkers', '')
        time.sleep(10)
        logging.info(game_user)
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(email_user, pwd)
        mail.select('inbox')

        subject_string = '(SUBJECT "{}")'.format('List of Checkers games')
        type, data = mail.search(None, subject_string, '(FROM "pbmserv@gamerz.net")')
        mail_ids = data[0]

        id_list = mail_ids.split()
        #first_email_id = int(id_list[0])
        latest_email_id = int(id_list[-1])

        type, data = mail.fetch(latest_email_id, '(RFC822)' )

        for response_part in data:
            logging.info('Entering for statement')
            if isinstance(response_part, tuple):
                logging.info('Entering if statement')
                msg = email.message_from_string(response_part[1])
                if msg.is_multipart():
                    for payload in msg.get_payload():
                        # if payload.is_multipart(): ...
                        logging.info('Entering payload for statement')
                        logging.info(checkers_regex.regex_game_number(payload.get_payload(), game_user))
                        if len(checkers_regex.regex_game_number(payload.get_payload(), game_user)) != 0:
                            int_list = convert_list_to_int(checkers_regex.regex_game_number(payload.get_payload(), game_user))
                            return convert_list_to_dict(int_list)
                else:
                    logging.info('Entering else statement')
                    logging.info(checkers_regex.regex_game_number(msg.get_payload(), game_user))
                    int_list = convert_list_to_int(checkers_regex.regex_game_number(msg.get_payload(), game_user))
                    return convert_list_to_dict(int_list)

    except Exception, e:
        print str(e)

def convert_list_to_dict(input_list):
    game_dict = {}
    for i in xrange(len(input_list)):
        game_dict[i] = input_list[i]
    if game_dict:
        return game_dict
    else:
        return 0

def convert_list_to_int(input_list):
    [int(x) for x in input_list]
    return input_list

def match_subject_to_number(user, pwd, game_number):
    try:
        send_email(user, pwd, 'pbmserv@gamerz.net', 'checkers show {}'.format(game_number), '')
        time.sleep(5)
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(user, pwd)
        mail.select('inbox')
        typ, data = mail.search(None, 'ALL')

        #data = mail.fetch(1, '(BODY[HEADER])')

        ids = data[0]
        id_list = ids.split()
        # get the most recent email id
        latest_email_id = int(id_list[-1])

        #header_data = data[1][0][1]

        message_found = False

        while not message_found:
            typ, fetch_data = mail.fetch(latest_email_id, '(RFC822)')

            for response_part in fetch_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_string(response_part[1])
                    varSubject = msg['subject']
                    if checkers_regex.regex_show_match(varSubject, game_number):
                        return varSubject
            latest_email_id = latest_email_id - 1
            if latest_email_id < 1:
                return "No matching subject"

        #parser = HeaderParser()
        #msg = parser.parsestr(header_data)

        #print msg['Subject']

    except Exception, e:
        print str(e)

def get_board_string(user, pwd, game_number):
    try:
        send_email(user, pwd, 'pbmserv@gamerz.net', 'checkers show {}'.format(game_number), '')
        time.sleep(10)
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(user, pwd)
        mail.select('inbox')
        typ, data = mail.search(None, 'ALL')

        ids = data[0]
        id_list = ids.split()
        # get the most recent email id
        latest_email_id = int(id_list[-1])

        message_found = False

        while not message_found:
            typ, fetch_data = mail.fetch(latest_email_id, '(RFC822)')

            for response_part in fetch_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_string(response_part[1])
                    varSubject = msg['subject']
                    logging.info("Inside if statement 1")
                    if checkers_regex.regex_show_match(varSubject, game_number):
                        logging.info("Inside if statement 2")
                        current_color = checkers_regex.find_current_color(msg.get_payload())
                        logging.info(translate_board_string(checkers_regex.filter_board(msg.get_payload()), current_color))
                        return translate_board_string(checkers_regex.filter_board(msg.get_payload()), current_color)
            latest_email_id = latest_email_id - 1
            if latest_email_id < 1:
                return "No matching subject"

    except Exception, e:
        print str(e)


def get_current_player(user, pwd, game_number):
    try:
        send_email(user, pwd, 'pbmserv@gamerz.net', 'checkers show {}'.format(game_number), '')
        time.sleep(10)
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(user, pwd)
        mail.select('inbox')
        typ, data = mail.search(None, 'ALL')

        ids = data[0]
        id_list = ids.split()
        # get the most recent email id
        latest_email_id = int(id_list[-1])

        message_found = False

        while not message_found:
            typ, fetch_data = mail.fetch(latest_email_id, '(RFC822)')

            for response_part in fetch_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_string(response_part[1])
                    varSubject = msg['subject']
                    if checkers_regex.regex_show_match(varSubject, game_number):
                        return checkers_regex.find_current_player(msg.payload())
            latest_email_id = latest_email_id - 1
            if latest_email_id < 1:
                return "No matching subject"

    except Exception, e:
        print str(e)


def get_player_tuple(email_user, pwd, game_user):
    try:
        send_email(email_user, pwd, 'pbmserv@gamerz.net', 'list checkers', '')
        time.sleep(10)
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(email_user, pwd)
        mail.select('inbox')

        subject_string = '(SUBJECT "{}")'.format('List of Checkers games')
        type, data = mail.search(None, subject_string, '(FROM "pbmserv@gamerz.net")')
        mail_ids = data[0]

        id_list = mail_ids.split()
        #first_email_id = int(id_list[0])
        latest_email_id = int(id_list[-1])

        type, data = mail.fetch(latest_email_id, '(RFC822)' )

        for response_part in data:
            if isinstance(response_part, tuple):
                msg = email.message_from_string(response_part[1])
                if msg.is_multipart():
                    for payload in msg.get_payload():
                        # if payload.is_multipart(): ...
                        email_list = checkers_regex.regex_current_number(payload.get_payload(), game_user)
                        return convert_current_player_to_dict(convert_elements_to_list(email_list))
                else:
                    logging.debug("Entered else in player_tuple")
                    email_list = checkers_regex.regex_current_number(msg.get_payload(), game_user)
                    return convert_current_player_to_dict(convert_elements_to_list(email_list))

    except Exception, e:
        logging.debug(str(e))


def convert_elements_to_list(email_list):
    tuple_list = []
    logging.info(email_list)
    for email in email_list:
        split_email = email.split(" ")
        logging.info("split_email: ")
        logging.info(split_email)
        refined_list = remove_all_spaces(split_email)
        tuple_list.append(refined_list)
    logging.info(tuple_list)
    return tuple_list


def remove_all_spaces(input_list):
    while (len(input_list) > 6):
        input_list.remove('')
    return input_list


def convert_current_player_to_dict(input_list):
    game_dict = {}
    for i in xrange(len(input_list)):
        logging.debug("input_list[i][0]: " + input_list[i][0])
        j = input_list[i][0]
        logging.debug("input_list[i][4]: " + input_list[i][4])
        input_string = input_list[i][4]
        game_dict[j] = input_string[:-2]
    if game_dict:
        return game_dict
    else:
        return 0


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
