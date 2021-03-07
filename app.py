import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
load_dotenv(find_dotenv())
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})

current_users = []
updateScore=False

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    global updateScore
    updateScore=False
    global current_users
    current_users = []
    print('User connected!')
    all_people = models.Person.query.all() # DB STUFF
    leaderboard = {}
    users = [] # DB STUFF
    ranks = []
    for person in all_people: # DB STUFF
        users.append(person.username) # DB STUFF
        ranks.append(person.rank)
        leaderboard[person.username] = person.rank
    current_users = users
    #print("users: ", users) # DB STUFF
    #print("current_users: ", current_users)
    leaderboardlist = []
    leaderboard_sorted_keys = sorted(leaderboard, key=leaderboard.get, reverse=True)
    for l in leaderboard_sorted_keys:
        leaderboardlist.append([l,leaderboard[l]])
    #print('leaderlist: ', leaderboardlist)
    socketio.emit('start', {'users': users, 'ranks':ranks, 'leaderboard':leaderboardlist}) # DB STUFF
    
@socketio.on('display')
def on_display(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('display', data, broadcast=True, include_self=False)

#used to pass and store all new information; will replace this code with database functionalities
@socketio.on('login')
def on_login(data): # data is whatever arg you pass in your emit call on client
    global current_users
    #print(str(data))
    if data['user'] not in current_users:
        print("user not in db")
        new_user = models.Person(username=data['user'], rank=100)
        db.session.add(new_user)
        db.session.commit()
        current_users.append(data['user'])
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
    #print('users: ', users)
    #print('current_users: ', current_users)
    leaderboardlist = []
    leaderboard_sorted_keys = sorted(leaderboard, key=leaderboard.get, reverse=True)
    for l in leaderboard_sorted_keys:
        leaderboardlist.append([l,leaderboard[l]])
    #print('leaderlist: ', leaderboardlist)
    socketio.emit('login', {'users': users, 'user': data['user'], 'ranks':ranks, 'leaderboard':leaderboardlist}, broadcast=True, include_self=True)

#used to update player information and pass this to all other users
@socketio.on('update')
def update_players(data): # data is whatever arg you pass in your emit call on client
    print("dictionary: ", data)
    socketio.emit('update', data, broadcast=True, include_self=False)


#new code
@socketio.on('restart')
def reset_board(data): # data is whatever arg you pass in your emit call on client
    global updateScore
    updateScore=False
    socketio.emit('restart', data, broadcast=True, include_self=True)
    

@socketio.on('winner')
def update_score(data): # data is whatever arg you pass in your emit call on client
    global updateScore
    print("winner: ", updateScore)
    if not updateScore:
        updateScore=True
        winner = db.session.query(models.Person).filter_by(username=data['winner'])
        for w in winner:
            w.rank +=1
            db.session.commit()
        all_people = models.Person.query.all()
        leaderboard = {}
        for person in all_people:
            leaderboard[person.username] = person.rank
        leaderboardlist = []
        leaderboard_sorted_keys = sorted(leaderboard, key=leaderboard.get, reverse=True)
        for l in leaderboard_sorted_keys:
            leaderboardlist.append([l,leaderboard[l]])
        print('leaderlist: ', leaderboardlist)
        
        socketio.emit('winner', {'leaderboard':leaderboardlist}, broadcast=True, include_self=True)

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )