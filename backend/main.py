# backend/main.py

import os
import io
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from transformers import pipeline

# -------------------- LOAD ENV --------------------
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

# -------------------- FASTAPI --------------------
app = FastAPI()
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="../"), name="static")

@app.get("/")
def read_root():
    return FileResponse("../index.html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
      allow_credentials=True,  # Restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- HUGGINGFACE MODEL --------------------
image_pipeline = pipeline(
    "image-classification",
    model="google/vit-base-patch16-224"
)

# -------------------- GROQ CONFIG --------------------
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

# -------------------- GROQ FUNCTION --------------------
def generate_outfits_with_groq(description, style, gender, fav_colors):

    prompt = f"""
    The user has the following details:
    - Image description: {description}
    - Style preference: {style}
    - Gender: {gender}
    - Favorite colors: {fav_colors if fav_colors else "None"}

    Generate 5 stylish outfit recommendations.
    Keep them short and clean.
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    response = requests.post(GROQ_ENDPOINT, headers=headers, json=payload)

    if response.status_code != 200:
        print(response.status_code, response.text)
        return ["Error generating recommendations"]

    data = response.json()

    content = data["choices"][0]["message"]["content"]

    # Split into list
    return content.split("\n")


# -------------------- API ENDPOINT --------------------
@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    style: str = Form("casual"),
    gender: str = Form("female"),
    colors: str = Form("")
):

    # Read image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Image classification
    results = image_pipeline(image)

    # Take top 3 labels for context
    labels = [r["label"] for r in results[:3]]
    image_description = ", ".join(labels)

    fav_colors = colors.split(",") if colors else []

    recommendations = generate_outfits_with_groq(
        image_description,
        style,
        gender,
        fav_colors
    )

    return {
        "image_features": labels,
        "recommendations": recommendations
    }