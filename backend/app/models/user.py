from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from sqlalchemy.ext.mutable import MutableList

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)  # Новое поле
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True, default="/static/avatars/default_avatar.png")  # Дефолтное значение
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    
    # Связь "многие к одному" с ролями
    role = relationship("Role", back_populates="users")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"