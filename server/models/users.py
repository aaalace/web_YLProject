from app import db

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    profile_name = db.Column(db.String, unique=True)
    profile_password = db.Column(db.String)
    email = db.Column(db.String)
    birth_date = db.Column(db.String)
    person_name = db.Column(db.String)
    person_surname = db.Column(db.String)
    