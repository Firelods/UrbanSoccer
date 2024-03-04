from datetime import datetime

from flask import request, jsonify, Blueprint

from auth import token_required
from sqllite import User, Absence, db, Match

absence_bp = Blueprint('absence', __name__, url_prefix='/')


@absence_bp.route('/absences', methods=['POST'])
def record_absence():
    data = request.get_json()
    email = token_required()
    # Validate the incoming data
    if 'date' not in data:
        return jsonify({'message': 'Missing  date_of_absence.'}), 400

    player = User.query.filter_by(email=email).first()
    if not player:
        return jsonify({'message': 'Player not found.'}), 404
        # get date in the format YYYY-MM-DD
    date = data['date']
    if len(date) != 10 or date[4] != '-' or date[7] != '-':
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400
    # make date in python datetime format
    date = datetime.strptime(date, '%Y-%m-%d')
    new_absence = Absence(player_id=player.id, date_of_absence=date, reason=data.get('reason'))
    db.session.add(new_absence)
    db.session.commit()

    return jsonify({'message': 'Absence recorded successfully.'}), 201


@absence_bp.route('/absences/<int:absence_id>', methods=['DELETE'])
def delete_absence(absence_id):
    absence = Absence.query.get(absence_id)
    if not absence:
        return jsonify({'message': 'Absence not found.'}), 404

    db.session.delete(absence)
    db.session.commit()

    return jsonify({'message': 'Absence deleted successfully.'}), 200


@absence_bp.route('/absences', methods=['GET'])
def get_absences():
    try:
        email = token_required()
    except:
        return jsonify({'message': 'Token invalide'}), 401
    all = request.args.get('all')
    if not all:
        # search the player by its email
        player = User.query.filter_by(email=email).first()
        if not player:
            return jsonify({'message': 'Player not found.'}), 404
        absences = Absence.query.filter_by(player_id=player.id).all()
    else:
        absences = Absence.query.all()

    absences_data = [{
        'id': absence.id,
        'player_id': absence.player_id,
        'date_of_absence': absence.date_of_absence,
        'reason': absence.reason
    } for absence in absences]

    return jsonify(absences_data), 200


# make a endpoint to get all present players on a given match
@absence_bp.route('/absences/present', methods=['GET'])
def get_present_players():
    match_id = request.args.get('match_id')
    if not match_id:
        return jsonify({'message': 'Missing match_id.'}), 400
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'message': 'Match not found.'}), 404

    # present players are those who are not absent on the given match date
    # get all absences on the match date
    absences = Absence.query.filter_by(date_of_absence=match.date).all()
    absent_players = [absence.player_id for absence in absences]
    # get all players
    players = User.query.all()
    present_players = [{
        'id': player.id,
        'name': player.name,
        'email': player.email,
        'role': player.role
    } for player in players if player.id not in absent_players]

    return jsonify(present_players), 200


# make an endpoint to get all absent players on a given match
@absence_bp.route('/absences/absent', methods=['GET'])
def get_absent_players():
    match_id = request.args.get('match_id')
    if not match_id:
        return jsonify({'message': 'Missing match_id.'}), 400
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'message': 'Match not found.'}), 404
    match_date = match.date.date()
    # absent players are those who are absent on the given match date
    absences = Absence.query.filter_by(date_of_absence=match_date).all()
    absent_players = [{
        'id': absence.player_id,
        'name': User.query.get(absence.player_id).name,
        'email': User.query.get(absence.player_id).email,
        'role': User.query.get(absence.player_id).role
    } for absence in absences]

    return jsonify(absent_players), 200