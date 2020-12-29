import os
from flask import Flask, redirect

app = Flask(__name__)


@app.route('/')
def index_html():
    return redirect("static/index.html", code=301)


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 8000.
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
