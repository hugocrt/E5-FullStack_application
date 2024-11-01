import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    onClose: () => void;
}

export const Alert: React.FC<Props> = ({ children, onClose }) => {
    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            { children }
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose}></button>
        </div>
    )
}