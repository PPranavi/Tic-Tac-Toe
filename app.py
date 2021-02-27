import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

current_users = []
status = {"Player X": '', "Player O":'', "Spectators":[]}

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

@socketio.on('display')
def on_display(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('display', data, broadcast=True, include_self=False)
    
@socketio.on('login')
def on_login(data): # data is whatever arg you pass in your emit call on client
    global current_users
    current_users.append(data['user'])
    if len(current_users)==1:
        status["Player X"]=data['user']
    elif len(current_users)==2:
        status["Player O"]=data['user']
    else:
        status["Spectators"].append(data['user'])
    
    print(status)
    socketio.emit('login', data, broadcast=True, include_self=False)

@socketio.on('update')
def update_players(data): # data is whatever arg you pass in your emit call on client
    print(data)
    socketio.emit('update', data, broadcast=True, include_self=False)

#new code
'''@socketio.on('restart')
def reset_board(data): # data is whatever arg you pass in your emit call on client
    socketio.emit('restart', data, broadcast=True, include_self=True)'''

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
