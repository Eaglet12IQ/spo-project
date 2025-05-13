from sqlalchemy import Column, Integer, String, ForeignKey
from fastapi import HTTPException, Response, Request
from sqlalchemy.orm import relationship, Session
from .base import Base
from app.models.role import Role
from app.models.collector import Collector
from app.core.security import get_payload_from_refresh_token
from app.schemas.user import UserLoginWithPasswordValidation, UserCreateWithPasswordValidation
from app.core.security import verify_password, create_access_token, create_refresh_token, REFRESH_TOKEN_EXPIRE_DAYS, get_password_hash

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)  # Новое поле
    hashed_password = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False, default=2)
    
    # Связь "многие к одному" с ролями
    role = relationship("Role", back_populates="users")
    collector = relationship("Collector", back_populates="user", uselist=False)

    def delete(db: Session, response: Response, request: Request):
        payload = get_payload_from_refresh_token(request)

        access_user_id = payload.get("sub")
        
        user = db.query(User).filter(User.id == int(access_user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="Пользователь не найден с таким ID!")
        
        response.delete_cookie(
            key="refresh_token",
            secure=True,  # Обязательно, если кука устанавливалась с secure=True
            httponly=True,  # Если использовалось при установке
        )

        db.delete(user)
        db.commit()

        return {
            "message": "Пользователь удален.",
        }
    
    def login(db: Session, response: Response, user: UserLoginWithPasswordValidation):
        user_bd = db.query(User).filter((User.email == user.username) | (User.username == user.username)).first()

        if not user_bd:
            raise HTTPException(status_code=400, detail="Пользователь не найден!")
        
        if not verify_password(user.password, user_bd.hashed_password):
            raise HTTPException(status_code=400, detail="Пароль введен неверно!")
        
        access_token = create_access_token(data={
            "sub": str(user_bd.id),
            "role": user_bd.role_id  # или user_bd.role_id, если имя не доступно
        })
        refresh_token = create_refresh_token(data={
            "sub": str(user_bd.id),
            "role": user_bd.role_id
        })

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        )

        return {
            "message": "Пользователь авторизован.",
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    def logout(db: Session, request: Request, response: Response):
        payload = get_payload_from_refresh_token(request)
        access_user_id = payload.get("sub")
        
        user = db.query(User).filter(User.id == int(access_user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="Пользователь не найден с таким ID!")
        
        response.delete_cookie(
            key="refresh_token",
            httponly=True,  # Если использовалось при установке
        )

        return {
            "message": "Пользователь вышел из системы.",
        }
    
    def register(db: Session, response: Response, user: UserCreateWithPasswordValidation):
        if user.password != user.re_password:
            raise HTTPException(status_code=400, detail="Пароли не совпадают!")
        db_user_email = db.query(User).filter(User.email == user.email).first()
        db_user_username = db.query(User).filter(User.username == user.username).first()
        if db_user_email or db_user_username:
            raise HTTPException(status_code=400, detail="Почта или логин уже зарезервированы!")
        
        # Хэширование пароля
        hashed_password = get_password_hash(user.password)
        
        # Создание нового пользователя
        db_user = User(email=user.email, username=user.username, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        db_collector = Collector(user_id=db_user.id)
        db.add(db_collector)
        db.commit()

            # Генерируем токены для нового пользователя
        access_token = create_access_token(data={
            "sub": str(db_user.id),
            "role": db_user.role_id  # или user_bd.role_id, если имя не доступно
        })
        refresh_token = create_refresh_token(data={
            "sub": str(db_user.id),
            "role": db_user.role_id
        })
        
        # Устанавливаем refresh token в куки
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        )
        
        return {
            "message": "Пользователь зарегистрирован и авторизован.",
            "access_token": access_token,
            "token_type": "bearer"
        }