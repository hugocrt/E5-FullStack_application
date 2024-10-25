import os

import jwt
from fastapi import HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta

from models import User as UserModel
from schemas import UserCredentials, User

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "should-be-an-environment-variable")
JWT_SECRET_ALGORITHM = os.getenv("JWT_SECRET_ALGORITHM", "HS256")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _encode_jwt(user: User) -> str:
    expiration = datetime.now() + timedelta(days=1)
    return jwt.encode(
        {
            "user_id": str(user.id),
            "exp": expiration
        },
        JWT_SECRET_KEY,
        algorithm=JWT_SECRET_ALGORITHM,
    )


def generate_access_token(
    db: Session,
    user_login: UserCredentials,
):
    user = db.query(UserModel).filter(UserModel.username == user_login.username).first()

    if not user or not verify_password(user_login.password, user.password):
        raise HTTPException(status_code=404, detail="Incorrect username or password")

    return _encode_jwt(user)


def verify_autorization_header(access_token: str):
    if not access_token or not access_token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No auth provided.")

    try:
        token = access_token.split("Bearer ")[1]
        auth = jwt.decode(
            token, JWT_SECRET_KEY, JWT_SECRET_ALGORITHM
        )
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail=f"Invalid token.")

    return auth
