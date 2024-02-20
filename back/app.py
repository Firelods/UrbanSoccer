from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from absence_management import absence_bp
from auth import auth_bp
from match_scheduling import match_bp
from sqllite import db, User
from team_management import team_bp


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urban-soccer1.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a real secret key

    app.register_blueprint(auth_bp)
    app.register_blueprint(match_bp)
    app.register_blueprint(absence_bp)
    app.register_blueprint(team_bp)

    db.init_app(app)
    JWTManager(app)
    with app.app_context():
        db.create_all()

        # users_data = [
        #     {"name": "Alice", "email": "alice@example.com", "password": generate_password_hash("test"),
        #      "role": "Gardien"},
        #     {"name": "Bob", "email": "bob@example.com", "password": generate_password_hash("test"),
        #      "role": "Attaquant"},
        #     {"name": "Charlie", "email": "charlie@example.com", "password": generate_password_hash("test"),
        #      "role": "Attaquant"},
        #     {"name": "Diana", "email": "diana@example.com", "password": generate_password_hash("test"),
        #      "role": "Attaquant"},
        #     {"name": "Evan", "email": "evan@example.com", "password": generate_password_hash("test"),
        #      "role": "Attaquant"},
        #     {"name": "Fiona", "email": "fiona@example.com", "password": generate_password_hash("test"),
        #      "role": "Attaquant"},
        #     {"name": "George", "email": "george@example.com", "password": generate_password_hash("test"),
        #      "role": "Défenseur"},
        #     {"name": "Hannah", "email": "hannah@example.com", "password": generate_password_hash("test"),
        #      "role": "Défenseur"},
        #     {"name": "Ian", "email": "ian@example.com", "password": generate_password_hash("test"),
        #      "role": "Défenseur"},
        #     {"name": "Julia", "email": "julia@example.com", "password": generate_password_hash("test"),
        #      "role": "Défenseur"},
        #     {"name": "Kevin", "email": "kevin@example.com", "password": generate_password_hash("test"),
        #      "role": "Défenseur"},
        #     {"name": "Liam", "email": "liam@example.com", "password": generate_password_hash("test"),
        #      "role": "Défenseur"},
        #     {"name": "Mia", "email": "mia@example.com", "password": generate_password_hash("test"),
        #      "role": "Défenseur"},
        #     {"name": "Noah", "email": "noah@example.com", "password": generate_password_hash("test"),
        #      "role": "Attaquant"},
        #     {"name": "Olivia", "email": "olivia@example.com", "password": generate_password_hash("test"),
        #      "role": "Attaquant"}
        # ]
        #
        # # Insert sample users into the database
        # for user_info in users_data:
        #     user = User(name=user_info["name"], email=user_info["email"], role=user_info["role"],password=user_info["password"])
        #     db.session.add(user)
        #
        # db.session.commit()
    return app


app = create_app()
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
