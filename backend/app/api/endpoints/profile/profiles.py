from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.collector import Collector

router = APIRouter()

@router.get("/{user_id}")
async def profiles(user_id: str, db: Session = Depends(get_db)):
    return Collector.get_profile(user_id, db)
