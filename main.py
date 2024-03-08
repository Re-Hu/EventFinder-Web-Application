"""
The orginal file is from the exaple of homework5 main.py in Hello World - Google Cloud Platform
"""
from flask import Flask, request, jsonify
from geolib import geohash
import requests
import json

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return app.send_static_file('csci5716serverside.html')

@app.route('/search', methods=["GET"])
def search():
    # https://app.ticketmaster.com/discovery/v2/events.json?apikey= YOUR_API_KEY
    # &keyword=University+of+Southern+California
    # &segmentId=KZFzniwnSyZfZ7v7nE
    # &radius=10
    # &unit=miles
    # &geoPoint=9q5cs
    ticketurl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=X8Gv54y2ZkBnuljRD8bvifACGN1vNEAA"
    keyword = request.args.get('keyword')
    category = request.args.get('category')
    distance = request.args.get('distance')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    print(request.args)


    geo = geohash.encode(latitude, longitude, 7)
    ticketurl = ticketurl + "&keyword=" + keyword + "&segmentId=" + category + "&radius=" + distance + "&unit=miles" + "&geoPoint=" + geo
    print(ticketurl)
    response = requests.get(ticketurl).json()
    print(json.dumps(response))
    response = jsonify(response)
    # response.headers['Access-Control-Allow-Origin'] = '*'
    print("----")
    return response

@app.route('/searchevent', methods=["GET"])
def searchevent():
    eventurl = "https://app.ticketmaster.com/discovery/v2/events/"
    API = "apikey=X8Gv54y2ZkBnuljRD8bvifACGN1vNEAA"
    id = request.args.get('id')
    eventurl = eventurl + id + ".json?" + API
    response = requests.get(eventurl).json()
    print(json.dumps(response))
    response = jsonify(response)
    return response

@app.route('/searchvenue', methods=["GET"])
def searchvenue():
    envueurl = "https://app.ticketmaster.com/discovery/v2/venues?apikey=X8Gv54y2ZkBnuljRD8bvifACGN1vNEAA"
    keyword = request.args.get('keyword')
    envueurl = envueurl + "&keyword=" + keyword
    response = requests.get(envueurl).json()
    print(json.dumps(response))
    response = jsonify(response)
    return response

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=5000, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
