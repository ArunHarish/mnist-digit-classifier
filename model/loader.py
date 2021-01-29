import tensorflow as tf
from os import path

class Recogniser:
    
    def __init__(self):
        model_source = path.join(path.abspath(""), "model", "generated")
        self._model = tf.keras.models.load_model(model_source)
        
    def predict(self, raw_input):
        # Change the 3D input to 4D tensor
        input = tf.expand_dims(raw_input, axis=0)
        # Predict
        probability = self._model.predict(input)
        # Return
        return probability

