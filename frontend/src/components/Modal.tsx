import React from 'react';

// --- React Concept: Props ---
// Props (short for properties) are how you pass data from a parent component
// to a child component. Our Modal needs to know if it should be open (`isOpen`),
// a function to call when it should close (`onClose`), and what content to show (`children`).
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) {
        return null; // If the modal isn't open, don't render anything.
    }

    return (
        // This is the Bootstrap HTML structure for a modal
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* The form or other content will be rendered here */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;