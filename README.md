# mnist-digit-classifier
A digit classifier based on the convolutional neural network built using the TensorFlow library and trained on the most popular MNIST dataset.

The architecture of the neural network, i.e. the settings of each convolutional layers such as its strides, activation function etc., is taken from this [kaggle](https://www.kaggle.com/cdeotte/how-to-choose-cnn-architecture-mnist) article. The model is trained using the stochastic gradient descent, with the epoch iteration of 15, batch size of 16, and sparse categorical cross entropy as its loss function.

The model is pretty accurate, however, when I tested my own handwriting, it was sometimes failing giving me the incorrect result. It has managed to learn important characteristics of individual digits, and when drawing, you must make sure it is clear for it recognises them. Follow the preview below, and it can guarantee you some success.

## Technology
### Front-end
* JQuery
* HTML/CSS

### Back-end
* Flask
* AWS Lambda Serverless (Deployment)
* Tensorflow

## Deployment
* Visit my <a href="https://demo.arunharish.com/mnist-digit-classifier" target="_blank"> demo page</a> for live action!
* This deployment was made possible by AWS Lambda service with AWS API gateway as the trigger. The source of Lambda function handler can be seen in the path `model/lambda_app_model_inference.js` and requires `@tensorflow/tfjs-node` package, which can installed through `npm i` from the `model` root directory. The `generated` directory must exist in the same directory level as the script (in `model` directory) as it has the trained model files generated from the Python Tensorflow (read below for more information).

## Preview
<img src="preview-content/preview.gif" width="480" alt="Digit classifier trained on MNIST dataset preview" />

## Result
| Property | Value |
| ------ | ------ |
| Accuracy | ~98.02% |
| Loss | ~6.6% |
| Validation Accuracy | ~99.1% |
| Validation Loss | ~2.85% |

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
