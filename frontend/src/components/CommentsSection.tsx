import React, { useEffect, useState } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { addCommentToPost, getCommentsForPost } from '../APIServices/Post';
import { deleteComment, updateComment } from '../APIServices/Comment';
import { Comment } from '../type/Comment';

interface CommentsSectionProps {
    postId: string;
    current_user_id: string;
    onCommentAdded: (increment: boolean) => void;
    onCommentDeleted: (decrement: boolean) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, current_user_id, onCommentAdded, onCommentDeleted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');

    const [loading, setLoading] = useState(true);

    const handleTogglePanel = () => {
        setIsOpen(prev => !prev);
    };

    const fetchComments = async () => {
        setLoading(true);
        try {
            const commentsData = await getCommentsForPost(postId);
            setComments(commentsData);
        } catch (error) {
            console.error('Erreur lors de la récupération des commentaires:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                await addCommentToPost(postId, newComment);
                setNewComment('');
                fetchComments();
                onCommentAdded(true);
            } catch (error) {
                console.error("Erreur lors de l'ajout du commentaire:", error);
            }
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (editingCommentContent.trim()) {
            try {
                await updateComment(commentId, editingCommentContent);
                setEditingCommentId(null);
                setEditingCommentContent('');
                fetchComments();
            } catch (error) {
                console.error("Erreur lors de la mise à jour du commentaire:", error);
            }
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            fetchComments();
            onCommentDeleted(true);
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    return (
        <Panel
            header="View comments"
            toggleable
            collapsed={!isOpen}
            onToggle={handleTogglePanel}
        >
            {/* Affichage des commentaires */}
            <div className="mb-3">
                {loading ? (
                    <Skeleton width="10rem" height="4rem" borderRadius="16px" />
                ) : comments.length > 0 ? (
                    comments.map((comment: Comment) => (
                        <div key={comment.id} className="mb-2 p-2 rounded bg-light">
                            <div className="d-flex justify-content-between">
                                <p className="m-0 text-dark">@{comment.user.username}</p>
                            </div>
                            <p className="mt-1 ms-3 p-0 m-0 text-secondary font-light">{comment.content}</p>
                            {comment.user_id === current_user_id ? (
                                editingCommentId === comment.id ? (
                                    <div className="input-group mb-3 mt-2">
                                        <input
                                            value={editingCommentContent}
                                            onChange={(e) => setEditingCommentContent(e.target.value)}
                                            className="form-control bg-light"
                                            placeholder="Edit comment"
                                            type="text"
                                            required
                                        />
                                        <Button
                                            className="p-button-text"
                                            label="Save"
                                            onClick={() => handleEditComment(comment.id)}
                                        />
                                        <Button
                                            className="p-button-text"
                                            label="Cancel"
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setEditingCommentContent('');
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            className="p-button-text"
                                            label="Edit"
                                            icon="pi pi-pencil"
                                            onClick={() => {
                                                setEditingCommentId(comment.id);
                                                setEditingCommentContent(comment.content);
                                            }}
                                        />
                                        <Button
                                            style={{ color: 'red' }}
                                            className="p-button-text ms-2"
                                            label="Delete"
                                            icon="pi pi-trash"
                                            onClick={() => handleDeleteComment(comment.id)}
                                        />
                                    </div>
                                )
                            ) : null}
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No comments yet.</p>
                )}
            </div>

            {/* Champ d'ajout de commentaire */}
            <div className="input-group mb-3">
            <span className="input-group-text">
                <i className="bi bi-chat-dots"></i>
            </span>
                <input
                    className="form-control"
                    placeholder="Add new comment"
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                />
                <Button
                    label="Add"
                    icon="pi pi-send"
                    onClick={handleAddComment}
                    className="p-button-text"
                />
            </div>
        </Panel>
    );
};

export default CommentsSection;
