from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Session
from .base import Base
from app.models.collection import Collection
from fastapi import HTTPException

class Collector(Base):
    __tablename__ = "collectors"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    avatar_url = Column(String, nullable=False, default="/static/avatars/default_avatar.png")
    country = Column(String(50), nullable=True)
    phone_number = Column(String(20), nullable=True)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    middle_name = Column(String(50), nullable=True)  # Отчество может быть пустым

    # Связи
    user = relationship("User", back_populates="collector")
    collections = relationship("Collection", back_populates="collector", cascade="all, delete-orphan")  # Один-ко-многим

    def get_profile(user_id, db: Session):
        from app.models.user import User
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
            collections_data.append({
                "id": collection.id,
                "name": collection.name,
                "description": collection.description,
                "photo_url": collection.photo_url
            })

        return {
            "id": user_id,
            "username": user.username,
            "avatar_url": f"http://localhost:8000{collector.avatar_url}",
            "country": collector.country,
            "first_name": collector.first_name,
            "last_name": collector.last_name,
            "middle_name": collector.middle_name,
            "collections": collections_data
        }
