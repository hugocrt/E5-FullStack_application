from .imports import *

followers_association = Table(
    'followers', BaseSQL.metadata,
    Column('follower_id', UUID(as_uuid=True), ForeignKey('users.id'), primary_key=True),
    Column('followed_id', UUID(as_uuid=True), ForeignKey('users.id'), primary_key=True)
)


class User(BaseSQL):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)

    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True)
    bio = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    followers = relationship(
        "User",
        secondary=followers_association,
        primaryjoin=id == followers_association.c.followed_id,
        secondaryjoin=id == followers_association.c.follower_id,
        back_populates="following"
    )

    following = relationship(
        "User",
        secondary=followers_association,
        primaryjoin=id == followers_association.c.follower_id,
        secondaryjoin=id == followers_association.c.followed_id,
        back_populates="followers"
    )

    posts = relationship("Post", back_populates="owner", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")