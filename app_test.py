from base64 import b64encode
from unittest import TestCase

from main import app
from models import Session, engine
import bcrypt
import json

app.testing = True
client = app.test_client()


class BaseTestCase(TestCase):
    client = app.test_client()

    def setUp(self):
        super().setUp()

        # Users data
        self.user_1_data = {
            "userId": 1,
            "username": "user1",
            "firstName": "Ivan",
            "lastName": "Petrenko",
            "email": "user1@gmail.com",
            "password": "user1",
            "phone": "0999309899"
        }

        self.user_1_data_hashed = {
            **self.user_1_data,
            "password": bcrypt.hashpw(bytes(self.user_1_data['password'], 'utf-8'), bcrypt.gensalt())
        }

        self.user_1_credentials = b64encode(b"user1:user1").decode('utf-8')

        self.user_2_data = {
            "userId": 2,
            "username": "user2",
            "firstName": "Ilona",
            "lastName": "Petrenko",
            "email": "user2@gmail.com",
            "password": "user2",
            "phone": "0992364786"
        }

        self.user_2_data_hashed = {
            **self.user_2_data,
            "password": bcrypt.hashpw(bytes(self.user_2_data['password'], 'utf-8'), bcrypt.gensalt())
        }

        self.user_2_credentials = b64encode(b"user2:user2").decode('utf-8')

        self.user_3_data = {
            "id_user": 3,
            "username": "us",
            "firstName": "Ivan",
            "lastName": "Petrenko",
            "email": "user3@gmail.com",
            "password": "user3",
            "phone": "0999309899",
        }

        self.user_4_data = {
            "username": "user1",
            "password": "user1"
        }

        self.user_5_data = {
            "username": "user2e332434",
            "password": "user1"
        }

        self.user_6_data = {
            "username": "user2",
            "password": "user1"
        }

        self.user_7_data = {
            "userId": 7,
            "username": "user7",
            "firstName": "Inna",
            "lastName": "Petrenko",
            "email": "user4@gmail.com",
            "password": "user7",
            "phone": "0972515399"
        }

        self.user_7_data_hashed = {
            **self.user_7_data,
            "password": bcrypt.hashpw(bytes(self.user_7_data['password'], 'utf-8'), bcrypt.gensalt())
        }
        self.user_7_credentials = b64encode(b"user7:user7").decode('utf-8')

        # Event data
        self.event_1_data = {
            "eventId": 1,
            "creator_userId": 1,
            "title": "Friday Party",
            "aboutEvent": "Theme of the party is Harry Potter. Buy some cookies and fruits.",
            "startDate": "2022-05-06",
            "endDate": "2022-05-07",
            "startTime": "20:00",
            "endTime": "03:00"
        }

        self.event_2_data = {
            "eventId": 2,
            "creator_userId": 2,
            "title": "Vacation",
            "aboutEvent": "Yahoo it's vacation. Thanks heaven! I'm free!",
            "startDate": "2022-06-06",
            "endDate": "2022-07-10",
            "startTime": "00:00",
            "endTime": "23:59"
        }

        self.event_3_data = {
            "eventId": 3,
            "creator_userId": 1,
            "title": "Shop",  # too short
            "aboutEvent": "Sometimes you need some relax. Let's go shopping.",
            "startDate": "2022-06-03",
            "endDate": "2022-06-03",
            "startTime": "16:15",
            "endTime": "21:00"
        }

        self.event_4_data = {
            "eventId": 4,
            "creator_userId": 2,
            "title": "Music classes",
            "aboutEvent": "Need new mediator. Drop one in music store 'Muse' on Yellow Square.",
            "startDate": "2022-05-30",
            "endDate": "2022-05-30",
            "startTime": "20fl3",  # invalid time
            "endTime": "15:15"
        }

        self.event_5_data = {
            "eventId": 5,
            "creator_userId": 2,
            "title": "Music classes",
            "aboutEvent": "Need new mediator. Drop one in music store 'Muse' on Yellow Square.",
            "startDate": "2022-05-30",
            "endDate": "2021-05-30",  # ends before starts
            "startTime": "18:00",
            "endTime": "19:00"
        }

        self.event_6_data = {
            "eventId": 6,
            "creator_userId": 2,
            "title": "Music classes",
            "aboutEvent": "Need new mediator. Drop one in music store 'Muse' on Yellow Square.",
            "startDate": "2022-05-30",
            "endDate": "2022-05-30",
            "startTime": "18:00",
            "endTime": "15:00"  # ends before starts
        }

        # Participant data
        self.participant_1_data = {
            "user_userId": 2,
            "event_eventId": 1,
            "user_status": "Hermione"
        }

        self.participant_2_data = {
            "user_userId": 3,  # no user with such id
            "event_eventId": 2,
            "user_status": "coworker"
        }

        self.participant_3_data = {
            "user_userId": 1,
            "event_eventId": 10000,  # no event with such id
            "user_status": "guitarist"
        }

        self.participant_4_data = {
            "user_userId": 2,  # participant's id is creator's id
            "event_eventId": 5,
            "user_status": "guitarist"
        }

        self.participant_5_data = {
            "user_userId": 7,
            "event_eventId": 1,
            "user_status": "Luna Lovegood"
        }

        self.participant_6_data = {
            "user_userId": 7,
            "event_eventId": 2,
            "user_status": "coworker"
        }

        self.participant_7_data = {
            "user_userId": 7,
            "event_eventId": 2,
            "user_status": "This status must be so long that it will cause error."  # too long status
        }

    def tearDown(self):
        self.close_session()

    def close_session(self):
        Session.close()

    def create_app(self):
        app.config['TESTING'] = True
        return app

    def get_auth_headers(self, credentials):
        return {"Authorization": f"Basic {credentials}"}

    # Methods for the database
    def clear_user_db(self):
        # engine.execute('SET FOREIGN_KEY_CHECKS=0;')
        engine.execute('delete from user;')

    def clear_event_db(self):
        # engine.execute('SET FOREIGN_KEY_CHECKS=0;')
        engine.execute('delete from event;')

    def clear_participant_db(self):
        # engine.execute('SET FOREIGN_KEY_CHECKS=0;')
        engine.execute('delete from participant;')

    def create_all_users(self):
        self.client.post('api/v1/user', json=self.user_1_data)
        self.client.post('api/v1/user', json=self.user_2_data)
        self.client.post('api/v1/user', json=self.user_7_data)

    def create_all_events(self):
        self.client.post('api/v1/event', json=self.event_1_data,
                         headers=self.get_auth_headers(self.user_1_credentials))
        self.client.post('api/v1/event', json=self.event_2_data,
                         headers=self.get_auth_headers(self.user_2_credentials))

    def create_all_participants(self):
        self.client.post('api/v1/participant', json=self.participant_1_data,
                         headers=self.get_auth_headers(self.user_1_credentials))
        # self.client.post('api/v1/participant', json=self.participant_5_data,
        #                 headers=self.get_auth_headers(self.user_1_credentials))
        self.client.post('api/v1/participant', json=self.participant_6_data,
                         headers=self.get_auth_headers(self.user_2_credentials))


# User functions testing
class TestUser(BaseTestCase):

    # register user
    def test_create_user_1(self):
        self.clear_user_db()
        response = self.client.post('api/v1/user', json=self.user_1_data)
        self.assertEqual(response.status_code, 200)

    def test_create_user_invalid(self):  # invalid username (2 symbols)
        self.clear_user_db()
        response = self.client.post('api/v1/user', json=self.user_3_data)
        self.assertEqual(response.status_code, 400)

    def test_create_user_not_unique(self):  # user with such username/email already exists
        self.clear_user_db()
        self.client.post('api/v1/user', json=self.user_1_data)
        response = self.client.post('api/v1/user', json=self.user_1_data)
        self.assertEqual(response.status_code, 409)

    # login user
    def test_login_user_1(self):
        self.clear_user_db()
        self.create_all_users()
        response = self.client.post('api/v1/user/login', json=self.user_4_data)
        self.assertEqual(response.status_code, 200)

    def test_login_user_invalid_1(self):  # no user with such username
        self.clear_user_db()
        self.create_all_users()
        response = self.client.post('api/v1/user/login', json=self.user_5_data)
        self.assertEqual(response.status_code, 404)

    def test_login_user_invalid_2(self):  # invalid username/password
        self.clear_user_db()
        self.create_all_users()
        response = self.client.post('api/v1/user/login', json=self.user_6_data)
        self.assertEqual(response.status_code, 400)

    # get user
    def test_get_user_by_id(self):
        self.clear_user_db()
        self.create_all_users()
        response = self.client.get('api/v1/user/1', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_get_user_by_id_forbidden(self):  # forbidden operation
        self.clear_user_db()
        self.create_all_users()
        response = self.client.get('api/v1/user/1000', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_get_user_by_id_not_existing(self):  # invalid ID
        self.clear_user_db()
        self.create_all_users()
        response = self.client.get('api/v1/user/0', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    # update user
    def test_update_user(self):
        self.clear_user_db()
        self.create_all_users()

        response = self.client.put('api/v1/user/1', data=json.dumps({
            "username": "user11",
            "firstName": "Ivan",
            "lastName": "Petrenko",
            "email": "user1@gmail.com",
            "password": "user1",
            "phone": "0999309899",
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_update_user_forbidden(self):  # forbidden action: user with id2 tries to change user with id1
        self.clear_user_db()
        self.create_all_users()

        response = self.client.put('api/v1/user/2', data=json.dumps({
            "username": "user22",
            "firstName": "Ivan",
            "lastName": "Petrenko",
            "email": "user22@gmail.com",
            "password": "user2",
            "phone": "0999309899",
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_update_user_invalid_1(self):  # invalid input (username too short)
        self.clear_user_db()
        self.create_all_users()
        response = self.client.put('api/v1/user/1', data=json.dumps({
            "username": "us"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_update_user_invalid_2(self):  # user user2 already exists
        self.clear_user_db()
        self.create_all_users()
        response = self.client.put('api/v1/user/1', data=json.dumps({
            "username": "user2"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    def test_update_invalid_3(self):  # user with such email already exists
        self.clear_user_db()
        self.create_all_users()
        response = self.client.put('api/v1/user/1', data=json.dumps({
            "email": "user2@gmail.com"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    # delete user
    def test_delete_user(self):
        self.clear_user_db()
        self.create_all_users()
        response = self.client.delete('api/v1/user/1', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_delete_user_forbidden(self):  # deleting another user is forbidden
        self.clear_user_db()
        self.create_all_users()
        response = self.client.delete('api/v1/user/10000', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_delete_user_invalid(self):  # invalid id
        self.clear_user_db()
        self.create_all_users()
        response = self.client.delete('api/v1/user/0', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)


# Event functions testing
class TestEvent(BaseTestCase):

    # create event
    def test_create_event_1(self):
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        response = self.client.post('api/v1/event', json=self.event_1_data,
                                    headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_create_event_2(self):
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        response = self.client.post('api/v1/event', json=self.event_2_data,
                                    headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 200)

    def test_create_event_forbidden(self):  # can not change someone's calendar
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        response = self.client.post('api/v1/event', json=self.event_2_data,
                                    headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_create_event_invalid_1(self):  # invalid input: too short title of the event
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        response = self.client.post('api/v1/event', json=self.event_3_data,
                                    headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_create_event_invalid_2(self):  # invalid input (StartTime)
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        response = self.client.post('api/v1/event', json=self.event_4_data,
                                    headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_create_event_invalid_3(self):  # invalid date (ends before starts)
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        response = self.client.post('api/v1/event', json=self.event_5_data,
                                    headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 400)

    def test_create_event_invalid_4(self):  # invalid time (ends before starts)
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        response = self.client.post('api/v1/event', json=self.event_6_data,
                                    headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 400)

    # get event by id
    def test_get_event_by_id(self):
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.get('api/v1/event/1', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_get_event_by_id_invalid(self):  # invalid id
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.get('api/v1/event/0', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_get_event_by_id_forbidden(self):  # forbidden action
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.get('api/v1/event/2', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_get_event_by_id_not_existing(self):  # event with id = 3 not exists
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.get('api/v1/event/3', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    # update event
    def test_update_event_1(self):
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/1', data=json.dumps({
            "title": "Friday Harry Potter Party"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_update_event_2(self):
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/2', data=json.dumps({
            "startDate": "2022-06-04",
            "endDate": "2022-07-08",
            "startTime": "00:00",
            "endTime": "23:59"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 200)

    def test_update_event_invalid_1(self):  # event not found
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/10000', data=json.dumps({
            "title": "Friday Harry Potter Party"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    def test_update_event_forbidden(self):  # forbidden action
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/2', data=json.dumps({
            "title": "Friday Harry Potter Party"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_update_event_invalid_2(self):  # too short title
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/0', data=json.dumps({
            "title": "FP"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_update_event_invalid_3(self):  # too long title
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/1', data=json.dumps({
            "title": "Theme of the party is Harry Potter. Buy some cookies and fruits. Theme of the party is HP."
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_update_event_invalid_4(self):  # ends before starts
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/1', data=json.dumps({
            "startDate": "2022-05-06",
            "endDate": "2022-05-06",
            "endTime": "11:00"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_update_event_invalid_5(self):  # ends before starts
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/1', data=json.dumps({
            "startDate": "2022-05-06",
            "endDate": "2021-05-07"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_update_event8(self):  # user with id = 1000 does not exist
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.put('api/v1/event/1', data=json.dumps({
            "creator_userId": 1000,
            "endTime": "05:00"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    # delete event by id
    def test_delete_event_by_id(self):
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.delete('api/v1/event/1', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_delete_event_by_id_forbidden(self):  # forbidden action
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.delete('api/v1/event/2', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_delete_event_by_id_invalid(self):  # event with such id not found
        self.clear_user_db()
        self.clear_event_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.delete('api/v1/event/3', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)


# Participants' functions testing
class TestParticipants(BaseTestCase):

    # get participants by event id
    def test_get_participants(self):
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        self.create_all_events()
        self.clear_participant_db()
        self.create_all_participants()
        response = self.client.get('/api/v1/1/participants', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_get_participants_forbidden(self):  # forbidden operation
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        self.create_all_events()
        self.clear_participant_db()
        self.create_all_participants()
        response = self.client.get('/api/v1/2/participants', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_get_participants_invalid_1(self):  # invalid event id
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        self.create_all_events()
        self.clear_participant_db()
        self.create_all_participants()
        response = self.client.get('api/v1/0/participants', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_get_participants_invalid_2(self):  # no such event
        self.clear_user_db()
        self.create_all_users()
        self.clear_event_db()
        self.create_all_events()
        self.clear_participant_db()
        self.create_all_participants()
        response = self.client.get('api/v1/10000/participants', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)


# Participant functions testing
class TestParticipant(BaseTestCase):

    # add participant via event id and user id
    def test_create_participant_1(self):
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.post('/api/v1/event/1/participants/2', data=json.dumps({
            "user_status": "Hermiona"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_create_participant_forbidden(self):  # access denied
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.post('/api/v1/event/1/participants/7', data=json.dumps({
            "user_status": "Luna Lovegood"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 403)

    def test_create_participant_invalid_1(self):  # no event with such id
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.post('/api/v1/event/10000/participants/1', data=json.dumps({
            "user_status": "coworker"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 400)

    def test_create_participant_invalid_2(self):  # no user with such id
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.post('/api/v1/event/1/participants/3', data=json.dumps({
            "user_status": "coworker"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_create_participant_invalid_3(self):  # p.user_userId = e.creator_userId
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.post('/api/v1/event/1/participants/1', data=json.dumps({
            "user_userId": 1,
            "event_eventId": 1,
            "user_status": "The Creator"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_create_participant_invalid_4(self):  # participant already exists
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.post('/api/v1/event/1/participants/2', json=self.participant_1_data,
                                    headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 405)

    def test_create_participant_invalid_5(self):  # user_status too long
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        response = self.client.post('/api/v1/event/2/participants/7', json=self.participant_7_data,
                                    headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 405)

    # get participant by event id and user id
    def test_get_participant(self):
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/event/1/participants/2',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_get_participant_invalid_1(self):  # event does not exist
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/event/10000/participants/2',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    def test_get_participant_invalid_2(self):  # user does not exist
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/event/1/participants/10',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    '''def test_get_participant_invalid_3(self):  # user is not a participant
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/event/1/participants/7',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)'''

    # update participant by event id and user id
    def test_update_participant(self):
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.put('/api/v1/event/1/participants/2', data=json.dumps({
            "user_status": "HerMiOne"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_update_participant_forbidden(self):  # access denied
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.put('/api/v1/event/1/participants/2', data=json.dumps({
            "user_status": "HerMiOne"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 403)

    def test_update_participant_invalid_1(self):  # no event with such id
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.put('/api/v1/event/10000/participants/2', data=json.dumps({
            "user_status": "HerMiOne"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    def test_update_participant_invalid_2(self):  # user not found
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.put('/api/v1/event/1/participants/10', data=json.dumps({
            "user_status": "HerMiOne"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    '''def test_update_participant_invalid_3(self):  # participant not found
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.put('/api/v1/event/1/participants/7', data=json.dumps({
            "user_status": "HerMiOne"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)'''

    def test_update_participant_invalid_4(self):  # too short user status
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.put('/api/v1/event/1/participants/2', data=json.dumps({
            "user_status": "HR"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 405)

    # delete participant via event id and user id
    def test_delete_participant(self):
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.delete('/api/v1/event/1/participants/2',
                                      headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_delete_participant_forbidden(self):
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.delete('/api/v1/event/2/participants/7',
                                      headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 403)

    def test_delete_participant_invalid_1(self):  # event not found
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.delete('/api/v1/event/10000/participants/2',
                                      headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    def test_delete_participant_invalid_2(self):  # no user
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.delete('/api/v1/event/1/participants/10',
                                      headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    '''def test_delete_participant_invalid_3(self):  # no participant (invalid event or user id)
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.delete('/api/v1/event/1/participants/7',
                                      headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)'''


# Participant functions testing
class TestCalendar(BaseTestCase):

    # get list of events by user Id
    def test_get_calendar(self):
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/calendar/1',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 200)

    def test_get_calendar_invalid_1(self):  # invalid id
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/calendar/0',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 400)

    def test_get_calendar_invalid_2(self):  # invalid user id
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/calendar/10000',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    def test_get_calendar_invalid_3(self):  # events not found
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        response = self.client.get('/api/v1/calendar/1',
                                   headers=self.get_auth_headers(self.user_1_credentials))
        self.assertEqual(response.status_code, 404)

    def test_get_calendar_forbidden(self):  # access denied
        self.clear_user_db()
        self.clear_event_db()
        self.clear_participant_db()
        self.create_all_users()
        self.create_all_events()
        self.create_all_participants()
        response = self.client.get('/api/v1/calendar/1',
                                   headers=self.get_auth_headers(self.user_2_credentials))
        self.assertEqual(response.status_code, 403)
