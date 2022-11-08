from sqlalchemy import create_engine, Column, Integer, String, DATE, ForeignKey, Table
from sqlalchemy.orm import sessionmaker, scoped_session, relationship
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine("mysql+mysqlconnector://root:password@localhost:3306/calendar")

SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)


Base = declarative_base()


Participant = Table('participant', Base.metadata,
                    Column('user_userId', Integer, ForeignKey('user.userId', ondelete="CASCADE")),
                    Column('event_eventId', Integer, ForeignKey('event.eventId', ondelete="CASCADE")),
                    Column('user_status', String(30), nullable=True))


class User(Base):
    __tablename__ = 'user'

    userId = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    username = Column(String(25), nullable=False)
    firstName = Column(String(30), nullable=False)
    lastName = Column(String(30), nullable=False)
    email = Column(String(75), nullable=False)
    password = Column(String(80), nullable=False)
    phone = Column(String(45), nullable=True)
    events = relationship("Event")
    event = relationship("Event", secondary=Participant, back_populates="user")


class Event(Base):
    __tablename__ = 'event'

    eventId = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    creator_userId = Column(Integer, ForeignKey('user.userId', ondelete="CASCADE"), nullable=False)  # one-to-many
    title = Column(String(60), nullable=False)
    aboutEvent = Column(String(255), nullable=True)
    startDate = Column(DATE, nullable=False)
    endDate = Column(DATE, nullable=False)
    startTime = Column(String(5), nullable=True)
    endTime = Column(String(5), nullable=True)
    user = relationship("User", secondary=Participant, back_populates="event")

