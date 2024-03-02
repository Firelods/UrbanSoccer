from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    players = db.relationship('User', secondary='team_players', backref=db.backref('teams', lazy='dynamic'))


class TeamPlayers(db.Model):
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

class Absence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date_of_absence = db.Column(db.Date, nullable=False)
    reason = db.Column(db.String(250))


class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    opponent = db.Column(db.String(120), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    semaine = db.Column(db.String(120), nullable=True)


class PlayerAvailability(db.Model):
    player_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), primary_key=True)
    availability_status = db.Column(db.String(50), nullable=False)
