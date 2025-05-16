from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.collector import Collector
from app.models.user import User
from app.models.collection import Collection

router = APIRouter()

@router.get("/{user_id}")
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = User.get_user(db, user_id)

    collector = Collector.get_collector(db, user_id)
    
    collections = Collection.get_collections(db, user_id)

    return {
        "id": user_id,
        "username": user.username,
        "avatar_url": f"http://localhost:8000{collector.avatar_url}",
        "country": collector.country,
        "first_name": collector.first_name,
        "last_name": collector.last_name,
        "middle_name": collector.middle_name,
        "collections": collections
    }
