from .imports import *


class Like(BaseModel):
    id: UUID
    user_id: UUID
    post_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
