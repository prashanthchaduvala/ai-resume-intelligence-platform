from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AIRequest(BaseModel):
    match_score: int
    missing_skills: list[str]

@app.get("/health")
def health():
    return {
        "service": "ai-service",
        "status": "running"
    }

@app.post("/recommend")
def recommend(data: AIRequest):

    recommendations = []

    for skill in data.missing_skills:
        recommendations.append(
            f"Consider learning {skill}"
        )

    return {
        "match_score": data.match_score,
        "recommendations": recommendations
    }