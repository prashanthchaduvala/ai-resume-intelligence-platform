from fastapi import FastAPI, UploadFile, File
import os
from pdf_parser import extract_text_from_pdf
import requests


app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/health")
def health():
    return {
        "service": "resume-service",
        "status": "running"
    }

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    text = extract_text_from_pdf(file_path)

    job_description = """
        Looking for Python Developer with
        Docker
        Kubernetes
        AWS
        Terraform
        Redis
        CI/CD
        """
    
    response = requests.post(
        "http://127.0.0.1:8002/analyze",
        json={
            "resume_text": text,
            "job_description": job_description
        }
    )

    analysis_result = response.json()

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        # "text_preview": text[:1000]
        "analysis": analysis_result
    }
