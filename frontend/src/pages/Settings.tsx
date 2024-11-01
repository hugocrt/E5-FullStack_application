import React from 'react';
import BaseModel from "../layout/BaseModel.tsx";

const SettingsPage: React.FC = () => {
    return (
        <BaseModel>
            <div className="container mt-5">
                <h1 className="text-center display-4 font-weight-bolder text-secondary">
                   Settings
                </h1>
                <p className="text-center">
                    Here is some content specific to the home page.
                </p>
                <div className="d-flex justify-content-center">
                    <img
                        src="../../public/home-image.png"
                        alt="Home Image"
                        width="300"
                        height="200"
                    />
                </div>
            </div>
        </BaseModel>
    );
};

export default SettingsPage;