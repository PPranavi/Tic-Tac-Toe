def add_players (username, players):
    if username not in players:
        players.append(username)
    return players