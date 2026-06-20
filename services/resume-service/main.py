from fastapi import FastAPI, UploadFile, File
import os
from pdf_parser import extract_text_from_pdf

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

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "text_preview": text[:1000]
    }
