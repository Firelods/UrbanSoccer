from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, decode_token
from werkzeug.security import generate_password_hash, check_password_hash

from sqllite import User, db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate the incoming data for required fields and email format

    # Check if the user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists.'}), 409

    hashed_password = generate_password_hash(data['password'])

    new_user = User(email=data['email'], name=data['name'], password=hashed_password, role=data['role'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=data['email'])
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


def token_required():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
    except:
        raise Exception("Token manquant")
    if token is None:
        raise Exception("Token manquant")
    try:
        decoded_token = decode_token(token)
        return decoded_token["login_id"]
    except:
        raise Exception("Token invalide")