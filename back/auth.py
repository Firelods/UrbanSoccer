from flask import request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

from app import app
from sqllite import User, db


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate the incoming data for required fields and email format

    # Check if the user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists.'}), 409

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(email=data['email'], name=data['name'], password=hashed_password, role=data['role'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.'}), 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=data['email'])
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401
