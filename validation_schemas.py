from marshmallow import Schema, fields
from marshmallow.validate import Length


class UserSchema(Schema):
    userId = fields.Integer(strict=True)
    username = fields.String(required=True, validate=Length(min=3, max=25))
    firstName = fields.String(required=True, validate=Length(min=3, max=30))
    lastName = fields.String(required=True, validate=Length(min=3, max=30))
    email = fields.String(required=True, validate=Length(min=12, max=75))
    password = fields.String(required=True, validate=Length(min=4, max=20))
    phone = fields.String(required=False, validate=Length(min=9, max=45))


class EventSchema(Schema):
    eventId = fields.Integer(required=True, strict=True)
    creator_userId = fields.Integer(required=True, strict=True)
    title = fields.String(required=True, validate=Length(min=5, max=80))
    aboutEvent = fields.String(required=True, validate=Length(min=20, max=255))
    startDate = fields.Date(required=True)
    endDate = fields.Date(required=True)
    startTime = fields.String(required=False, validate=Length(min=5, max=5))
    endTime = fields.String(required=False, validate=Length(min=5, max=5))


class ParticipantSchema(Schema):
    user_status = fields.String(required=False, validate=Length(min=5, max=30))


class UserSchemaUpdate(Schema):
    userId = fields.Integer(strict=True)
    username = fields.String(validate=Length(min=3, max=25))
    firstName = fields.String(validate=Length(min=3, max=30))
    lastName = fields.String(validate=Length(min=3, max=30))
    email = fields.String(validate=Length(min=12, max=75))
    password = fields.String(validate=Length(min=4, max=20))
    phone = fields.String(validate=Length(min=9, max=45))


class EventSchemaUpdate(Schema):
    eventId = fields.Integer(strict=True)
    creator_userId = fields.Integer(strict=True)
    title = fields.String(validate=Length(min=5, max=80))
    aboutEvent = fields.String(validate=Length(min=20, max=255))
    startDate = fields.Date()
    endDate = fields.Date()
    startTime = fields.String(validate=Length(min=5, max=5))
    endTime = fields.String(validate=Length(min=5, max=5))


class ParticipantSchemaUpdate(Schema):
    user_status = fields.String(validate=Length(min=5, max=30))