import { useState } from "react";

const ProfileModal = ({ user, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <span onClick={openModal}>{children}</span>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in flex flex-col items-center">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                        <h2 className="text-3xl font-light text-gray-800 mb-6">{user.username}</h2>
                        <img
                            src={user.pic}
                            alt={user.username}
                            className="w-36 h-36 rounded-full object-cover mb-6 border-4 border-gray-100"
                        />
                        <p className="text-xl text-gray-600 font-light">
                            Email: {user.email}
                        </p>
                        <button
                            onClick={closeModal}
                            className="btn btn-primary mt-8 px-8"
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
