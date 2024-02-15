from flask import request, jsonify

from app import app
from sqllite import User, Absence, db


@app.route('/absences', methods=['POST'])
def record_absence():
    data = request.get_json()

    # Validate the incoming data
    if 'player_id' not in data or 'date_of_absence' not in data:
        return jsonify({'message': 'Missing player_id or date_of_absence.'}), 400

    player = User.query.get(data['player_id'])
    if not player:
        return jsonify({'message': 'Player not found.'}), 404

    new_absence = Absence(player_id=player.id, date_of_absence=data['date_of_absence'], reason=data.get('reason'))
    db.session.add(new_absence)
    db.session.commit()

    return jsonify({'message': 'Absence recorded successfully.'}), 201

@app.route('/absences/<int:absence_id>', methods=['DELETE'])
def delete_absence(absence_id):
    absence = Absence.query.get(absence_id)
    if not absence:
        return jsonify({'message': 'Absence not found.'}), 404

    db.session.delete(absence)
    db.session.commit()

    return jsonify({'message': 'Absence deleted successfully.'}), 200

@app.route('/absences', methods=['GET'])
def get_absences():
    player_id = request.args.get('player_id')
    if player_id:
        absences = Absence.query.filter_by(player_id=player_id).all()
    else:
        absences = Absence.query.all()

    absences_data = [{
        'id': absence.id,
        'player_id': absence.player_id,
        'date_of_absence': absence.date_of_absence,
        'reason': absence.reason
    } for absence in absences]

    return jsonify(absences_data), 200
