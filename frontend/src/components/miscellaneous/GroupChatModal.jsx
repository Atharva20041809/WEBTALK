import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            alert("Please fill all the feilds");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `http://localhost:3000/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u.id)),
                },
                config
            );
            setChats([data, ...chats]);
            setIsOpen(false);
            alert("New Group Chat Created!");
        } catch (error) {
            alert("Failed to Create the Chat");
        }
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            alert("User already added");
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel.id !== delUser.id));
    };

    return (
        <>
            <span onClick={() => setIsOpen(true)}>{children}</span>
            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-between align-center mb-2">
                            <h2>Create Group Chat</h2>
                            <button onClick={() => setIsOpen(false)} className="btn">X</button>
                        </div>

                        <div className="flex-column gap-2">
                            <input
                                placeholder="Chat Name"
                                className="input-group"
                                onChange={(e) => setGroupChatName(e.target.value)}
                                style={{ width: "100%", padding: "10px" }}
                            />
                            <input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                className="input-group"
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: "100%", padding: "10px" }}
                            />

                            <div className="d-flex gap-2" style={{ flexWrap: "wrap" }}>
                                {selectedUsers.map((u) => (
                                    <div
                                        key={u.id}
                                        style={{ background: "#38B2AC", color: "white", padding: "5px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px" }}
                                    >
                                        {u.username}
                                        <span style={{ cursor: "pointer" }} onClick={() => handleDelete(u)}>x</span>
                                    </div>
                                ))}
                            </div>

                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleGroup(user)}
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
                            onClick={handleSubmit}
                            className="btn btn-primary w-100"
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
