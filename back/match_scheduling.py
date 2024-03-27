from datetime import datetime
import pytz
from flask import request, jsonify, Blueprint

from sqllite import Match, db, TeamPlayers, User

match_bp = Blueprint('matches', __name__, url_prefix='/')


@match_bp.route('/matches', methods=['POST'])
def schedule_match():
    data = request.get_json()

    # Validate incoming data
    if not all(key in data for key in ['date', 'opponent']):
        return jsonify({'message': 'Missing data for scheduling match.'}), 400

    # get date in the format YYYY-MM-DD HH:MM
    date = data['date']
    if len(date) != 16 or date[4] != '-' or date[7] != '-' or date[10] != ' ' or date[13] != ':':
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD HH:MM.'}), 400
    # the date received is in France timezone, we need to convert it to UTC
    # Convertir la date en format datetime avec le fuseau horaire de France
    paris_tz = pytz.timezone('Europe/Paris')
    naive_date = datetime.strptime(date, '%Y-%m-%d %H:%M')
    local_date = paris_tz.localize(naive_date)

    # Convertir en UTC
    utc_date = local_date.astimezone(pytz.utc)

    new_match = Match(date=utc_date, opponent=data['opponent'])

    db.session.add(new_match)
    db.session.commit()

    return jsonify({'message': 'Match scheduled successfully.', 'match': {
        'id': new_match.id,
        'date': new_match.date,
        'opponent': new_match.opponent,
        'team_id': new_match.team_id
    }}), 201


@match_bp.route('/matches', methods=['GET'])
def get_matches():
    matches = Match.query.all()
    matches_data = [{
        'id': match.id,
        'date': match.date,
        'opponent': match.opponent,
        'team_id': match.team_id
    } for match in matches]

    return jsonify(matches_data), 200

# endpoint unique match
@match_bp.route('/matches/<int:match_id>', methods=['GET'])
def get_match(match_id):
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'message': 'Match not found.'}), 404

    return jsonify({
        'id': match.id,
        'date': match.date,
        'opponent': match.opponent,
        'team_id': match.team_id
    }), 200

#endpoint to modify a match
@match_bp.route('/matches/<int:match_id>', methods=['PUT'])
def modify_match(match_id):
    data = request.get_json()
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'message': 'Match not found.'}), 404
    if 'date' in data:
        date = data['date']
        if len(date) != 16 or date[4] != '-' or date[7] != '-' or date[10] != ' ' or date[13] != ':':
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD HH:MM.'}), 400
        date = datetime.strptime(date, '%Y-%m-%d %H:%M')
        match.date = date
    if 'opponent' in data:
        match.opponent = data['opponent']
    db.session.commit()

    return jsonify({'message': 'Match modified successfully.', 'match': {
        'id': match.id,
        'date': match.date,
        'opponent': match.opponent,
        'team_id': match.team_id
    }}), 200


#endpoint to see all players and their count of matches

@match_bp.route('/players/matches', methods=['GET'])
def get_players_matches():
    matches = Match.query.all()
    players_matches = []
    for match in matches:
        team_players = TeamPlayers.query.filter_by(team_id=match.team_id).all()
        for team_player in team_players:
            player = User.query.get(team_player.player_id)
            player_info = next((item for item in players_matches if item["name"] == player.name), None)
            if player_info:
                player_info['matches_count'] += 1
            else:
                players_matches.append({'name': player.name, 'matches_count': 1})

    return jsonify(players_matches), 200

# endpoint to update player in a match like  this.http.put(`${environment.apiUrl}/matches/${idMatch}/player/`,{id, last_id})
@match_bp.route('/matches/<int:match_id>/player', methods=['PUT'])
def update_player_in_match(match_id):
    data = request.get_json()
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'message': 'Match not found.'}), 404
    if not all(key in data for key in ['id', 'last_id']):
        return jsonify({'message': 'Missing data for updating player in match.'}), 400
    team_player = TeamPlayers.query.filter_by(player_id=data['last_id'], team_id=match.team_id).first()
    if not team_player:
        return jsonify({'message': 'Player not found in the team.'}), 404
    team_player.player_id = data['id']
    db.session.commit()
    return jsonify({'message': 'Player updated successfully.'}), 200