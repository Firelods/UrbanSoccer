from datetime import datetime

from flask import request, jsonify, Blueprint

from sqllite import Match, db

match_bp = Blueprint('matches', __name__, url_prefix='/')

@match_bp.route('/matches', methods=['POST'])
def schedule_match():
    data = request.get_json()

    # Validate incoming data
    if not all(key in data for key in ['date', 'opponent', 'location']):
        return jsonify({'message': 'Missing data for scheduling match.'}), 400

    # get date in the format YYYY-MM-DD
    date=data['date']
    if len(date) != 10 or date[4] != '-' or date[7] != '-':
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400
    #make date in python datetime format
    date = datetime.strptime(date, '%Y-%m-%d')

    new_match = Match(date=date, opponent=data['opponent'], location=data['location'])
    db.session.add(new_match)
    db.session.commit()

    return jsonify({'message': 'Match scheduled successfully.', 'match_id': new_match.id}), 201


@match_bp.route('/matches', methods=['GET'])
def get_matches():
    matches = Match.query.all()
    matches_data = [{
        'id': match.id,
        'date': match.date,
        'opponent': match.opponent,
        'location': match.location
    } for match in matches]

    return jsonify(matches_data), 200
