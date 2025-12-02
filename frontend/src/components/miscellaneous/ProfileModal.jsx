import React, { useState } from "react";

const ProfileModal = ({ user, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            <span onClick={() => setIsOpen(true)}>{children}</span>
            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{user.username}</h2>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <img
                                src={user.pic}
                                alt={user.username}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    margin: "20px auto",
                                    display: "block"
                                }}
                            />
                            <p style={{ fontSize: "16px", color: "#65676b" }}>
                                <strong>Email:</strong> {user.email}
                            </p>
                        </div>
                        <button
                            className="btn btn-secondary btn-block"
                            onClick={() => setIsOpen(false)}
                            style={{ marginTop: "20px" }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileModal;
