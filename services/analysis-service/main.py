from fastapi import FastAPI
from pydantic import BaseModel
from skills import SKILLS
import re

app = FastAPI()

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

@app.get("/health")
def health():
    return {
        "service": "analysis-service",
        "status": "running"
    }



def extract_skills(text):
    text = text.lower()

    found_skills = []

    for skill in SKILLS:
        # if skill.lower() in text:
        #     found_skills.append(skill)

        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text):
            found_skills.append(skill)

    return found_skills


# @app.post("/analyze")
# def analyze(data: AnalysisRequest):

#     resume_words = set(data.resume_text.lower().split())
#     jd_words = set(data.job_description.lower().split())

#     matched = resume_words.intersection(jd_words)

#     score = int(
#         (len(matched) / max(len(jd_words), 1)) * 100
#     )

#     resume_skills = extract_skills(data.resume_text)

#     jd_skills = extract_skills(data.job_description)

#     matched_skills = list(
#         set(resume_skills).intersection(
#             set(jd_skills)
#         )
#     )

#     missing_skills = list(
#         set(jd_skills) - set(resume_skills)
#     )

#     return {
#         "match_score": score,
#         "resume_skills": resume_skills,
#         "jd_skills": jd_skills,
#         "matched_skills": matched_skills,
#         "missing_skills": missing_skills
#     }

@app.post("/analyze")
def analyze(data: AnalysisRequest):

    resume_skills = extract_skills(data.resume_text)

    jd_skills = extract_skills(data.job_description)

    matched_skills = list(
        set(resume_skills).intersection(
            set(jd_skills)
        )
    )

    missing_skills = list(
        set(jd_skills) - set(resume_skills)
    )

    if len(jd_skills) == 0:
        score = 0
    else:
        score = round(
            len(matched_skills) /
            len(jd_skills) * 100
        )

    print("Resume Skills:", resume_skills)
    print("JD Skills:", jd_skills)
    print("Matched Skills:", matched_skills)
    print("Missing Skills:", missing_skills)
    print("Score:", score)

    return {
        "match_score": score,
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }