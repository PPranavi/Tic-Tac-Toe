# pylint: disable=E1101,R0903,W0603,C0413,W1508
"""
main program to get the game running and keep consistency across boards
"""
import os
from flask import Flask, send_from_directory, json  #session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
load_dotenv(find_dotenv())
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
DB = SQLAlchemy(APP)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models

DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

CURRENT_USERS = []
IN_GAME = []
UPDATE_SCORE = False

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """
    build game
    """
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    """
    runs when any user first connects to the game
    """
    global UPDATE_SCORE
    UPDATE_SCORE = False
    global CURRENT_USERS
    CURRENT_USERS = []
    global IN_GAME
    IN_GAME = []
    print('User connected!')
    all_people = models.Person.query.all()  # DB STUFF
    leaderboard = {}
    users = []  # DB STUFF
    ranks = []
    for person in all_people:  # DB STUFF
        users.append(person.username)  # DB STUFF
        ranks.append(person.rank)
        leaderboard[person.username] = person.rank
    CURRENT_USERS = users
    #print("users: ", users) # DB STUFF
    #print("current_users: ", current_users)
    leaderboardlist = []
    leaderboard_sorted_keys = sorted(leaderboard,
                                     key=leaderboard.get,
                                     reverse=True)
    for lead in leaderboard_sorted_keys:
        leaderboardlist.append([lead, leaderboard[lead]])
    #print('leaderlist: ', leaderboardlist)
    SOCKETIO.emit('start', {
        'users': users,
        'ranks': ranks,
        'leaderboard': leaderboardlist
    })  # DB STUFF


@SOCKETIO.on('display')
def on_display(
        data):  # data is whatever arg you pass in your emit call on client
    """
    runs when board has to displayed across all users' screens
    """
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('display', data, broadcast=True, include_self=False)


#used to pass and store all new information; will replace this code with database functionalities
@SOCKETIO.on('login')
def on_login(
        data):  # data is whatever arg you pass in your emit call on client
    """
    runs when a user logins into the game
    """
    global CURRENT_USERS
    global IN_GAME
    if data['user'] not in IN_GAME:
        IN_GAME.append(data['user'])
    #print(str(data))
    if data['user'] not in CURRENT_USERS:
        print("user not in db")
        new_user = models.Person(username=data['user'], rank=100)
        DB.session.add(new_user)
        DB.session.commit()
        CURRENT_USERS.append(data['user'])
    else:
        print("user already in db")
    all_people = models.Person.query.all()
    users = []
    ranks = []
    leaderboard = {}
    for person in all_people:
        users.append(person.username)
        ranks.append(person.rank)
        leaderboard[person.username] = person.rank
    leaderboardlist = []
    leaderboard_sorted_keys = sorted(leaderboard,
                                     key=leaderboard.get,
                                     reverse=True)
    for lead in leaderboard_sorted_keys:
        leaderboardlist.append([lead, leaderboard[lead]])
    SOCKETIO.emit('login', {
        'users': users,
        'user': IN_GAME,
        'ranks': ranks,
        'leaderboard': leaderboardlist
    },
                  broadcast=True,
                  include_self=True)


#used to update player information and pass this to all other users
@SOCKETIO.on('update')
def update_players(
        data):  # data is whatever arg you pass in your emit call on client
    """
    runs when there is a new player in the game
    """
    print("dictionary: ", data)
    SOCKETIO.emit('update', data, broadcast=True, include_self=False)


#new code
@SOCKETIO.on('restart')
def reset_board(
        data):  # data is whatever arg you pass in your emit call on client
    """
    runs when the players want to reset the board
    """
    global UPDATE_SCORE
    UPDATE_SCORE = False
    SOCKETIO.emit('restart', data, broadcast=True, include_self=True)


@SOCKETIO.on('winner')
def update_score(
        data):  # data is whatever arg you pass in your emit call on client
    """
    runs when there is a winner
    """
    global UPDATE_SCORE
    print("winner: ", UPDATE_SCORE)
    if not UPDATE_SCORE:
        UPDATE_SCORE = True
        winner = DB.session.query(
            models.Person).filter_by(username=data['winner'])
        for win in winner:
            win.rank += 1
            DB.session.commit()
        loser = DB.session.query(
            models.Person).filter_by(username=data['loser'])
        for los in loser:
            los.rank -= 1
            DB.session.commit()
        all_people = models.Person.query.all()
        leaderboard = {}
        for person in all_people:
            leaderboard[person.username] = person.rank
        leaderboardlist = []
        leaderboard_sorted_keys = sorted(leaderboard,
                                         key=leaderboard.get,
                                         reverse=True)
        for lead in leaderboard_sorted_keys:
            leaderboardlist.append([lead, leaderboard[lead]])
        print('leaderlist: ', leaderboardlist)

        SOCKETIO.emit('winner', {'leaderboard': leaderboardlist},
                      broadcast=True,
                      include_self=True)


# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
