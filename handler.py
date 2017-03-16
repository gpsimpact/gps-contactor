import json
import boto3

dynamodb = boto3.resource('dynamodb')
SES = boto3.client('ses')


class dynTable():
    def __init__(self, table_name):
        self.table = dynamodb.Table(table_name)

    def get(self, keys_dict):
        response = self.table.get_item(Key=keys_dict)
        self.item = response.get('Item', None)
        if not self.item:
            raise ValueError('Could not find item')
        return self.item



def makeEMAIL(firstname, subject, message, from_email):

    return """
     From: {firstname}\n
     Email: {from_email}\n
     Subject: {subject}\n
     Message: \n
     {message}

    """.format(firstname=firstname, from_email=from_email, subject=subject, message=message)
def makeHTMLEMAIL(firstname, subject, message, from_email):

    return """
     From: {firstname}<br/>
     Email: {from_email}<br/>
     Subject: {subject}<br/>
     Message: <br/>
     {message}

    """.format(firstname=firstname, from_email=from_email, subject=subject, message=message)
def func(event, context):

    conf = dynTable('GPS-contact-form-conf')
    uuid = event.get('pathParameters', {}).get('form_id', None)
    print uuid
    formconf = conf.get({'uuid': uuid})
    if not formconf.get('active', None):
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "active error"
            }
        print response
        return response
    if not formconf.get('email', None):
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "active error"
            }
        print response
        return response
    post_request = event.get('body', {})
    if isinstance(post_request, unicode) or isinstance(post_request, str):
        post_request = json.loads(post_request)


    if not post_request.get('from_email', None):
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "active error"
            }
        print response
        return response

    if not post_request.get('subject', None):
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "active error"
            }
        print response
        return response
    if not post_request.get('message', None):
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "active error"
            }
        print response
        return response
    if not post_request.get('firstname', None):
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "active error"
            }
        print response
        return response
    source_key = formconf.get('source_key', None)
    if not source_key:
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "key error"
            }
        print response
        return response
    if post_request.get('source_key', None) != source_key:
        response = {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "status": "error",
                "message": "key error"
            }
        print response
        return response

    send_email = 'emailservices@gpsimpact.com'

    if formconf.get('send_email', None):
        send_email = formconf['send_email']



    emailresponse = SES.send_email(
                        Source='GPS Contact Form<{}>'.format(send_email),
                        Destination={
                            'ToAddresses': [
                                formconf['email'],
                            ]
                        },
                        Message={
                            'Subject': {
                                'Data': "{}: {}".format(post_request['from_email'], post_request['subject']),
                                'Charset': 'utf-8'
                            },
                            'Body': {
                                'Text': {
                                    'Data': makeEMAIL(firstname= post_request['firstname'], subject = post_request['subject'], message=post_request['message'], from_email=post_request['from_email']),
                                    'Charset': 'utf-8'
                                },
                                'Html': {
                                    'Data': makeHTMLEMAIL(firstname= post_request['firstname'], subject = post_request['subject'], message=post_request['message'], from_email=post_request['from_email']),
                                    'Charset': 'utf-8'
                                }
                            }
                        },
                        ReplyToAddresses=[
                            formconf['email'],
                        ],

                    )

    response = {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin" : "*"
                },
                "body": json.dumps({"message": "success"})
            }
    print response
    return response

if __name__ == '__main__':
    with open('testpost.json') as event_data:
        e = json.load(event_data)
        # post(e, None)
        func(e, None)
