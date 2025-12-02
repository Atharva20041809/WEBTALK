import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain, children, socket }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com"}/api/chat/rename`,
                {
                    chatId: selectedChat.id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameloading(false);
            setGroupChatName("");
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Failed to rename"));
            setRenameloading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com"}/api/user?search=${query}`,
                config
            );
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Failed to Load the Search Results");
            setLoading(false);
        }
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u.user.id === user1.id)) {
            alert("User Already in group!");
            return;
        }

        if (selectedChat.groupAdmin.id !== user.id) {
            alert("Only admins can add someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com"}/api/chat/groupadd`,
                {
                    chatId: selectedChat.id,
                    userId: user1.id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Failed to add user"));
            setLoading(false);
        }
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin.id !== user.id && user1.id !== user.id) {
            alert("Only admins can remove someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com"}/api/chat/groupremove`,
                {
                    chatId: selectedChat.id,
                    userId: user1.id,
                },
                config
            );

            if (socket) {
                socket.emit("kick user", { chatId: selectedChat.id, userId: user1.id });
            }

            user1.id === user.id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
            if (user1.id === user.id) {
                setIsOpen(false);
            }
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Failed to remove user"));
            setLoading(false);
        }
    };

    return (
        <>
            <span onClick={() => setIsOpen(true)}>{children}</span>
            {isOpen && selectedChat && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedChat.chatName}</h2>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>
                                &times;
                            </button>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <strong>Members:</strong>
                            <div className="selected-users" style={{ marginTop: "10px" }}>
                                {selectedChat.users.map((u) => (
                                    <div key={u.user.id} className="user-badge">
                                        {u.user.username}
                                        <span
                                            className="user-badge-remove"
                                            onClick={() => handleRemove(u.user)}
                                        >
                                            &times;
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Rename Group</label>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Enter new name"
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleRename}
                                    disabled={renameloading}
                                >
                                    {renameloading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Add User</label>
                            <input
                                type="text"
                                placeholder="Search users"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "10px" }}>Loading...</div>
                            ) : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <div
                                        key={user.id}
                                        className="user-list-item"
                                        onClick={() => handleAddUser(user)}
                                    >
                                        <img
                                            src={user.pic}
                                            alt={user.username}
                                            className="avatar"
                                        />
                                        <div>
                                            <div style={{ fontWeight: "500" }}>{user.username}</div>
                                            <div style={{ fontSize: "12px", color: "#65676b" }}>
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            className="btn btn-danger btn-block"
                            onClick={() => handleRemove(user)}
                            style={{ marginTop: "20px" }}
                        >
                            Leave Group
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateGroupChatModal;
