import random
from collections import Counter

from flask import jsonify, request, Blueprint
from sqlalchemy import func

from sqllite import db, Team, User, Match, Absence, TeamPlayers

team_bp = Blueprint('team', __name__, url_prefix='/')


@team_bp.route('/team', methods=['POST'])
def create_team():
    data = request.get_json()

    # Validation for the incoming data
    if 'name' not in data:
        return jsonify({'message': 'Team name is required.'}), 400

    new_team = Team(name=data['name'])
    db.session.add(new_team)
    db.session.commit()

    return jsonify({'message': 'Team created successfully.', 'team_id': new_team.id}), 201


# make an endpoint to create a random team of 5 players from the available players on a given match
@team_bp.route('/team/random', methods=['POST'])
def create_random_team():
    data = request.get_json()

    if 'match_id' not in data:
        return jsonify({'message': 'Match ID is required.'}), 400

    match = Match.query.get(data['match_id'])
    if not match:
        return jsonify({'message': 'Match not found.'}), 404

    # Count how many times each player has played in every team
    player_play_count = Counter()
    player_team_counts = db.session.query(
        TeamPlayers.player_id,
        func.count(TeamPlayers.team_id).label('times_played')
    ).group_by(TeamPlayers.player_id).all()

    # Fill the player_play_count Counter with the query results
    player_play_count = Counter({player_id: times_played for player_id, times_played in player_team_counts})
    # Filter players based on absences
    match_date = match.date.date()
    #print all absences
    absences = Absence.query.filter_by(date_of_absence=match_date).all()
    absent_players = [absence.player_id for absence in absences]

    # Prioritize players based on their play count
    players = User.query.all()
    random.shuffle(players)

    present_players = sorted(
        [player for player in players if player.id not in absent_players],
        key=lambda player: player_play_count[player.id]
    )
    # shuffle present player
    if len(present_players) < 5:
        return jsonify({'message': 'Not enough players available for a team.'}), 400

    # Team creation logic (similar to before, but consider play count)
    new_team = Team(name=f'Team {match.id}')
    roles_needed = {'Gardien': 1, 'Défenseur': 2, 'Attaquant': 2}
    for role, count_needed in roles_needed.items():
        role_players = [player for player in present_players if player.role == role]
        for player in role_players[:count_needed]:
            new_team.players.append(player)
            if role == 'Gardien':
                break  # Ensure only one gardien is added

    # add a random player not in the team to be a substitute
    substitute = [player for player in present_players if player not in new_team.players]
    random.shuffle(substitute)
    if substitute:
        new_team.players.append(substitute[0])
    # Verify team completeness
    if len(new_team.players) < 6:
        return jsonify({'message': 'Not enough players available for a team.'}), 400

    # Commit the new team and update the match
    db.session.add(new_team)
    db.session.commit()

    match.team_id = new_team.id
    db.session.add(match)
    db.session.commit()

    return jsonify({'message': 'Team created successfully.', 'team': {
        'id': new_team.id,
        'name': new_team.name,
        'players': [{'id': player.id, 'name': player.name, 'role': player.role} for player in new_team.players]
    }}), 201


@team_bp.route('/team/player', methods=['POST'])
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


@team_bp.route('/team/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'message': 'Team not found.'}), 404

    team_data = {
        'id': team.id,
        'name': team.name,
        'players': [{'id': player.id, 'name': player.name, 'role': player.role} for player in team.players]
    }

    return jsonify(team_data), 200


@team_bp.route('/team/player/<int:player_id>', methods=['DELETE'])
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
