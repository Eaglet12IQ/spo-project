from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.collector import Collector
from app.models.collection import Collection
from app.models.stamp import Stamp

router = APIRouter()

@router.get("/{user_id}")
async def profiles(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден с таким ID!")
    
    collector = db.query(Collector).filter(Collector.user_id == user.id).first()
    if not collector:
        raise HTTPException(status_code=400, detail="Коллекционер не найден с таким ID!")
    
    collections = (
        db.query(Collection)
        .filter(Collection.collector_id == collector.user_id)
        .all()
    )

    collections_data = []
    for collection in collections:
        stamps = (
            db.query(Stamp)
            .filter(Stamp.collection_id == collection.id)
            .all()
        )
        stamps_data = [
            {
                "id": stamp.id,
                "name": stamp.name,
                "year": stamp.year,
                "country": stamp.country,
                "image_url": f"http://localhost:8000{stamp.photo_url}" if stamp.photo_url else None
            }
            for stamp in stamps
        ]

        collections_data.append({
            "id": collection.id,
            "name": collection.name,
            "description": collection.description,
            "stamps": stamps_data
        })

    return {
        "username": user.username,
        "email": user.email,
        "avatar_url": f"http://localhost:8000{collector.avatar_url}",
        "country": collector.country,
        "phone_number": collector.phone_number,
        "first_name": collector.first_name,
        "last_name": collector.last_name,
        "middle_name": collector.middle_name,
        "collections": collections_data
    }
