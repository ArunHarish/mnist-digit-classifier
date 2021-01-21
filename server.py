import flask
import os
import re
import tensorflow as tf
from PIL import Image
from io import BytesIO
from base64 import b64decode
from tensorflow import keras

from model.loader import Recogniser

app = flask.Flask(__name__, static_url_path="", static_folder="static")
recogniser = Recogniser()

@app.route("/")
def send_index():
    return app.send_static_file("index.html")

@app.route("/recognise", methods=["POST"])
def recognise():
    # Get the image and convert it into 28x28
    try:
        json = flask.request.json
        assert "image" in json
        image_encoded = re.sub('^data:image/.+;base64,', '', json["image"])
        
        image_decoded = b64decode(image_encoded)
        images_bytes_io = BytesIO(image_decoded)

        image = Image.open(images_bytes_io)

        image.thumbnail((28, 28), Image.ANTIALIAS)
        image_converted = image.convert("L")
        image_array = keras.preprocessing.image\
            .img_to_array(image_converted) / 255.0

        prediction = recogniser.predict(image_array)
        

        top_prediction = tf.argmax(prediction, axis=1)
        top_prediction_array = top_prediction.numpy()
        probable_index = top_prediction_array[0]

        label = int(probable_index)
        
        return flask.jsonify({
            "digit" : label,
            "probability" : float(prediction[0][label])
        })
    except AssertionError:
        return "Invalid Data provided", 400
    
app.config["CACHE_TYPE"] = "null"
app.run(host='0.0.0.0', port=3000)