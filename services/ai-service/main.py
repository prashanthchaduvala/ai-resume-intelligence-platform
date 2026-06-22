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

    # return {
    #     "match_score": data.match_score,
    #     "recommendations": recommendations
    # }
    return {
        "match_score": data.match_score,
        "recommendations": recommendations,

        "interview_questions": [
            "Explain Kubernetes architecture",
            "What is Terraform state?",
            "Difference between Docker and Kubernetes?",
            "How does CI/CD work?",
            "What is a Kubernetes Deployment?"
        ],

        "learning_roadmap": [
            "Terraform Fundamentals",
            "Helm Charts",
            "ArgoCD",
            "Advanced Kubernetes",
            "AWS DevOps Services"
        ]
    }