from sqlalchemy.orm import Session
from fastapi import HTTPException

from uuid import UUID, uuid4
import schemas
import models


def add_comment_to_post(db: Session, post_id: UUID, comment: schemas.CommentBlueprint, user_id: UUID) -> schemas.Comment:
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = models.Comment(id=str(uuid4()), post_id=post.id, user_id=user_id, content=comment.content)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


def delete_comment(db: Session, comment_id: UUID, user_id: UUID):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if str(comment.user_id) != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}


def update_comment(db: Session, comment_id: UUID, comment_data: schemas.CommentUpdate, user_id: UUID) -> schemas.Comment:
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if str(comment.user_id) != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to update this comment")

    comment.content = comment_data.content if comment_data.content else comment.content
    db.commit()
    db.refresh(comment)
    return comment


def get_comments_for_post(db: Session, post_id: UUID) -> list[schemas.Comment]:
    return db.query(models.Comment).filter(models.Comment.post_id == post_id).all()


def get_comment(db: Session, comment_id: UUID) -> schemas.Comment:
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    return comment


def count_comments_for_post(db: Session, post_id: UUID) -> int:
    return db.query(models.Comment).filter(models.Comment.post_id == post_id).count()
