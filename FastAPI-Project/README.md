This FastAPI service provides capabilities for converting images to text using an image-to-text AI model and performing image transformations such as rotation, grayscale conversion, and more.

## How to Run

### Prerequisites
If you plan to use the **to_text** API, make sure to define your Hugging Face token in the `.env` file.

### Running Locally
To run the service locally, use the following command in your terminal:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Running with Docker
To run the service using Docker, execute the following command in your Docker terminal:

```bash
docker compose up --build
```

### Testing
To test the service, run the **requests.py** script with the following command:
```bash
python requests.py
```
