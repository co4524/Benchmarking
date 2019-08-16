from flask import Flask, request
from gevent.pywsgi import WSGIServer

app=Flask(__name__)
@app.route('/')
def index():
	return '''
	hi
	'''
if __name__ == '__main__':
	print('Serving 8000')
	server = WSGIServer(('0.0.0.0', 26657), app)
	server.serve_forever()
