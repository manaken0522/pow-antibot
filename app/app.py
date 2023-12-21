import random
import string
import hashlib
import sqlite3
from flask import Flask
from flask import request
from flask import jsonify
from flask import make_response

length = 4

database = {}

app = Flask(__name__)

@app.route('/pow_antibot')
def antibot():
    if request.method == 'GET':
        if 'powab_session' in request.args.keys() and request.args['powab_session'] in database.keys():
            session_id = request.args['powab_session']
            random_string = database[session_id]['string']
            hashed_string = database[session_id]['hash']
        else:
            session_id = hashlib.sha256(''.join([random.choice(string.ascii_letters) for i in range(16)]).encode()).hexdigest()
            random_string = ''.join([random.choice(string.ascii_letters) for i in range(length)])
            hashed_string = hashlib.sha256(random_string.encode()).hexdigest()
            database[session_id] = {'hash':hashed_string,'string':random_string, 'solved':False}
        response = make_response(jsonify({'session_id':session_id, 'hash':hashed_string, 'length':length}))
        return response
    elif request.method == 'POST':
        if 'powab_session' in request.form.keys() and request.form['powab_session'] in database.keys():
            session_id = request.form['powab_session']
            if 'proof' in request.form.keys() and request.form['proof'] == database[session_id]['string']:
                database[session_id]['solved'] = True
                return True
        return False

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)