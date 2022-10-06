from flask import Flask
from waitress import serve

app = Flask(__name__)


@app.route("/")
def index():
    return "<span style = 'color: red'>Wrong page</span>"


@app.route("/api/v1/hello-world-13")
def HelloWorld():
    return "<span style = 'color:yellow'><h1>Hello World 13</h1></span>"


if __name__ == '__main__':
    serve(app)
