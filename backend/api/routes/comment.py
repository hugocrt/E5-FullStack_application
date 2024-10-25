from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from starlette.requests import Request


from models import get_db
import schemas
from services.auth import verify_autorization_header
from services import comment as comment_service

comment_router = APIRouter(prefix="/comments")

security = HTTPBearer()


@comment_router.delete("/{comment_id}", dependencies=[Depends(security)], tags=["comments"])
async def delete_comment(comment_id: str, request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_autorization_header(auth_header)
    user_id = token.get("user_id")
    return comment_service.delete_comment(db=db, comment_id=comment_id, user_id=user_id)


@comment_router.put("/{comment_id}", dependencies=[Depends(security)], tags=["comments"])
async def update_comment(comment_id: str, request: Request, comment_update: schemas.CommentUpdate, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = verify_autorization_header(auth_header)
    user_id = token.get("user_id")
    return comment_service.update_comment(db=db, comment_id=comment_id, comment_data=comment_update, user_id=user_id)


@comment_router.get("/{comment_id}", tags=["comments"])
async def get_comment(comment_id: str, db: Session = Depends(get_db)):
    return comment_service.get_comment(db=db, comment_id=comment_id)
