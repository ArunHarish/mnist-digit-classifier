import tensorflow as tf
from tensorflow import keras
mnist_set = keras.datasets.mnist.load_data()

(x_train, y_train), (x_test, y_test) = mnist_set

x_train = (x_train / 255.0)
x_test = (x_test / 255.0)

y_train = tf.constant(y_train)
y_test = tf.constant(y_test)

w, h = x_train[0].shape

x_train = tf.expand_dims(x_train, axis=-1)
x_test = tf.expand_dims(x_test, axis=-1)

TOTAL_LABELS = 10

"""
    Generates a new CNN model with the architecture explained at the below link.
    @see https://www.kaggle.com/ahmedbaz/how-to-choose-cnn-architecture-mnist
"""
# Generate the model
def generate_model():
    # 784 - [32C3-32C3-32C5S2] - [64C3-64C3-64C5S2] - 128 - 10
    model = tf.keras.Sequential()
    model.add(tf.keras.layers.Conv2D(32, kernel_size=3, activation="relu", input_shape=(w, h, 1)))
    model.add(tf.keras.layers.BatchNormalization())
    
    
    model.add(tf.keras.layers.Conv2D(32, kernel_size=3, activation="relu"))
    model.add(tf.keras.layers.BatchNormalization())
    model.add(tf.keras.layers.Dropout(0.40))
    
    model.add(tf.keras.layers.Conv2D(32, kernel_size=5, strides=2,
                activation="relu"))
    model.add(tf.keras.layers.BatchNormalization())
    
    model.add(tf.keras.layers.Dropout(0.40))

    model.add(tf.keras.layers.Conv2D(64, kernel_size=3, activation="relu"))
    model.add(tf.keras.layers.BatchNormalization())
    model.add(tf.keras.layers.Dropout(0.40))

    model.add(tf.keras.layers.Conv2D(64, kernel_size=3, activation="relu"))
    model.add(tf.keras.layers.BatchNormalization())
    model.add(tf.keras.layers.Dropout(0.40))

    model.add(tf.keras.layers.Conv2D(64, kernel_size=5, strides=2,
                activation="relu"))
    model.add(tf.keras.layers.BatchNormalization())
    model.add(tf.keras.layers.Dropout(0.40))

    model.add(tf.keras.layers.Flatten())
    model.add(tf.keras.layers.Dense(TOTAL_LABELS, activation="softmax"))

    return model

model = generate_model()

model.compile(optimizer=tf.keras.optimizers.SGD(), 
            loss=tf.keras.losses.SparseCategoricalCrossentropy(), 
            metrics=["accuracy"])

model.fit(x_train, y_train, epochs=15, batch_size=64, 
            validation_data=(x_test, y_test))
 
model.save("generated/")