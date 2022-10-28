from flask import Flask
from waitress import serve
import models
from models import *
from sqlalchemy import delete

app = Flask(__name__)
session = Session()


@app.route("/")
def index():
    return "<span style = 'color: red'>Wrong page</span>"


@app.route("/api/v1/hello-world-13")
def HelloWorld():
    return "<span style = 'color:yellow'><h1>Hello World 13</h1></span>"


def testing():
    user1 = User(userId=1, username="annli_345", firstName="Ann", lastName="Li",
                 email="annli_345@email.com", password="AnnieIsTheBest24243")
    user2 = User(userId=2, username="robjames11223", firstName="Robert", lastName="James",
                 email="robjames11223@email.com", password="R0b3rtJ4m3S1", phone="697-345-3425")
    event1 = Event(eventId=1, creator_userId=1, title="Ann's Marriage", startDate='2023-01-03',
                   endDate='2023-01-05', startTime='09:30')
    participant1 = Participant.insert().values(user_userId=2, event_eventId=1,
                                               user_status="husband")
    deleting = delete(User).where(User.userId == 2)
    session.add(user1)
    session.commit()
    session.add(user2)
    session.commit()
    session.add(event1)
    session.commit()
    session.execute(participant1)
    session.commit()
    session.execute(deleting)
    session.commit()
    session.close()


testing()

if __name__ == '__main__':
    serve(app)
