from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import uuid4
from typing import List
import models, schemas


def get_liked_posts_for_user(db: Session, user_id: str) -> List[models.Post]:
    return db.query(models.Post).join(models.Like).filter(models.Like.user_id == user_id).all()


def like_post(db: Session, post_id: str, user_id: str):
    existing_like = db.query(models.Like).filter_by(post_id=post_id, user_id=user_id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Post already liked by this user")

    new_like = models.Like(id=str(uuid4()), post_id=post_id, user_id=user_id)
    db.add(new_like)
    db.commit()
    db.refresh(new_like)
    return new_like


def unlike_post(db: Session, post_id: str, user_id: str):
    like = db.query(models.Like).filter_by(post_id=post_id, user_id=user_id).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    db.delete(like)
    db.commit()
    return {"message": "Like removed"}


def get_likes_count_for_post(db: Session, post_id: str) -> int:
    return db.query(models.Like).filter(models.Like.post_id == post_id).count()


def get_likers_for_post(db: Session, post_id: str):
    return db.query(models.User).join(models.Like).filter(models.Like.post_id == post_id).all()
