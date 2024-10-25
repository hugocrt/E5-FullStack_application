from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer
from starlette.requests import Request

import models
from schemas import User, UserCredentials, UserUpdate
import services.user as _
import services.like as like_service
from services.auth import verify_autorization_header, generate_access_token


user_router = APIRouter(prefix="/users")
security = HTTPBearer()


@user_router.get("/", tags=["users"])
async def retrieve_user(db: Session = Depends(models.get_db)):
    return _.get_all_users(db=db)


@user_router.post("/me", tags=["users"])
async def create_own_account(user_login: UserCredentials, db: Session = Depends(models.get_db)):
    new_user = _.create_user(user=user_login, db=db)

    if new_user:
        access_token = generate_access_token(db=db, user_login=user_login)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=400, detail="User creation failed")


@user_router.delete("/me", dependencies=[Depends(security)], tags=["users"])
async def delete_own_account(request: Request, password: str, db: Session = Depends(models.get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_autorization_header(auth_header)
    user_id = token.get("user_id")
    return _.delete_own_account(db=db, current_user_id=user_id, password=password)


@user_router.get("/me/likes", dependencies=[Depends(security)], tags=["like"])
async def get_user_liked_posts(request: Request, db: Session = Depends(models.get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_autorization_header(auth_header)
    user_id = token.get("user_id")
    return like_service.get_liked_posts_for_user(db=db, user_id=user_id)


@user_router.get("/search", tags=["users"])
async def search_users(query: str, db: Session = Depends(models.get_db)):
    return _.search(db=db, query=query)


@user_router.get("/{user_id}", tags=["users"])
async def retrieve_user(user_id: str, db: Session = Depends(models.get_db)) -> User:
    return _.get_user_by_id(user_id=user_id, db=db)


@user_router.post("/{user_id}/follow", dependencies=[Depends(security)], tags=["users"])
async def follow_user(request: Request, user_id, db: Session = Depends(models.get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_autorization_header(auth_header)
    current_user_id = token.get("user_id")
    return _.follow_user(db=db, user_to_follow_id=user_id, current_user_id=current_user_id)


@user_router.post("/{user_id}/unfollow", dependencies=[Depends(security)], tags=["users"])
async def unfollow_user(request: Request, user_id, db: Session = Depends(models.get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_autorization_header(auth_header)
    current_user_id = token.get("user_id")
    return _.unfollow_user(db=db, user_to_unfollow_id=user_id, current_user_id=current_user_id)


@user_router.get("/{user_id}/followers", tags=["users"])
async def get_followers(user_id: str, skip: int = 0, limit: int = 10, db: Session = Depends(models.get_db)):
    return _.get_user_followers(db=db, user_id=user_id, skip=skip, limit=limit)


@user_router.get("/{user_id}/following", tags=["users"])
async def get_following(user_id: str, skip: int = 0, limit: int = 10, db: Session = Depends(models.get_db)):
    """
    Voir les utilisateurs suivis par un utilisateur.
    """
    return _.get_user_following(db=db, user_id=user_id, skip=skip, limit=limit)


@user_router.put("/{user_id}", dependencies=[Depends(security)], tags=["users"])
async def update_user_info(request: Request, user_update: UserUpdate, db: Session = Depends(models.get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_autorization_header(auth_header)
    user_id = token.get("user_id")
    return _.update_user(db=db, user_id=user_id, user_update=user_update)


@user_router.get("/{user_id}/profile", tags=["users"])
async def get_user_profile(user_id: str, db: Session = Depends(models.get_db)):
    user = _.get_user_by_id(user_id=user_id, db=db)
    followers_count = _.get_user_followers_count(db=db, user_id=user_id)
    following_count = _.get_user_following_count(db=db, user_id=user_id)
    return {
        "profile_picture": user.profile_picture,
        "username": user.username,
        "bio": user.bio,
        "followers_count": followers_count,
        "following_count": following_count,
        "posts": user.posts
    }
