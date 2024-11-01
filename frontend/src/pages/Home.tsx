import React, { useEffect, useState } from 'react';
import BaseModel from '../layout/BaseModel';
import { PostCard } from "../components/post";
import { getFollowedPosts } from '../APIServices/Post';
import { Post } from '../type/Post';
import { Button } from "primereact/button";
import { Skeleton } from 'primereact/skeleton';
import { Paginator } from 'primereact/paginator';

const Home: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [skip, setSkip] = useState<number>(0);
    const [limit] = useState<number>(10);

    const handlePostClick = (postId: string) => {
        setSelectedPostId(postId);
    };

    const fetchPosts = async (skip: number) => {
        setLoading(true);
        try {
            const [data, total] = await getFollowedPosts(skip, limit);
            setPosts(data);
            setTotalPosts(total);
        } catch (error) {
            console.error('Erreur lors de la récupération des posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(skip);
    }, [skip]);

    return (
        <BaseModel>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="font-weight-bolder text-primary mb-0">FOR YOU</h3>
                    <small className="text-muted font-light font-italic mb-0">(latest publications)</small>
                </div>

                <div className="pt-2">
                    {loading ? (
                        <div className="row">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="col-md-6 mb-4">
                                    <Skeleton width="100%" height="200px" borderRadius="8px" />
                                </div>
                            ))}
                        </div>
                    ) : selectedPostId ? (
                        posts
                            .filter(post => post.id === selectedPostId)
                            .map(post => (
                                <div key={post.id} className="mb-4 d-flex flex-column">
                                    <Button
                                        onClick={() => setSelectedPostId(null)}
                                        icon="pi pi-times"
                                        className="p-button-text mb-2 align-self-end"
                                        style={{color: 'red'}}
                                    />
                                    <PostCard post={post} />
                                </div>
                            ))
                    ) : (
                        <div className="row">
                            {posts.length > 0 ? (
                                <>
                                    {posts.map(post => (
                                        <div key={post.id} className="col-md-6 mb-4">
                                            <div className="d-flex flex-column">
                                                <Button
                                                    onClick={() => handlePostClick(post.id)}
                                                    icon="pi pi-eye"
                                                    className="p-button-text mb-2 align-self-end"
                                                    style={{color: 'black'}}
                                                />
                                                <PostCard post={post} />
                                            </div>
                                        </div>
                                    ))}
                                    <Paginator
                                        first={skip}
                                        rows={limit}
                                        totalRecords={totalPosts}
                                        onPageChange={(e) => setSkip(e.first)}
                                        className="mt-4"
                                    />
                                </>
                            ) : (
                                <p className="text-center">No posts available</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </BaseModel>
    );
};

export default Home;
