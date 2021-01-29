# mnist-digit-classifier
A digit classifier based on the convolutional neural network built using the TensorFlow library and trained on the most popular MNIST dataset.

The architecture of the neural network, i.e. the settings of each convolutional layers such as its strides, activation function etc., is taken from this [kaggle](https://www.kaggle.com/cdeotte/how-to-choose-cnn-architecture-mnist) article. The model is trained using the stochastic gradient descent, with the epoch iteration of 15, batch size of 16, and sparse categorical cross entropy as its loss function.

The model is pretty accurate, however, when I tested my own handwriting, it was sometimes failing giving me the incorrect result. It has managed to learn important characteristics of individual digits, and when drawing, you must make sure it is clear for it recognises them. Follow the demo below, and it can guarantee you some success.

## Demo
<img src="preview-content/preview.gif" width="480" alt="Digit classifier trained on MNIST dataset preview" />

## Result
| Metric | Result |
| ------ | ------ |
| Accuracy | ~98.02% |
| Loss | ~6.6% |
| Validation Accuracy | ~99.1% |
| Validation Loss | ~2.85% |
## Technology
### Front-end
* JQuery
* HTML/CSS

### Back-end
* Flask
* Tensorflow


## Build
Create a python virtual environment by following this [article](https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/26/python-virtual-env/).
Once the environment is activated, install the dependencies:
```console
pip install -r requirements.txt
```

Then start the flask server
```console
python server.py
```

The actual model is located in its model directory. To generate a new model:

```console
python generator.py
```