from .imports import *


class Comment(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    post_id: UUID
    user_id: UUID
    content: str
    created_at: Annotated[datetime, Field(default_factory=datetime.now)]

    class Config:
        from_attributes = True


class CommentBlueprint(BaseModel):
    content: str

    class Config:
        from_attributes = True


class CommentUpdate(BaseModel):
    content: Optional[str] = None

    class Config:
        orm_mode = True
