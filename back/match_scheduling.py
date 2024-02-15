from flask import request, jsonify

from app import app
from sqllite import Match, db


@app.route('/matches', methods=['POST'])
def schedule_match():
    data = request.get_json()

    # Validate incoming data
    if not all(key in data for key in ['date', 'opponent', 'location']):
        return jsonify({'message': 'Missing data for scheduling match.'}), 400

    new_match = Match(date=data['date'], opponent=data['opponent'], location=data['location'])
    db.session.add(new_match)
    db.session.commit()

    return jsonify({'message': 'Match scheduled successfully.', 'match_id': new_match.id}), 201


@app.route('/matches', methods=['GET'])
def get_matches():
    matches = Match.query.all()
    matches_data = [{
        'id': match.id,
        'date': match.date,
        'opponent': match.opponent,
        'location': match.location
    } for match in matches]

    return jsonify(matches_data), 200
