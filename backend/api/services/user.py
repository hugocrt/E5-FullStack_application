from typing import List, Tuple
from uuid import uuid4
from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED
import jwt
from jwt import InvalidTokenError

import models
from schemas import User, UserCredentials, UserUpdate, UserOut
from services.auth import JWT_SECRET_KEY, JWT_SECRET_ALGORITHM, hash_password, verify_password


def get_all_users(db: Session, skip: int = 0, limit: int = 10) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()


def get_user_by_id(user_id: str, db: Session) -> models.User:
    record = db.query(models.User).filter(models.User.id == user_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="User Not Found")
    return record


def get_user_profile(user_id: str, db: Session):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User Not Found")

    followers_count = get_user_followers_count(db, user_id=user.id)
    following_count = get_user_following_count(db, user_id=user.id)

    posts = db.query(models.Post).filter(models.Post.owner_id == user.id).all()

    return {
        "username": user.username,
        "bio": user.bio,
        "profile_picture": user.profile_picture,
        "posts": posts,
        "followers_count": followers_count,
        "following_count": following_count
    }


def create_user(db: Session, user: UserCredentials) -> models.User:
    record = db.query(models.User).filter(models.User.username == user.username).first()
    if record:
        raise HTTPException(status_code=409, detail="Username already taken")

    hashed_password = hash_password(user.password)

    db_user = models.User(
        id=str(uuid4()),
        username=user.username,
        password=hashed_password,
    )
    db.add(db_user)
    db.commit()

    return db_user


def delete_own_account(db: Session, current_user_id: str, password: str) -> UserOut:
    user = db.query(models.User).filter(models.User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Incorrect password!")

    for post in user.posts:
        db.delete(post)
        db.commit()

    db.delete(user)
    db.commit()

    return user


def follow_user(db: Session, user_to_follow_id: str, current_user_id: str):
    user_to_follow = get_user_by_id(user_id=user_to_follow_id, db=db)
    current_user = get_user_by_id(user_id=current_user_id, db=db)

    if user_to_follow in current_user.following:
        raise HTTPException(status_code=400, detail="You already follow this user")

    current_user.following.append(user_to_follow)
    db.commit()
    return {"message": f"User {user_to_follow.username} followed successfully"}


def unfollow_user(db: Session, user_to_unfollow_id: str, current_user_id: str):
    user_to_unfollow = get_user_by_id(user_id=user_to_unfollow_id, db=db)
    current_user = get_user_by_id(user_id=current_user_id, db=db)

    if user_to_unfollow not in current_user.following:
        raise HTTPException(status_code=400, detail="You don't follow this user")

    current_user.following.remove(user_to_unfollow)
    db.commit()
    return {"message": f"User {user_to_unfollow.username} unfollowed successfully"}


def get_user_followers(db: Session, user_id: str, skip: int = 0, limit: int = 10) -> List[models.User]:
    return (
        db.query(models.User)
        .join(models.followers_association, models.followers_association.c.follower_id == models.User.id)  # Jointure avec la table d'association
        .filter(models.followers_association.c.followed_id == user_id)  # Filtre pour récupérer les followers d'un utilisateur
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_following(db: Session, user_id: str, skip: int = 0, limit: int = 10) -> List[models.User]:
    following_query = (
        db.query(models.User)
        .join(models.followers_association, models.followers_association.c.followed_id == models.User.id)  # Jointure avec la table d'association
        .filter(models.followers_association.c.follower_id == user_id)  # Filtre pour les utilisateurs suivis par l'utilisateur
        .offset(skip)
        .limit(limit)
    )

    return following_query.all()


def search(db: Session, query: str, skip: int, limit: int):
    try:
        users = db.query(models.User).filter(models.User.username.ilike(f'%{query}%')).offset(skip).limit(limit)

        if not users:
            raise HTTPException(status_code=404, detail="No users found")

        user_data = []
        for user in users:
            followers_count = get_user_followers_count(db, user_id=user.id)
            user_data.append({
                "id": user.id,
                "username": user.username,
                "profile_picture": user.profile_picture,
                "followers_count": followers_count
            })

        total_users = (
            db.query(models.User)
            .filter(models.User.username.ilike(f'%{query}%'))
            .count()
        )

        return user_data, total_users

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid query format")


def update_user(db: Session, user_id: str, user_update: UserUpdate):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.username:
        existing_user = db.query(models.User).filter(models.User.username == user_update.username).first()
        if existing_user:
            raise HTTPException(status_code=409, detail="Username already taken")
        user.username = user_update.username
    if user_update.password:
        user.password = hash_password(user_update.password)
    if user_update.bio:
        user.bio = user_update.bio
    if user_update.profile_picture:
        user.profile_picture = user_update.profile_picture

    db.commit()
    db.refresh(user)
    return user


def get_user_followers_count(db: Session, user_id: str):
    return db.query(models.followers_association).filter(
        models.followers_association.c.followed_id == user_id
    ).count()


def get_user_following_count(db: Session, user_id: str):
    return db.query(models.followers_association).filter(
        models.followers_association.c.follower_id == user_id
    ).count()

