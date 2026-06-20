from fastapi import FastAPI, UploadFile, File
import os
from pdf_parser import extract_text_from_pdf
import requests
from fastapi import Form

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
# async def upload_resume(file: UploadFile = File(...)):
async def upload_resume(file: UploadFile = File(...),job_description: str = Form(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    text = extract_text_from_pdf(file_path)

    
    
    response = requests.post(
        "http://127.0.0.1:8002/analyze",
        json={
            "resume_text": text,
            "job_description": job_description
        }
    )

    analysis_result = response.json()

    ai_response = requests.post(
        "http://127.0.0.1:8003/recommend",
        json={
            "match_score": analysis_result["match_score"],
            "missing_skills": analysis_result["missing_skills"]
            }
        )

    ai_result = ai_response.json()

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "analysis": analysis_result,
        "ai_recommendations": ai_result
    }
