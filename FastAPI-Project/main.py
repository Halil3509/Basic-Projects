from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image, ImageOps
import base64
import io
import logging
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def base64_to_image(base64_str: str) -> Image.Image:
    image_data = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_data))
    return image


def image_to_base64(image: Image.Image) -> str:
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

class ImageTransformationRequest(BaseModel):
    base64_image: str
    transformation_type: str
    rotate_angle: int = 0
    resize_width: int = 0
    resize_height: int = 0

class ToTextRequest(BaseModel):
    img_path: str

@app.post("/transform")
def transform_image(request: ImageTransformationRequest):
    try:
        # Convert base64 to image
        image = base64_to_image(request.base64_image)

        # Apply the requested transformation
        if request.transformation_type == "grayscale":
            image = ImageOps.grayscale(image)
        elif request.transformation_type == "rotate":
            image = image.rotate(request.rotate_angle)
        elif request.transformation_type == "resize":
            if request.resize_width > 0 and request.resize_height > 0:
                image = image.resize((request.resize_width, request.resize_height))
            else:
                raise HTTPException(status_code=400, detail="Invalid resize dimensions")
        else:
            raise HTTPException(status_code=400, detail="Invalid transformation type")

        # Convert the transformed image back to base64
        transformed_image_base64 = image_to_base64(image)

        return {"message": "Successfully transformed",
                "Base64Image": transformed_image_base64}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.post("/to_text")
def image_to_text(request: ToTextRequest):
    print("HG Token:" , os.environ.get('HG_TOKEN'))

    hg_token = os.getenv('HG_TOKEN')
    API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
    headers = {"Authorization": f"Bearer {hg_token}"}


    with open(request.img_path, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)

    return {"message": "Successfull",
            "Text": response.json()}

@app.get('/')
def initialize():
    return {"message": "Hello from the World of Wowoo"}