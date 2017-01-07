
# A very simple Bottle Hello World app for you to get started with...
from bottle import default_app, route, template

@route('/hello/<name>')
def index(name):
    return template('<b>Hello {{name}}</b>!', name=name)

application = default_app()

