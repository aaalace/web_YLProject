from app import db


class Posts(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.Integer, nullable=False)
    media_id = db.Column(db.Integer, db.ForeignKey('media.id'), nullable=True)
    likes_count = db.Column(db.Integer)
    post_time = db.Column(db.DateTime)
    middle_color = db.Column(db.Text)
    height_width_proportion = db.Column(db.Float, nullable=True)
    tags = db.Column(db.Text, nullable=True)
    path_to_media = db.Column(db.Text, nullable=True)

