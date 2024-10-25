from .imports import *


class Post(BaseSQL):
    __tablename__ = 'posts'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    title = Column(String)
    picture = Column(LargeBinary, nullable=True)
    text = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"))
    owner = relationship("User", back_populates="posts")

    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
