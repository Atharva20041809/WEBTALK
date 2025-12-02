import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

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

    const handleGroup = (userToAdd) => {
        if (selectedUsers.find((u) => u.id === userToAdd.id)) {
            alert("User already added");
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel.id !== delUser.id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length === 0) {
            alert("Please fill all the fields");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com"}/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u.id)),
                },
                config
            );
            setChats([data, ...chats]);
            setIsOpen(false);
            setGroupChatName("");
            setSelectedUsers([]);
            setSearch("");
            setSearchResult([]);
            alert("New Group Chat Created!");
        } catch (error) {
            alert("Failed to Create the Chat");
        }
    };

    return (
        <>
            <span onClick={() => setIsOpen(true)}>{children}</span>
            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Create Group Chat</h2>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>
                                &times;
                            </button>
                        </div>

                        <div className="input-group">
                            <label>Chat Name</label>
                            <input
                                type="text"
                                placeholder="Enter Group Name"
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Add Users</label>
                            <input
                                type="text"
                                placeholder="Search users"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="selected-users">
                                {selectedUsers.map((u) => (
                                    <div key={u.id} className="user-badge">
                                        {u.username}
                                        <span
                                            className="user-badge-remove"
                                            onClick={() => handleDelete(u)}
                                        >
                                            &times;
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "10px" }}>Loading...</div>
                            ) : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <div
                                        key={user.id}
                                        className="user-list-item"
                                        onClick={() => handleGroup(user)}
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
                            className="btn btn-primary btn-block"
                            onClick={handleSubmit}
                            style={{ marginTop: "20px" }}
                        >
                            Create Chat
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default GroupChatModal;
