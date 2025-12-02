import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { user, setSelectedChat, chats, setChats } = ChatState();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            alert("Please enter something in search");
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
                `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/user?search=${search}`,
                config
            );

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Error: " + error.message);
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/chat`,
                { userId },
                config
            );

            if (!chats.find((c) => c.id === data.id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setIsSearchOpen(false);
        } catch (error) {
            alert("Error fetching the chat");
            setLoadingChat(false);
        }
    };

    return (
        <>
            <div className="header">
                <button className="btn btn-secondary" onClick={() => setIsSearchOpen(true)}>
                    Search User
                </button>
                <h1 className="header-title">WebTalk</h1>
                <div className="header-actions">
                    <ProfileModal user={user}>
                        <button className="btn btn-secondary">Profile</button>
                    </ProfileModal>
                    <button className="btn btn-danger" onClick={logoutHandler}>
                        Logout
                    </button>
                </div>
            </div>

            {isSearchOpen && (
                <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
                    <div
                        className="search-drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="search-drawer-header">
                            <h3>Search Users</h3>
                            <button className="close-btn" onClick={() => setIsSearchOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="search-input-container">
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Search by name or email"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                                />
                                <button className="btn btn-primary" onClick={handleSearch}>
                                    Go
                                </button>
                            </div>
                        </div>
                        <div className="search-results">
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
                            ) : (
                                searchResult?.map((user) => (
                                    <div
                                        key={user.id}
                                        className="user-list-item"
                                        onClick={() => accessChat(user.id)}
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
                            {loadingChat && (
                                <div style={{ textAlign: "center", padding: "10px" }}>Loading chat...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SideDrawer;
