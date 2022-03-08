from http import server
from flask import request
import json
from app import db
import datetime

from models.posts import Posts
from models.media import Media

from posts.utils.get_mid_color import middle_color

def create_post():
    if request.method == 'POST':
        try:
            data = json.loads(request.data)

            user_id = data['userId']
            post_type = data['type']
            content = data['body']
        except Exception:
            return 'не верный формат данных'

        try:
            media = Media(
                type=post_type,
                user_id=user_id,
                media_body=content
            )
            db.session.add(media)
            db.session.commit()
        except Exception:
            return 'ошибка базы'

        try:
            media_id = Media.query.filter_by(user_id=user_id).all()[-1].id
        except Exception:
            return 'ошибка запроса'

        try:
            dt = datetime.datetime.now()

            mid_col = ''
            if post_type == 3:
                mid_col = middle_color(content)

            post = Posts(
                type=post_type,
                user_id=user_id,
                media_id=media_id,
                likes_count=0,
                post_time=dt,
                middle_color=';'.join(mid_col)
            )
            db.session.add(post)
            db.session.commit()
        except Exception as e:
            return 'server error'
        return 'correct'
