// BaseModel.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

const BaseModel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
return (
    <>
        <Navbar/>
        <div className="base-model d-flex flex-column min-vh-100">
            <main className="flex-fill">
                {children}
            </main>
        </div>
        <Footer/>
    </>
);
};

export default BaseModel;
