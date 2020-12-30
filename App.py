from flask import Flask, redirect
import os
import logging

# Flask configuration parameters
static_folder = "build"
http_port = 8080

static_parent = os.getcwd()
app = Flask(__name__,
            static_folder=os.path.join(static_parent, static_folder),
            static_url_path="/")


@app.route('/')
def index_html():
    return redirect("index.html", code=301)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    logging.info("Path to the root of the application - " + app.root_path)
    logging.info("Folder with static files - " + app.static_folder)
    logging.info("Path for the static files on the web - " +
                 (app.static_url_path if app.static_url_path else "/"))

    app.run(host='0.0.0.0', port=http_port)
