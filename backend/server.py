from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from datetime import datetime
from passlib.hash import pbkdf2_sha256
from flask_jwt import JWT, jwt_required
from decouple import config

app = Flask(__name__)
app.config["DEBUG"] = True

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///todos.db"

db = SQLAlchemy(app)


def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and pbkdf2_sha256.verify(password, user.password):
        return user


def identity(payload):
    user_id = payload['identity']
    return User.query.get(user_id)


app.config['SECRET_KEY'] = config('JWT_SECRET_KEY')
jwt = JWT(app, authenticate, identity)


@dataclass
class User(db.Model):
    id: int
    name: str
    username: str
    date_created: str

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    username = db.Column(db.String(20))
    password = db.Column(db.String(256))
    date_created = db.Column(db.DateTime, default=datetime.now)


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    if not data or not 'name' in data or not 'username' in data or not 'password' in data:
        return bad_request()
    user = User.query.filter_by(username=data['username']).first()
    if (not user):
        user = User(
            name=data['name'],
            username=data['username'],
            password=pbkdf2_sha256.hash(data['password'])
        )
        db.session.add(user)
        db.session.commit()
        return "OK", 201


@dataclass
class Todo(db.Model):
    id: int
    text: str
    priority: int
    due_date: str

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500))
    due_date = db.Column(db.DateTime)
    priority = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=datetime.now)


@app.route('/todos', methods=['GET'])
@jwt_required()
def list_todo():
    return jsonify(Todo.query.all()), 200


@app.route('/todos/<id>', methods=['GET'])
@jwt_required()
def get_todo(id):
    return jsonify(Todo.query.get(id)), 200


@app.route('/todos', methods=['POST'])
@jwt_required()
def create_todo():
    if not request.json or not 'text' in request.json or not 'due_date' in request.json:
        return bad_request()
    todo = Todo(
        text=request.json['text'],
        due_date=datetime.strptime(
            request.json['due_date'], '%Y-%m-%dT%H:%M:%SZ'),
    )
    if (request.json.get('priority', None) is not None):
        todo.priority = int(request.json['priority'])
    db.session.add(todo)
    db.session.commit()
    return "OK", 201


@app.route('/todos/<id>', methods=['DELETE'])
@jwt_required()
def delete_todo(id):
    todo = Todo.query.get(id)
    if (todo is not None):
        db.session.delete(todo)
        db.session.commit()
        return "OK", 200
    else:
        return not_found()


@app.route('/todos/<id>', methods=['PUT'])
@jwt_required()
def update_todo(id):
    if not request.json:
        return bad_request()
    todo = Todo.query.get(id)
    if (todo is not None):
        # TODO: refactor this, there must be a better way to validate
        if (request.json.get('text', None) is not None):
            todo.text = request.json['text']
        if (request.json.get('due_date', None) is not None):
            todo.due_date = request.json['due_date']
        if (request.json.get('priority', None) is not None):
            todo.priority = request.json['priority']
        db.session.commit()
        return "OK", 200
    else:
        return not_found()


@app.errorhandler(404)
def not_found():
    return "<h1>404</h1><p>The resource could not be found</p>", 404


@app.errorhandler(400)
def bad_request():
    return "<h1>400</h1><p>Bad request</p>", 400


app.run()
