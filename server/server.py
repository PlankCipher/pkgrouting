from flask import Flask
from flask import jsonify
server = Flask(__name__)


# code:
# algorithm



@server.route('/')
def index():
    return "hi"


if __name__ == '__main__':
    server.run(debug=True, host='0.0.0.0')

