from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from auth import auth_bp
from sqllite import db


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urban-soccer.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a real secret key

    app.register_blueprint(auth_bp)

    db.init_app(app)
    JWTManager(app)
    with app.app_context():
        db.create_all()
    return app

app = create_app()
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
