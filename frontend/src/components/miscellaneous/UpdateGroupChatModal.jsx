import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

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
                `http://localhost:3000/api/chat/groupremove`,
                {
                    chatId: selectedChat.id,
                    userId: user1.id,
                },
                config
            );

            user1.id === user.id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            alert("Error Occured: " + error.response.data.message);
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
                `http://localhost:3000/api/chat/groupadd`,
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
            alert("Error Occured: " + error.response.data.message);
            setLoading(false);
        }
    };

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
                `http://localhost:3000/api/chat/rename`,
                {
                    chatId: selectedChat.id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameloading(false);
        } catch (error) {
            alert("Error Occured: " + error.response.data.message);
            setRenameloading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:3000/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Failed to Load the Search Results");
            setLoading(false);
        }
    };

    return (
        <>
            <span onClick={() => setIsOpen(true)}>{children}</span>
            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-between align-center mb-2">
                            <h2>{selectedChat.chatName}</h2>
                            <button onClick={() => setIsOpen(false)} className="btn">X</button>
                        </div>

                        <div className="d-flex gap-2 mb-2" style={{ flexWrap: "wrap" }}>
                            {selectedChat.users.map((u) => (
                                <div
                                    key={u.user.id}
                                    style={{ background: "#38B2AC", color: "white", padding: "5px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px" }}
                                >
                                    {u.user.username}
                                    <span style={{ cursor: "pointer" }} onClick={() => handleRemove(u.user)}>x</span>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex gap-2 mb-2">
                            <input
                                placeholder="Chat Name"
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                style={{ width: "100%", padding: "8px" }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleRename}
                                disabled={renameloading}
                            >
                                Update
                            </button>
                        </div>

                        <div className="flex-column gap-2">
                            <input
                                placeholder="Add User to group"
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: "100%", padding: "8px" }}
                            />

                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleAddUser(user)}
                                        className="user-list-item"
                                    >
                                        <img
                                            src={user.pic}
                                            alt={user.username}
                                            className="avatar"
                                        />
                                        <div>
                                            <div>{user.username}</div>
                                            <small>{user.email}</small>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => handleRemove(user)}
                            className="btn btn-danger w-100"
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
