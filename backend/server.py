from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from datetime import datetime, timedelta
from passlib.hash import pbkdf2_sha256
from decouple import config
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token, get_jwt_identity
)
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///todos.db"

db = SQLAlchemy(app)


app.config['JWT_SECRET_KEY'] = config('JWT_SECRET_KEY')
jwt = JWTManager(app)


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
        return bad_request(400)
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
    else:
        return bad_request(400)


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    if not data or not 'username' in data or not 'password' in data:
        return bad_request(400)
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if (not username or not password):
        return bad_request(400)
    user = authenticate(username, password)
    if (user is not None):
        access_token = create_access_token(identity=username)
        response = {
            'access_token': create_access_token(identity=username, expires_delta=timedelta(minutes=60)),
            'refresh_token': create_refresh_token(identity=username)
        }
        return jsonify(response), 200
    return unauthorized(401)


def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and pbkdf2_sha256.verify(password, user.password):
        return user


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
@jwt_required
def list_todo():
    response = jsonify(Todo.query.all()), 200
    return response


@app.route('/todos/<id>', methods=['GET'])
@jwt_required
def get_todo(id):
    return jsonify(Todo.query.get(id)), 200


@app.route('/todos', methods=['POST'])
@jwt_required
def create_todo():
    if not request.json or not 'text' in request.json or not 'due_date' in request.json:
        return bad_request(400)
    todo = Todo(
        text=request.json['text'],
        due_date=datetime.strptime(
            request.json['due_date'], '%Y-%m-%dT%H:%M:%S.%f'),
    )
    if (request.json.get('priority', None) is not None):
        todo.priority = int(request.json['priority'])
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo), 201


@app.route('/todos/<id>', methods=['DELETE'])
@jwt_required
def delete_todo(id):
    todo = Todo.query.get(id)
    if (todo is not None):
        db.session.delete(todo)
        db.session.commit()
        return "OK", 200
    else:
        return not_found(404)


@app.route('/todos/<id>', methods=['PUT'])
@jwt_required
def update_todo(id):
    if not request.json:
        return bad_request(400)
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
        return not_found(404)


@app.errorhandler(404)
def not_found(e):
    return "<h1>404</h1><p>The resource could not be found</p>", 404


@app.errorhandler(400)
def bad_request(e):
    return "<h1>400</h1><p>Bad request</p>", 400


@app.errorhandler(401)
def unauthorized(e):
    return "<h1>401</h1><p>Unauthorized</p>", 401


app.run()
