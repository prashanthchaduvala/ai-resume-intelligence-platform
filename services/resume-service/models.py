from sqlalchemy import Column,Integer,String,Text,DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class ResumeAnalysis(Base):

    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    match_score = Column(Integer)
    matched_skills = Column(Text)
    missing_skills = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)