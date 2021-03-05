from app import db

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    rank = db.Column(db.Integer)

    def __repr__(self):
        return '<Person %r>' % self.username