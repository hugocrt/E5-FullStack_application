from .imports import *


class Like(BaseSQL):
    __tablename__ = 'likes'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.now())

    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")
