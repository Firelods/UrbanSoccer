from datetime import datetime

from flask import request, jsonify, Blueprint

from sqllite import Match, db

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
    # make date in python datetime format
    date = datetime.strptime(date, '%Y-%m-%d %H:%M')

    new_match = Match(date=date, opponent=data['opponent'])
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