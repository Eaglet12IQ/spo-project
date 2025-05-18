from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.collector import Collector
from app.models.user import User
from app.models.collection import Collection
from pydantic import BaseModel, EmailStr, constr
from typing import Optional

router = APIRouter()

class UserUpdateSchema(BaseModel):
    username: Optional[constr(min_length=3, max_length=50)] = None
    email: Optional[EmailStr] = None

class CollectorUpdateSchema(BaseModel):
    country: Optional[constr(max_length=100)] = None
    phone_number: Optional[constr(max_length=20)] = None
    first_name: Optional[constr(max_length=50)] = None
    last_name: Optional[constr(max_length=50)] = None
    middle_name: Optional[constr(max_length=50)] = None


@router.get("/list")
async def get_collectors_list(db: Session = Depends(get_db)):
    collectors = db.query(Collector).all()
    result = []
    for collector in collectors:
        result.append({
            "id": collector.user_id,
            "username": collector.user.username,
            "avatar_url": f"http://localhost:8000{collector.avatar_url}",
            "country": collector.country,
            "first_name": collector.first_name,
            "last_name": collector.last_name,
            "middle_name": collector.middle_name,
            "bio": collector.bio if hasattr(collector, 'bio') else '',
            "location": collector.location if hasattr(collector, 'location') else '',
            "memberSince": collector.member_since if hasattr(collector, 'member_since') else '',
            "collectionCount": len(collector.collections) if hasattr(collector, 'collections') else 0,
            "stampCount": sum(len(collection.stamps) for collection in collector.collections) if hasattr(collector, 'collections') else 0,
            "specialties": collector.specialties if hasattr(collector, 'specialties') else [],
            "following": 0,  # Placeholder, implement if needed
            "followers": 0,  # Placeholder, implement if needed
            "featured": False  # Placeholder, implement if needed
        })
    return result

@router.get("/{user_id}")
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = User.get_user(db, user_id)
    collector = Collector.get_collector(db, user_id)
    collections = Collection.get_collections(db, user_id)

    serialized_collections = []
    for collection in collections:
        serialized_collections.append({
            "id": collection.id,
            "name": collection.name,
            "description": collection.description,
            "photo_url": f"http://localhost:8000{collection.photo_url}",  # ✅ добавляем префикс
            "collector_id": collection.collector_id
        })

    return {
        "id": user_id,
        "username": user.username,
        "avatar_url": f"http://localhost:8000{collector.avatar_url}",
        "country": collector.country,
        "first_name": collector.first_name,
        "last_name": collector.last_name,
        "middle_name": collector.middle_name,
        "collections": serialized_collections  # ✅ возвращаем кастомные коллекции
    }

@router.put("/users/{user_id}", status_code=status.HTTP_200_OK)
async def update_user(user_id: str, user_update: UserUpdateSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_update.username is not None:
        user.username = user_update.username
    if user_update.email is not None:
        user.email = user_update.email
    db.commit()
    db.refresh(user)
    return {"message": "User updated successfully"}

@router.put("/collectors/{user_id}", status_code=status.HTTP_200_OK)
async def update_collector(user_id: str, collector_update: CollectorUpdateSchema, db: Session = Depends(get_db)):
    collector = db.query(Collector).filter(Collector.user_id == user_id).first()
    if not collector:
        raise HTTPException(status_code=404, detail="Collector not found")
    if collector_update.country is not None:
        collector.country = collector_update.country
    if collector_update.phone_number is not None:
        collector.phone_number = collector_update.phone_number
    if collector_update.first_name is not None:
        collector.first_name = collector_update.first_name
    if collector_update.last_name is not None:
        collector.last_name = collector_update.last_name
    if collector_update.middle_name is not None:
        collector.middle_name = collector_update.middle_name
    db.commit()
    db.refresh(collector)
    return {"message": "Collector updated successfully"}

