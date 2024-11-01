from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from starlette.requests import Request

from models import get_db
import schemas
from services.auth import verify_authorization_header
from services import post as posts_service, like as like_service, comment as comment_service

post_router = APIRouter(prefix="/posts")

security = HTTPBearer()


@post_router.post("/", dependencies=[Depends(security)], tags=["posts"])
async def create_post(request: Request, post: schemas.PostBlueprint, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_authorization_header(auth_header)
    user_id = token.get("user_id")
    return posts_service.create_post(post=post, db=db, owner_id=user_id)


@post_router.get("/", tags=["posts"])
async def get_posts(db: Session = Depends(get_db)):
    return posts_service.get_all_posts(db=db)


@post_router.get("/followed", dependencies=[Depends(security)], tags=["posts"])
def get_followed_posts(request: Request, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_authorization_header(auth_header)
    current_user_id = token.get("user_id")
    return posts_service.get_followed_posts(db=db, user_id=current_user_id, skip=skip, limit=limit)


@post_router.get("/{user_id}", tags=["posts"])
async def get_user_posts(user_id, db: Session = Depends(get_db)) -> List[schemas.Post]:
    return posts_service.get_posts_for_user(db=db, user_id=user_id)


@post_router.get("/{post_id}", tags=["posts"])
async def get_post_by_id(post_id: str, db: Session = Depends(get_db)):
    return posts_service.get_post_by_id(db=db, post_id=post_id)


@post_router.put("/{post_id}", dependencies=[Depends(security)], tags=["posts"])
async def update_post_by_id(post_id: str, request: Request, post_update: schemas.PostUpdate, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_authorization_header(auth_header)
    post = posts_service.get_post_by_id(db=db, post_id=post_id)
    if str(post.owner_id) != token.get("user_id"):
        raise HTTPException(status_code=403, detail=f"Forbidden")
    return posts_service.update_post(post_id=post_id, db=db, post=post_update)


@post_router.delete("/{post_id}", dependencies=[Depends(security)], tags=["posts"])
async def delete_post_by_id(post_id: str, request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_authorization_header(auth_header)
    post = posts_service.get_post_by_id(db=db, post_id=post_id)
    if str(post.owner_id) != token.get("user_id"):
        raise HTTPException(status_code=403, detail=f"Forbidden")
    return posts_service.delete_post(post_id=post_id, db=db)


####################### LIKES ############################
@post_router.post("/{post_id}/like", dependencies=[Depends(security)], tags=["like"])
async def like_post(post_id: str, request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_authorization_header(auth_header)
    user_id = token.get("user_id")

    return like_service.like_post(db=db, post_id=post_id, user_id=user_id)


@post_router.delete("/{post_id}/like", dependencies=[Depends(security)], tags=["like"])
async def unlike_post(post_id: str, request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_authorization_header(auth_header)
    user_id = token.get("user_id")

    return like_service.unlike_post(db=db, post_id=post_id, user_id=user_id)


@post_router.get("/{post_id}/likes/count", tags=["like"])
async def get_post_likes_count(post_id: str, db: Session = Depends(get_db)) -> int:
    return like_service.get_likes_count_for_post(db=db, post_id=post_id)


@post_router.get("/{post_id}/likes", tags=["like"])
async def get_post_likers(post_id: str, db: Session = Depends(get_db)):
    return like_service.get_likers_for_post(db=db, post_id=post_id)




####################### COMMENTS ############################


@post_router.post("/{post_id}/comments", dependencies=[Depends(security)], tags=["comments"])
async def add_comment_to_post(post_id: str, request: Request, comment: schemas.CommentBlueprint, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_authorization_header(auth_header)
    user_id = token.get("user_id")
    return comment_service.add_comment_to_post(db=db, post_id=post_id, comment=comment, user_id=user_id)


@post_router.get("/{post_id}/comments", tags=["comments"])
async def get_comments_for_post(post_id: str, db: Session = Depends(get_db)):
    return comment_service.get_comments_for_post(db=db, post_id=post_id)


@post_router.get("/{post_id}/comments/count", tags=["comments"])
async def count_comments_for_post(post_id: str, db: Session = Depends(get_db)) -> int:
    return comment_service.count_comments_for_post(db=db, post_id=post_id)
