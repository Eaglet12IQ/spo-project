from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.collector import Collector
from app.models.collection import Collection
from app.core.security import get_payload_from_refresh_token
import os
import shutil

router = APIRouter()
AVATAR_UPLOAD_DIR = "static/collections"

@router.post("/create")
async def create_collection(
    request: Request,
    name: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    payload = get_payload_from_refresh_token(request)
    access_user_id = payload.get("sub")
    collector = Collector.get_collector(db, access_user_id)

    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type. Only images are allowed.")

    # Временный объект
    new_collection = Collection(
        collector_id=collector.user_id,
        name=name,
        description=description,
        photo_url="/static/avatars/default_avatar.png"
    )

    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    # Сохраняем файл
    file_extension = os.path.splitext(image.filename)[1]
    filename = f"{new_collection.id}{file_extension}"
    file_path = os.path.join(AVATAR_UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save avatar file.")

    new_collection.photo_url = f"/{AVATAR_UPLOAD_DIR}/{filename}"
    db.commit()

    return new_collection

@router.get("")
async def get_collections(db: Session = Depends(get_db)):
    collections = db.query(Collection).all()

    serialized_collections = []
    for collection in collections:
        serialized_collections.append({
            "id": collection.id,
            "collector_id": collection.collector_id,    
            "name": collection.name,
            "description": collection.description,
            "photo_url": f"http://localhost:8000{collection.photo_url}"
        })

    return serialized_collections

@router.get("/{collection_id}")
async def get_collection_by_id(collection_id: str, db: Session = Depends(get_db)):
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    return {
        "id": collection.id,
        "collector_id": collection.collector_id,
        "name": collection.name,
        "description": collection.description,
        "photo_url": f"http://localhost:8000{collection.photo_url}"
    }


