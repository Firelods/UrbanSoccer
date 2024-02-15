from flask import request, jsonify

from app import app
from sqllite import User, Match, PlayerAvailability, db


@app.route('/availability', methods=['POST'])
def update_availability():
    data = request.get_json()

    # Validate incoming data
    required_fields = ['player_id', 'match_id', 'availability_status']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required data.'}), 400

    # Verify if the player and match exist, and if the status is valid
    player = User.query.get(data['player_id'])
    match = Match.query.get(data['match_id'])
    if not player or not match:
        return jsonify({'message': 'Invalid player or match ID.'}), 404

    availability = PlayerAvailability.query.filter_by(player_id=player.id, match_id=match.id).first()
    if availability:
        availability.availability_status = data['availability_status']
    else:
        new_availability = PlayerAvailability(player_id=player.id, match_id=match.id,
                                              availability_status=data['availability_status'])
        db.session.add(new_availability)

    db.session.commit()

    return jsonify({'message': 'Availability updated successfully.'}), 200


@app.route('/availability/<int:match_id>', methods=['GET'])
def get_availability(match_id):
    availabilities = PlayerAvailability.query.filter_by(match_id=match_id).all()
    availability_data = [{
        'player_id': availability.player_id,
        'match_id': availability.match_id,
        'availability_status': availability.availability_status
    } for availability in availabilities]

    return jsonify(availability_data), 200
