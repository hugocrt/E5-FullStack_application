import React, { useRef, useState } from 'react';
import BaseModel from "../layout/BaseModel.tsx";
import { createPost } from '../APIServices/Post.ts';
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const toastRef = useRef<Toast>(null); // Référence pour le Toast


    const handleProfilePictureChange = (e: { files: File[] }) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log('create '+image)
            await createPost(title, image, desc);
            toastRef.current?.show({ severity: 'success', summary: 'Success', detail: 'Post created successfully!' });
            setTitle('');
            setDesc('');
            setImage('');
        } catch (e) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create post.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModel>
            <div className="container mt-5">
                <Toast ref={toastRef} />
                <h3 className="font-weight-bolder text-primary mb-4">Create Post</h3>
                <form onSubmit={handleSubmit} className="text-center">
                    <div>
                        <h4>Put a title</h4>
                        <div className="row mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input
                                    className="form-control"
                                    placeholder="Post title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h4>Put description (optional)</h4>
                        <InputTextarea
                            id="bio"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            className="w-100"
                        />
                    </div>

                    <div className="mb-3">
                        <h4>Put image (optional)</h4>
                        <FileUpload
                            name="post_image"
                            accept="image/*"
                            maxFileSize={1000000} // 1 MB
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                            onSelect={handleProfilePictureChange}
                        />
                    </div>

                    <Button type="submit" label={loading ? "Creating..." : "Create Post"} disabled={loading} className="w-50"/>
                </form>
            </div>
        </BaseModel>
    );
};

export default CreatePost;
