from .imports import *
from .post import Post


class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)

    username: str
    password: str

    profile_picture: Optional[bytes]
    bio: Optional[str] = None
    posts: List['Post'] = []

    followers: List['User'] = []
    following: List['User'] = []

    liked_posts: List[UUID] = []

    created_at: Annotated[datetime, Field(default_factory=datetime.now)]
    updated_at: Annotated[datetime, Field(default_factory=datetime.now)]

    class Config:
        orm_mode = True


class UserCredentials(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[bytes] = None

    class Config:
        orm_mode = True
        