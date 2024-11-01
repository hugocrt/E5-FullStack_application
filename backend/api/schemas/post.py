from .imports import *
from .comment import Comment


class Post(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    title: str
    picture: Optional[str]
    text: Optional[str] = None

    owner_id: UUID
    liked_by: List[UUID] = []
    comments: List['Comment'] = []

    created_at: Annotated[datetime, Field(default_factory=datetime.now)]
    updated_at: Annotated[datetime, Field(default_factory=datetime.now)]

    class Config:
        from_attributes = True


class PostBlueprint(BaseModel):
    title: str
    picture: Optional[str] = None
    text: Optional[str] = None

    class Config:
        from_attributes = True


class PostUpdate(BaseModel):
    title: Optional[str] = None
    picture: Optional[str] = None
    text: Optional[str] = None

    class Config:
        from_attributes = True
