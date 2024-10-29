from flask import Flask, Blueprint, Response, request, jsonify
from waitress import serve
import datetime
from marshmallow import ValidationError
from flask_bcrypt import Bcrypt
import models
from models import *
from sqlalchemy import delete, update, select, values
from validation_schemas import UserSchema, EventSchema, ParticipantSchema, UserSchemaUpdate, ParticipantSchemaUpdate, \
    EventSchemaUpdate
from flask_cors import CORS, cross_origin

from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
CORS(app)
# session = Session()
bcrypt = Bcrypt()
auth = HTTPBasicAuth()


@auth.verify_password
def user_auth(username, password):
    session = Session()
    try:
        user = session.query(User).filter_by(username=username).first()
    except:
        return None
    if user and bcrypt.check_password_hash(user.password, password):
        return user
    else:
        return None


@app.route("/api/v1/user/<username>", methods=['GET'])
def get_userid_by_username(username):
    session = Session()
    db_user = session.query(User).filter_by(username=username).first()
    if not db_user:
        return jsonify({'message': 'User with such username does not exist.'}), 404
    return jsonify(db_user.userId)


@app.route("/api/v1/user", methods=['POST'])
def register_user():
    session = Session()
        # Get data from request body
    data = request.get_json()

        # Validate input data
    try:
        UserSchema().load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

        # Check if user already exists
    exists = session.query(User.userId).filter_by(username=data['username']).first()
    exists2 = session.query(User.userId).filter_by(email=data['email']).first()
        # exists3 = session.query(User.userId).filter_by(userId=data['userId']).first()
    if exists or exists2:
        return jsonify({'message': 'User with such username or email already exists.'}), 409

        # Hash user's password
    hashed_password = bcrypt.generate_password_hash(data['password'])
        # Create new user
    new_user = User(username=data['username'], firstName=data['firstName'],
                    lastName=data['lastName'],
                    email=data['email'], password=hashed_password, phone=data['phone'])
        # Add new user to db
    session.add(new_user)
    session.commit()
    return jsonify({'message': 'New user was successfully created!'}), 200


@app.route('/api/v1/login', methods=['POST'])
def login_user():
    session = Session()
    # Get data from request body
    data = request.get_json()

    # Check if user exists
    db_user = session.query(User).filter_by(username=data["username"]).first()
    if not db_user:
        return jsonify({'messages': 'User does not exists.'}), 404

    user = session.query(User).filter_by(username=data['username']).first()

    username = data['username']
    userId = user.userId
    if user and bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'messages': 'Success.', 'message': f'Logged in as {username}', 'userId': userId})
    else:
        return jsonify({'messages': 'Invalid input. Try again.'}), 400


# Get user by id
@app.route('/api/v1/user/<int:userId>', methods=['GET'])
@auth.login_required
def get_user(userId):
    session = Session()
    # try:
    if userId <= 0:
        return Response(status=400, response='Invalid user ID supplied.')
    current = auth.current_user()
    if current.userId == userId:

        # Check if user exists
        db_user = session.query(User).filter_by(userId=userId).first()
        if not db_user:
            return Response(status=404, response='User not found.')

            # Return user data
        user_data = {'id': db_user.userId, 'username': db_user.username, 'firstName': db_user.firstName,
                         'lastName': db_user.lastName, 'email': db_user.email, 'phone': db_user.phone}
        return jsonify(user_data)
    else:
        return Response(status=403, response="Access denied! The operation is forbidden for you")


# Update user by id
@app.route('/api/v1/user/<int:userId>', methods=['PUT'])
@auth.login_required
def update_user(userId):

    session = Session()
    current = auth.current_user()
    if current.userId == userId:
        # Get data from request body
        data = request.get_json()

        if userId <= 0:
            return Response(status=400, response='Invalid user ID supplied.')
        # Check if user exists

        db_user = session.query(User).filter_by(userId=userId).first()
        if not db_user:
            return jsonify({'message': 'User not found.'}), 404

        # Check if username is not taken if user tries to change it
        if 'username' in data.keys() and db_user.username != data['username']:
            exists = session.query(User).filter_by(username=data['username']).first()
            if exists:
                return jsonify({'message': 'User with such username already exists.'}), 404
            db_user.username = data['username']
        try:
            UserSchemaUpdate().load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        # Change user data
        if 'firstName' in data.keys():
            db_user.firstName = data['firstName']
        if "lastName" in data.keys():
            db_user.lastName = data['lastName']
        if 'password' in data.keys():
            hashed_password = bcrypt.generate_password_hash(data['password'])
            db_user.password = hashed_password
        if "email" in data.keys() and db_user.email != data['email']:
            exists = session.query(User).filter_by(email=data['email']).first()
            if exists:
                return jsonify({'message': 'User with such email already exists.'}), 404
            db_user.email = data['email']
        if "phone" in data.keys():
            db_user.phone = data["phone"]

        # Save changes
        session.commit()

        # Return new user data
        user_data = {'id': db_user.userId, 'username': db_user.username, 'first_name': db_user.firstName,
                        'last_name': db_user.lastName, 'email': db_user.email, 'phone': db_user.phone}
        return jsonify({'message': 'Successfully changed!'}), 200
    else:
        return jsonify({'message': 'Access denied.'}), 403


@app.route('/api/v1/user/<int:userId>', methods=['DELETE'])
@auth.login_required
def delete_user(userId):

        session = Session()
        if userId <= 0:
            return jsonify({'message': 'Invalid user ID supplied.'}), 400
        current = auth.current_user()
        if current.userId == userId:

            # Check if user exists
            db_user = session.query(User).filter_by(userId=userId).first()
            if not db_user:
                return jsonify({'message': 'A user with provided ID was not found.'}), 404

            # Delete user
            deleting = delete(User).where(User.userId == userId)
            session.execute(deleting)
            session.commit()
            return jsonify({'message': 'Successfully deleted!'}), 200
        else:
            return jsonify({'message': 'Access denied! The operation is forbidden for you.'}), 403


@app.route("/api/v1/event", methods=['POST'])
@auth.login_required
def add_event():
        session = Session()
        data = request.get_json()

        # Validate input data
        try:
            EventSchema().load(data)
        except ValidationError as err:
            return jsonify(err.messages), 411
        try:
            time1 = datetime.datetime.strptime(data["startTime"], '%H:%M')
            time2 = datetime.datetime.strptime(data["endTime"], '%H:%M')
        except:
            return jsonify({'message': 'Invalid input.'}), 412

        exists = session.query(User).filter_by(userId=data['creator_userId']).first()
        current = auth.current_user()
        if current.userId == data['creator_userId']:
            pass
        else:
            return jsonify({'message': 'Access denied! The operation is forbidden for you.'}), 403
        # exists3 = session.query(User.userId).filter_by(userId=data['userId']).first()

        if datetime.datetime.strptime(data['startDate'], '%Y-%m-%d') > datetime.datetime.strptime(data["endDate"],
                                                                                                  '%Y-%m-%d'):
            return jsonify({'message': 'Invalid input.'}), 413
        chek1 = datetime.datetime.strptime(data['startDate'], '%Y-%m-%d')
        chek2 = datetime.datetime.strptime(data["endDate"], '%Y-%m-%d')
        if chek1 == chek2 and datetime.datetime.strptime(data["endTime"], '%H:%M') <= datetime.datetime.strptime(
                data["startTime"], '%H:%M'):
            return jsonify({'message': 'Invalid input.'}), 414
        if not exists:
            return jsonify({'message': 'Invalid input.'}), 415

        new_event = Event(creator_userId=data['creator_userId'], title=data['title'],
                          aboutEvent=data['aboutEvent'],

                          startDate=data['startDate'], endDate=data["endDate"], startTime=data['startTime'],
                          endTime=data["endTime"])

        # Add new event to db
        session.add(new_event)
        session.commit()

        return jsonify({'message': 'New event was successfully created!'}), 200


@app.route('/api/v1/event/<int:eventId>', methods=['GET'])
@auth.login_required
def get_event(eventId):
    # try:

        session = Session()
        current = auth.current_user()
        if eventId <= 0:
            return Response(status=400, response='Invalid ID supplied')
        db_event = session.query(Event).filter_by(eventId=eventId).first()
        if not db_event:
            return Response(status=404, response='Event not found.')
        check1 = False
        check2 = False
        if current.userId == db_event.creator_userId:
            check1 = True
        events = session.query(Participant).filter_by(event_eventId=eventId).order_by(Participant.c.user_userId)

        q = 0

        for e in events:
            if e.user_userId != current.userId:
                pass
            else:
                q += 1

        if q == 0:
            check2 = False
        else:
            check2 = True
        if check1 is True or check2 is True:

            pass
        else:
            return Response(status=403, response="Access denied! The operation is forbidden for you")
        return jsonify(EventSchema().dump(db_event))
    # except:
        # return Response(status=500, response='Internal Server Error')


@app.route('/api/v1/event/<int:eventId>', methods=['PUT'])
@auth.login_required
def update_event(eventId):
    # try:
    session = Session()
    current = auth.current_user()
    # Get data from request body
    data = request.get_json()
    if eventId <= 0:
        return Response(status=400, response='Invalid ID supplied')
    db_event = session.query(Event).filter_by(eventId=eventId).first()
    if not db_event:
        return Response(status=404, response='A event with provided ID was not found.')
    if current.userId == db_event.creator_userId:
        pass
    else:
        return jsonify({'message': 'Access denied.'}), 403

    try:
        EventSchemaUpdate().load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400
    if 'startDate' not in data.keys():
        d1 = datetime.datetime.strptime(str(db_event.startDate), '%Y-%m-%d')
    else:
        d1 = datetime.datetime.strptime(data['startDate'], '%Y-%m-%d')
    if 'endDate' not in data.keys():
        d2 = datetime.datetime.strptime(str(db_event.endDate), '%Y-%m-%d')
    else:
        d2 = datetime.datetime.strptime(data["endDate"], '%Y-%m-%d')
    if d1 > d2:
        return jsonify({'message': 'Invalid input.'}), 400
    if 'startTime' not in data.keys():
        t1 = datetime.datetime.strptime(db_event.startTime, '%H:%M')
    else:
        try:
            t1 = datetime.datetime.strptime(data["startTime"], '%H:%M')
        except:
            return jsonify({'message': 'Invalid input.'}), 400
    if 'endTime' not in data.keys():
        t2 = datetime.datetime.strptime(db_event.endTime, '%H:%M')
    else:
        try:
            t2 = datetime.datetime.strptime(data["endTime"], '%H:%M')
        except:
            return jsonify({'message': 'Invalid input.'}), 400
    if d1 == d2 and t2 <= t1:
        return Responsejsonify({'message': 'Invalid input.'}), 400
    if 'creator_userId' in data.keys():
        exists = session.query(User).filter_by(userId=data['creator_userId']).first()
        # exists3 = session.query(User.userId).filter_by(userId=data['userId']).first()
        if not exists:
            return jsonify({'message': 'Invalid input.'}), 400
        else:
            db_event.creator_userId = data['creator_userId']
    if 'title' in data.keys():
        db_event.title = data['title']
    if "aboutEvent" in data.keys():
        db_event.aboutEvent = data['aboutEvent']
    if 'startDate' in data.keys():
        db_event.startDate = data['startDate']
    if "endDate" in data.keys():
        db_event.endDate = data['endDate']
    if "startTime" in data.keys():
        db_event.startTime = data["startTime"]
    if "endTime" in data.keys():
        db_event.endTime = data["endTime"]

    # Save changes
    session.commit()

    # Return new data
    return jsonify({'message': 'Event successfully updated.'}), 200


@app.route('/api/v1/event/<int:eventId>', methods=['DELETE'])
@auth.login_required
def delete_event(eventId):
    # try:
        session = Session()
        current = auth.current_user()
        db_event = session.query(Event).filter_by(eventId=eventId).first()
        if not db_event:
            return Response(status=404, response='Event with id '+str(eventId)+' does not exists.')
        if current.userId == db_event.creator_userId:
            pass
        else:
            return jsonify({'message': 'Access denied!'}), 403
   # Delete
        session.delete(db_event)
        session.commit()
        return jsonify({'message': 'The event was successfully deleted!'}), 200
    # except:
        # return Response(status=500, response='Internal Server Error')


@app.route('/api/v1/event/<int:eventId>/participants', methods=['GET'])
@auth.login_required
def get_participants(eventId):
    # try:
        session = Session()
        current = auth.current_user()
        db_event = session.query(Event).filter_by(eventId=eventId).first()
        if eventId <= 0:
            return Response(status=400, response='Invalid ID supplied')
        if not db_event:
            return Response(status=404, response='An event with provided ID was not found.')
        check1 = False  # participant
        check2 = False  # creator
        if current.userId == db_event.creator_userId:  # if creator
            check2 = True
        participants = session.query(Participant).filter_by(event_eventId=eventId).order_by(Participant.c.user_userId)
        for p in participants:  # if participant
            if p.user_userId == current.userId:
                check1 = True
        if check1 is True or check2 is True:
            pass
        else:
            return Response(status=403, response="Access denied! The operation is forbidden for you")

        users = session.query(Participant).filter_by(event_eventId=db_event.eventId).order_by(Participant.c.user_userId)

        c = session.query(User).filter_by(userId=db_event.creator_userId).first()
        output = []
        output.append({
                'id': c.userId,
                'username': c.username,
                'firstName': c.firstName,
                'lastName': c.lastName,
                'email': c.email,
                'phone': c.phone,
                'status': 'creator',
                'role': 'manager of this event'})

        for u in users:
            db_user = session.query(User).filter_by(userId=u.user_userId).first()
            output.append({'id': db_user.userId,
                           'username': db_user.username,
                           'firstName': db_user.firstName,
                           'lastName': db_user.lastName,
                           'email': db_user.email,
                           'phone': db_user.phone,
                           'role': u.user_status,
                           'status': 'participant'})

        return jsonify(output)


@app.route('/api/v1/event/<int:eventId>/participants/<int:userId>', methods=['POST'])
@auth.login_required
def add_participants_event(eventId, userId):
    # try:
        # Get data from request body
        session = Session()
        data = request.get_json()

        # Validate input data

        current = auth.current_user()
        db_event = session.query(Event).filter_by(eventId=eventId).first()
        if current.userId == db_event.creator_userId:
            pass
        else:
            return jsonify({'message': 'Access denied!'}), 403
        db_user = session.query(User).filter_by(userId=userId).first()
        if not db_user:
            return jsonify({'message': 'Invalid input.'}), 400
        if db_event.creator_userId == db_user.userId:
            return jsonify({'message': 'Invalid input.'}), 400
        user = session.query(Participant).filter_by(event_eventId=eventId).order_by(Participant.c.user_userId)
        for u in user:
            if u.user_userId == userId:
                return jsonify({'message': 'Participant already exists.'}), 405

        try:
            ParticipantSchemaUpdate().load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400

        participant = Participant.insert().values(user_userId=userId, event_eventId=eventId,
                                                  user_status=data["user_status"])
        session.execute(participant)
        session.commit()
        return jsonify({'message': 'New participant was successfully added!'}), 200


@app.route('/api/v1/event/<int:eventId>/participants/<int:userId>', methods=['PUT'])
@auth.login_required
def update_participants_event(eventId, userId):
    # try:

        session = Session()
        current = auth.current_user()
        db_event = session.query(Event).filter_by(eventId=eventId).first()
        if current.userId == db_event.creator_userId:
            pass
        else:
            return jsonify({'message': 'Access denied!'}), 403
        db_user = session.query(User).filter_by(userId=userId).first()
        db_event_participant = session.query(Participant).filter_by(event_eventId=eventId, user_userId=userId)
        if not db_event_participant:
            return jsonify({'message': 'Invalid input.'}), 400

        data = request.get_json()
        try:
            ParticipantSchemaUpdate().load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400

        if "user_status" in data.keys():
            #    db_event_participant.user_status = data["user_status"]
            session.execute(update(Participant).where(Participant.c.event_eventId == eventId,
                                                      Participant.c.user_userId == userId).values(
                user_status=data["user_status"]))
        # Save changes
        session.commit()
        return jsonify({'message': 'The participant was successfully updated!'}), 200
    # except:
        # return Response(status=500, response='Internal Server Error')


@app.route('/api/v1/event/<int:eventId>/participants/<int:userId>', methods=['DELETE'])
@auth.login_required
def delete_participants_event(eventId, userId):
    # try:

        session = Session()
        current = auth.current_user()
        db_event = session.query(Event).filter_by(eventId=eventId).first()
        if current.userId == db_event.creator_userId:
            pass
        else:
            return jsonify({'message': 'Access denied!'}), 403
        db_user = session.query(User).filter_by(userId=userId).first()
        db_event_participant = session.query(Participant).filter_by(event_eventId=eventId, user_userId=userId)

        if not db_event_participant:
            return jsonify({'message': 'Invalid input.'}), 400

        # Delete
        deleting = delete(Participant).where(Participant.c.event_eventId == eventId,
                                             Participant.c.user_userId == userId)
        session.execute(deleting)
        session.commit()
        return jsonify({'message': 'The participant was successfully deleted!'}), 200
    # except:

# @app.route('/api/v1/event/<int:eventId>/participants/<int:userId>', methods=['GET'])
# @auth.login_required
# def get_participants_event(eventId, userId):
#     # try:
#
#         session = Session()
#         db_event = session.query(Event).filter_by(eventId=eventId).first()
#         if not db_event:
#             return Response(status=404, response='Event not found')
#         db_user = session.query(User).filter_by(userId=userId).first()
#         if not db_user:
#             return Response(status=404, response='User not found')
#         user = session.query(Participant).filter_by(event_eventId=eventId, user_userId=userId)
#         if not user:
#             return Response(status=400, response='Invalid event or user value.')
#
#         output = []
#         for u in user:
#             if u.user_userId == userId:
#                 db_user = session.query(User).filter_by(userId=u.user_userId).first()
#                 output.append({'id': db_user.userId,
#                                'username': db_user.username,
#                                'firstName': db_user.firstName,
#                                'lastName': db_user.lastName,
#                                'email': db_user.email,
#                                'phone': db_user.phone,
#                                'status': u.user_status})
#         return jsonify(output), 200
#     # except:
#         # return Response(status=500, response='Internal Server Error')

        # return Response(status=500, response='Internal Server Error')


@app.route('/api/v1/calendar/<int:userId>', methods=['GET'])
@auth.login_required
def calendar(userId):
    # try:
        session = Session()
        current = auth.current_user()
        if userId <= 0:
            return Response(status=400, response='Invalid user ID supplied.')
        db_user = session.query(User).filter_by(userId=userId).first()
        if not db_user:
            return Response(status=404, response='User not found.')
        if current.userId == userId:
            events = session.query(Participant).filter_by(user_userId=db_user.userId).order_by(
                Participant.c.event_eventId)

            events2 = session.query(Event).filter_by(creator_userId=db_user.userId).order_by(Event.creator_userId)
            output = []
            for e in events:
                db_event = session.query(Event).filter_by(eventId=e.event_eventId).first()
                output.append({'role': 'Participant',
                               'id': db_event.eventId,
                               'owner': db_event.creator_userId,
                               'title': db_event.title,
                               'aboutEvent': db_event.aboutEvent,
                               'startDate': db_event.startDate,
                               'endDate': db_event.endDate,
                               'startTime': db_event.startTime,
                               'endTime': db_event.endTime})
            for e in events2:
                # db_event = session.query(Event).filter_by(eventId=e.eventId).first()
                output.append({'role': 'Creator',
                               'id': e.eventId,
                               'owner': e.creator_userId,
                               'title': e.title,
                               'aboutEvent': e.aboutEvent,
                               'startDate': e.startDate,
                               'endDate': e.endDate,
                               'startTime': e.startTime,
                               'endTime': e.endTime})
            if len(output) == 0:
                return Response(status=404, response='Event not found')
            return jsonify(output)
        else:
            return Response(status=403, response="Access denied! The operation is forbidden for you")
    # except:
        # return Response(status=500, response='Internal Server Error')


if __name__ == '__main__':
    # serve(app)
    app.run(debug=True)

