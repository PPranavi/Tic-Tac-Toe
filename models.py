# pylint: disable=E1101,R0903
"""
database schema
"""
from app import DB

class Person(DB.Model):
    """
    database shcema
    """
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    rank = DB.Column(DB.Integer)

    def __repr__(self):
        return '<Person %r>' % self.username
