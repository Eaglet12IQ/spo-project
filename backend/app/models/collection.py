from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from app.models.stamp import Stamp

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True)
    collector_id = Column(Integer, ForeignKey("collectors.user_id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    photo_url = Column(String, nullable=False, default="/static/avatars/default_avatar.png")
    
    # Связь один-к-одному с Stamp
    stamp = relationship("Stamp", back_populates="collection", uselist=False, cascade="all, delete-orphan")
    
    # Связь с Collector (один-ко-многим)
    collector = relationship("Collector", back_populates="collections")