from typing import List
from uuid import uuid4

from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
import models, schemas


def get_all_posts(db: Session, skip: int = 0, limit: int = 10) -> List[models.Post]:
    records = db.query(models.Post).filter().all()
    for record in records:
        record.id = str(record.id)
    return records


def get_post_by_id(post_id: str, db: Session) -> models.Post:
    record = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Post Not Found")
    return record


def get_posts_for_user(db: Session, user_id: str) -> List[models.Post]:
    return db.query(models.Post).filter(models.Post.owner_id == user_id).all()


def update_post(post_id: str, db: Session, post: schemas.PostUpdate) -> models.Post:
    db_post = get_post_by_id(post_id=post_id, db=db)
    for var, value in vars(post).items():
        setattr(db_post, var, value) if value else None
    db_post.updated_at = datetime.now()
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_post(post_id: str, db: Session) -> models.Post:
    db_post = get_post_by_id(post_id=post_id, db=db)
    db.delete(db_post)
    db.commit()
    return db_post


def delete_all_posts(db: Session) -> List[models.Post]:
    records = db.query(models.Post).filter()
    for record in records:
        db.delete(record)
    db.commit()
    return records


def create_post(db: Session, post: schemas.PostBlueprint, owner_id) -> models.Post:
    post_id = str(uuid4())
    record = db.query(models.Post).filter(models.Post.id == post_id).first()
    if record:
        raise HTTPException(status_code=409, detail="Already exists")

    db_post = models.Post(
        id=str(post_id),
        owner_id=owner_id,
        title=post.title,
        picture=post.picture,
        text=post.text
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)

    return db_post
