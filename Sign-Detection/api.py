from hand_detection import HandDetector, select_img
import cv2
from keras.models import load_model
import tensorflow as tf
import numpy as np
import urllib.request
from flask import Flask, jsonify, request
import base64
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

labels = ['Nasılsın','Seni Seviyorum', 'Hayır', 'Lütfen', 'Üzgünüm', 'Anladım', 'Evet']

# Load the trained Keras model
model = load_model('./best_model_64_64.h5', compile = False)

optims = [tf.keras.optimizers.Adam(learning_rate = 0.0001, beta_1 = 0.9, beta_2 = 0.999)]

model.compile(loss = 'categorical_crossentropy',
              optimizer = optims[0],
              metrics = ['accuracy'])



@app.route('/sign/predict', methods=['POST'])
def predict_image():

     # Get the image from the request
    image_url = request.get_json()['image']
    # response = requests.get(image_url)

    # Remove the data URI prefix and decode the Base64-encoded image
    image_data = base64.b64decode(image_url.split(",")[1])

    # Convert image content to numpy array
    image_content = np.frombuffer(image_data, np.uint8)

    # Read image from numpy array using cv2
    img = cv2.imdecode(image_content, cv2.IMREAD_COLOR)

    # Find hands
    cropped_img, sit = select_img(img)

    if sit:
        # Resize the frame to 48x48 pixels
        cropped_img = cv2.resize(cropped_img, (64, 64))

        # Convert the frame to RGB
        cropped_img = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)

        # Preprocess the frame
        cropped_img = cropped_img.astype('float32')
        cropped_img = np.expand_dims(cropped_img, axis=0)

        # Make a prediction using the Keras model
        pred = model.predict(cropped_img)
        
        # Get the predicted label
        label = np.argmax(pred)
        print(labels[label])

        return jsonify({
            'Sign': labels[label],
            'Ratio': pred.max()*100
        })
    
    print("loading")
    return jsonify({
        'Sign': 'El Tespit Edilemedi',
        'Ratio': 0
    })


if __name__ == '__main__':
    app.run()