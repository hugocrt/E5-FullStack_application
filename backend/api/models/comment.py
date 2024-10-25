from .imports import *


class Comment(BaseSQL):
    __tablename__ = 'comments'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete="CASCADE"))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    content = Column(String)
    created_at = Column(DateTime, default=datetime.now())

    post = relationship("Post", back_populates="comments")

    user = relationship("User", back_populates="comments")
