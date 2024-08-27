
import requests
import base64


# Function to read an image file and convert it to a base64 string
def encode_image_to_base64(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Function to send a POST request to the API
def send_image_transformation_request(base64_image: str, transformation_type: str, rotate_angle: int = 0,
                                      resize_width: int = 0, resize_height: int = 0):
    url = "http://127.0.0.1:8000/transform"

    payload = {
        "base64_image": base64_image,
        "transformation_type": transformation_type,
        "rotate_angle": rotate_angle,
        "resize_width": resize_width,
        "resize_height": resize_height
    }

    response = requests.post(url, json=payload)

    if response.status_code == 200:
        print("Transformation successful!")
        print("Transformed image (base64):", response.json()['message'])
    else:
        print("Error:", response.status_code, response.json())

def send_image_to_text(img_path: str):
    url = "http://127.0.0.1:8000/to_text"

    payload = {
        "img_path": img_path,
    }

    response = requests.post(url, json=payload)

    if response.status_code == 200:
        print("Converting to text is successful!")
        print("Text:", response.json())
    else:
        print("Error:", response.status_code, response.json())


# Example usage
image_path = "Screenshot 2024-07-01 090634.png"
base64_image = encode_image_to_base64(image_path)

print("*** Transformation ***")
# Send request to the API with desired transformation
send_image_transformation_request(base64_image, transformation_type="grayscale")

print("** Image to Text ***")
send_image_to_text(img_path=image_path)