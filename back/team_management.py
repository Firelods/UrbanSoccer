from flask import jsonify, request

from app import app
from sqllite import db, Team, User


@app.route('/team', methods=['POST'])
def create_team():
    data = request.get_json()

    # Validation for the incoming data
    if 'name' not in data:
        return jsonify({'message': 'Team name is required.'}), 400

    new_team = Team(name=data['name'])
    db.session.add(new_team)
    db.session.commit()

    return jsonify({'message': 'Team created successfully.', 'team_id': new_team.id}), 201

@app.route('/team/player', methods=['POST'])
def add_player_to_team():
    data = request.get_json()

    # Validation for the incoming data
    team = Team.query.get(data['team_id'])
    if not team:
        return jsonify({'message': 'Team not found.'}), 404

    user = User.query.get(data['player_id'])
    if not user:
        return jsonify({'message': 'User not found.'}), 404

    # Assuming a player can only be in one team for simplicity
    if user in team.players:
        return jsonify({'message': 'Player is already in this team.'}), 409

    team.players.append(user)
    db.session.commit()

    return jsonify({'message': 'Player added to team successfully.'}), 200


@app.route('/team/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'message': 'Team not found.'}), 404

    team_data = {
        'id': team.id,
        'name': team.name,
        'players': [{'id': player.id, 'name': player.name} for player in team.players]
    }

    return jsonify(team_data), 200

@app.route('/team/player/<int:player_id>', methods=['DELETE'])
def remove_player_from_team(player_id):
    data = request.get_json()

    team = Team.query.get(data['team_id'])
    player = User.query.get(player_id)

    if not team or not player:
        return jsonify({'message': 'Invalid team or player.'}), 404

    if player not in team.players:
        return jsonify({'message': 'Player not in specified team.'}), 404

    team.players.remove(player)
    db.session.commit()

    return jsonify({'message': 'Player removed from team successfully.'}), 200
