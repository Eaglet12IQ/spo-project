from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from sqlalchemy.ext.mutable import MutableList

class Collector(Base):
    __tablename__ = "collectors"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    avatar_url = Column(String, nullable=False, default="/static/avatars/default_avatar.png")
    country = Column(String(50), nullable=False)
    phone_number = Column(String(20), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    middle_name = Column(String(50), nullable=True)  # Отчество может быть пустым

    # Связи
    user = relationship("User", back_populates="collector")
    collections = relationship("Collection", back_populates="collector", cascade="all, delete-orphan")  # Один-ко-многим
