import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { getUserById, getCurrentUserId } from '../APIServices/User';
import {
    getPostLikesCount,
    countCommentsForPost,
    getPostLikers,
    likePost,
    unlikePost,
} from '../APIServices/Post';
import CommentsSection from './CommentsSection';
import { Post } from "../type/Post";
import { User } from "../type/User";

interface PostCardProps {
    post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [user, setUser] = useState<User | null>(null);
    const [likesCount, setLikesCount] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [currentUserId, setCurrentUserId] = useState('');
    const [loading, setLoading] = useState(true);

    const updateCommentsCount = (action: "increment" | "decrement") => {
        setCommentsCount(prevCount => {
            return action === "increment" ? prevCount + 1 : Math.max(prevCount - 1, 0);
        });
    };

    const handleToggleLike = useCallback(async () => {
        try {
            if (isLiked) {
                await unlikePost(post.id);
                setIsLiked(false);
                setLikesCount(prevCount => Math.max(prevCount - 1, 0));
            } else {
                await likePost(post.id);
                setIsLiked(true);
                setLikesCount(prevCount => prevCount + 1);
            }
        } catch (error) {
            console.error('Erreur lors du toggle de like:', error);
        }
    }, [isLiked, post.id]);

    useEffect(() => {
        const fetchUserAndCurrentUserId = async () => {
            setLoading(true);
            try {
                const [fetchedUser, userId] = await Promise.all([
                    getUserById(post.owner_id),
                    getCurrentUserId(),
                ]);
                setUser(fetchedUser);
                setCurrentUserId(userId);

                const count = await getPostLikesCount(post.id);
                setLikesCount(count);
                const commentCount = await countCommentsForPost(post.id);
                setCommentsCount(commentCount);

                const likersData = await getPostLikers(post.id);
                setIsLiked(likersData.some((liker: User) => liker.id === userId));
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCurrentUserId();
    }, [post.owner_id, post.id]);

    const formattedDate = new Date(post.created_at).toLocaleString();

    return (
        <div className="card">
            <div className="border-round border-1 surface-border p-4 surface-card">
                {loading ? (
                    <Skeleton width="100%" height="250px" />
                ) : (
                    <>
                        <div className="flex mb-3">
                            {user?.profile_picture ? (
                                <img
                                    src={user?.profile_picture}
                                    alt={user?.username || "User profile"}
                                    className="mr-4 border-circle"
                                    style={{ width: '4rem', height: '4rem' }}
                                />
                            ) : (
                                <div className="mr-4 border-circle" style={{ width: '4rem', height: '4rem', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <i className="pi pi-user" style={{fontSize: '2rem'}}></i>
                                </div>
                            )}
                            <div>
                                <h4 className="mb-2">@{user?.username}</h4>
                                <small className="mb-2 text-secondary font-italic font-light">{formattedDate} Local UTC</small>
                            </div>
                        </div>

                        <h5 className="text-center underline mt-2 mb-1 font-semibold">{post.title}</h5>

                        {post.picture ? (
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{width: '100%', height: '100%', overflow: 'hidden'}}
                            >
                                <img
                                    src={post.picture}
                                    alt="Post image"
                                    className="img-fluid"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'cover',  // Pour que l'image remplisse bien le conteneur sans déformation
                                    }}
                                />
                            </div>
                        ) : (
                            <div/>
                        )}

                        {post.text && (
                            <div className="pt-2 text-secondary">{post.text}</div>
                        )}

                        <div className="flex justify-content-between mt-3">
                            <div className="d-flex align-items-center" style={{gap: '1rem'}}>
                                <p className="mb-0 font-bold">{likesCount}</p>
                                <Button
                                    icon={isLiked ? "pi pi-heart-fill" : "pi pi-heart"}
                                    className="p-button-text"
                                    tooltip={isLiked ? "Unlike" : "Like"}
                                    aria-label={isLiked ? "Unlike" : "Like"}
                                    size="large"
                                    onClick={handleToggleLike}
                                    style={{ color: 'red'}}
                                />
                            </div>
                            <div className="d-flex align-items-center" style={{gap: '1rem'}}>
                                <p className="mb-0 font-bold">{commentsCount}</p>
                                <Button
                                    icon="pi pi-comment"
                                    className="p-button-text"
                                    tooltip="Comments Count"
                                    aria-label="Comments Count"
                                    size="large"
                                    style={{color: 'black'}}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <CommentsSection postId={post.id} current_user_id={currentUserId} onCommentAdded={() => updateCommentsCount("increment")} onCommentDeleted={() => updateCommentsCount("decrement")}/>
        </div>
    );
};
