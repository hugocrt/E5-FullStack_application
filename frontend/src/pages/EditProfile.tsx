import React, { useState } from 'react';
import BaseModel from "../layout/BaseModel.tsx";
import { updateUser } from '../APIServices/User.ts';
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";

const EditProfile: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const [bio, setBio] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleProfilePictureChange = (e: { files: File[] }) => {
        if (e.files && e.files.length > 0) {
            const file = e.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfilePicture(base64String);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser(username, password, bio, profilePicture);
            sessionStorage.setItem('username', username);
            window.location.reload();
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModel>
            <div className="container mt-5">
                <h3 className="font-weight-bolder text-primary mb-4">Edit Profile</h3>
                <form onSubmit={handleSubmit} className="text-center">
                    <div>
                        <h4>Change credentials (optional)</h4>
                        <div className="row mb-3">
                            <div className="col">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input
                                        className="form-control"
                                        placeholder="username (optional)"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        className="form-control"
                                        placeholder="password (optional)"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h4>Change biography (optional)</h4>
                        <InputTextarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-100"
                        />
                    </div>

                    <div className="mb-3">
                        <h4>Change profile picture (optional)</h4>
                        <FileUpload
                            name="post_image"
                            accept="image/*"
                            maxFileSize={1000000} // 1 MB
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                            onSelect={handleProfilePictureChange}
                        />
                    </div>

                    <Button type="submit" label={loading ? "Updating..." : "Update Profile"} disabled={loading} className="w-50"/>
                </form>
            </div>
        </BaseModel>
    );
};

export default EditProfile;
