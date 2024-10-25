from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from ..models import User, Post, Comment
import uuid
from jose import jwt, JWTError
from fastapi.security import OAuth2AuthorizationCodeBearer
