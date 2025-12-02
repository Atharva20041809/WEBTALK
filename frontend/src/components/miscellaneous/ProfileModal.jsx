import React, { useState } from "react";

const ProfileModal = ({ user, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <span onClick={openModal}>{children}</span>
            {isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content d-flex flex-column align-center" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex w-100 justify-between align-center">
                            <h2>{user.username}</h2>
                            <button className="btn" onClick={closeModal}>X</button>
                        </div>
                        <img
                            src={user.pic}
                            alt={user.username}
                            className="avatar"
                            style={{ width: "150px", height: "150px", margin: "20px 0" }}
                        />
                        <h3>Email: {user.email}</h3>
                        <button className="btn btn-primary" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileModal;
