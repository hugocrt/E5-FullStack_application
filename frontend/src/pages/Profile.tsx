import React, { useEffect, useState } from 'react';
import BaseModel from "../layout/BaseModel.tsx";
import { Button } from "primereact/button";
import { Post } from "../type/Post.ts";
import { User } from "../type/User.ts";
import { Skeleton } from "primereact/skeleton";
import { PostCard } from "../components/post.tsx";
import { Paginator } from "primereact/paginator";
import {
    getCurrentUser,
    getUserProfile,
    followUser,
    unfollowUser,
    Delete,
    getUserFollowers,
} from "../APIServices/User.ts";
import { updatePostById, deletePostById } from '../APIServices/Post.ts';
import { FileUpload } from 'primereact/fileupload';
import { useNavigate, useParams } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [skip, setSkip] = useState<number>(0);
    const [limit] = useState<number>(10);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [updatedPostData, setUpdatedPostData] = useState<{ title?: string; text?: string }>({});
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [image, setImage] = useState<string | undefined>();
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const user = userId ? await getUserProfile(userId) : await getCurrentUser();
            setUser(user);
            setProfilePicture(user?.profile_picture);
            setPosts(user?.posts);
            setTotalPosts(user?.posts.length);

            const user_followers = userId ? await getUserFollowers(userId) : null;
            const currentUsername = sessionStorage.getItem('username');

            if (currentUsername && user_followers) {
                const isFollowing = user_followers.some((follower: User) => follower.username === currentUsername);
                setIsFollowing(isFollowing);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(userId!);
            } else {
                await followUser(userId!);
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du suivi:', error);
        } finally {
            window.location.reload();
        }
    };

    const handleImageChange = (e: { files: File[] }) => {
        if (e.files && e.files.length > 0) {
            const file = e.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImage(base64String);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleUpdatePost = async (postId: string) => {
        try {
            await updatePostById(postId, updatedPostData.title, image, updatedPostData.text);
            setPosts(posts.map(post => (post.id === postId ? { ...post, ...updatedPostData } : post)));
            setSelectedPostId(null);
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du post:', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await deletePostById(postId);
                setPosts(posts.filter(post => post.id !== postId));
                setTotalPosts(totalPosts - 1);
            } catch (error) {
                console.error('Erreur lors de la suppression du post:', error);
            }
        }
    };

    const handleDeleteAccount = async () => {
        const userPassword = prompt("Please enter your password to confirm account deletion:");
        if (userPassword) {
            try {
                await Delete(userPassword);
                navigate('/');
            } catch (error) {
                console.error('Erreur lors de la suppression du compte:', error);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <BaseModel>
            <div className="container mt-5">
                <div className="d-flex flex-column">
                    <div className="align-self-end mb-2">
                        {!userId ? (
                            <Button
                                label="Delete account"
                                className="p-button p-button-danger"
                                onClick={handleDeleteAccount}
                            />
                        ) : (
                            <Button
                                label={isFollowing ? "Unfollow" : "Follow"}
                                className="p-button p-button-secondary"
                                onClick={handleFollowToggle}
                            />
                        )}
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <h3 className="font-weight-bolder text-primary mb-0">Overview</h3>
                </div>
                <hr />
                <div className="pt-2">
                    {loading ? (
                        <Skeleton width="100%" height="150px" />
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center me-3" style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ccc',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {profilePicture ? (
                                        <img
                                            src={profilePicture}
                                            alt="Profile picture"
                                            className="img-fluid rounded-circle"
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    ) : (
                                        <i className="bi bi-person" style={{ fontSize: '40px', color: '#fff' }}></i>
                                    )}
                                </div>
                                <div>
                                    <h5 className="text-primary">@{user?.username}</h5>
                                    <div className="text-secondary">
                                        <span className="me-3">{user?.followers_count} Followers</span>
                                        <span>{user?.following_count} Following</span>
                                    </div>
                                </div>
                                {!userId && (
                                    <Button className="p-button-text" onClick={() => navigate('/profile/me/edit')}>
                                        <i className="pi pi-user-edit" style={{ fontSize: '2rem' }}></i>
                                    </Button>
                                )}
                            </div>
                            <p className="mt-3">Biography: </p>
                            <p className="text-secondary">{user?.bio ? user.bio : "No bio available"}</p>
                        </>
                    )}
                    <hr />
                    <h4>Your Posts</h4>
                    {loading ? (
                        <div className="row">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="col-md-6 mb-4">
                                    <Skeleton width="100%" height="200px" borderRadius="8px" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="row">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <div key={post.id} className="col-md-6 mb-4">
                                        <div className="d-flex flex-column">
                                            {!userId && (
                                                <div className="align-self-end mb-2">
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedPostId(post.id);
                                                            setUpdatedPostData({ title: post.title, text: post.text });
                                                        }}
                                                        icon="pi pi-pencil"
                                                        className="p-button-text"
                                                    />
                                                    <Button
                                                        onClick={() => handleDeletePost(post.id)}
                                                        icon="pi pi-trash"
                                                        className="p-button-text"
                                                        style={{ color: 'red' }}
                                                    />
                                                </div>
                                            )}
                                            <PostCard post={post} />
                                            {selectedPostId === post.id && (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Title"
                                                        value={updatedPostData.title}
                                                        onChange={(e) => setUpdatedPostData({
                                                            ...updatedPostData,
                                                            title: e.target.value
                                                        })}
                                                        className="form-control mb-2"
                                                    />
                                                    <textarea
                                                        placeholder="Text"
                                                        value={updatedPostData.text}
                                                        onChange={(e) => setUpdatedPostData({
                                                            ...updatedPostData,
                                                            text: e.target.value
                                                        })}
                                                        className="form-control mb-2"
                                                    />
                                                    <FileUpload
                                                        name="post_image"
                                                        accept="image/*"
                                                        maxFileSize={1000000} // 1 MB
                                                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                                                        onSelect={handleImageChange}
                                                    />
                                                    <Button onClick={() => handleUpdatePost(post.id)} label="Update" className="p-button" />
                                                    <Button onClick={() => setSelectedPostId(null)} label="Cancel" className="p-button-text" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">You don't have any posts.</p>
                            )}
                        </div>
                    )}
                    <Paginator
                        first={skip}
                        rows={limit}
                        totalRecords={totalPosts}
                        onPageChange={(e) => setSkip(e.first)}
                        className="mt-4"
                    />
                </div>
            </div>
        </BaseModel>
    );
};

export default ProfilePage;
