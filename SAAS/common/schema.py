from ninja import Schema


class NotFoundSchema(Schema):
    message: str

class Message(Schema):
    message: str
    status: str