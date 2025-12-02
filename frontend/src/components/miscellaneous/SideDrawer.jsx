import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const {
        user,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
    } = ChatState();
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

            const { data } = await axios.get(`http://localhost:3000/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Error Occured: " + error.message);
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
            const { data } = await axios.post(`http://localhost:3000/api/chat`, { userId }, config);

            if (!chats.find((c) => c.id === data.id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setIsSearchOpen(false);
        } catch (error) {
            alert("Error fetching the chat: " + error.message);
            setLoadingChat(false);
        }
    };

    return (
        <>
            <div className="header">
                <button className="btn" onClick={() => setIsSearchOpen(true)}>
                    <i className="fas fa-search"></i> Search User
                </button>

                <h2>WebTalk</h2>

                <div className="d-flex align-center gap-2">
                    <div className="notification-icon">
                        <i className="fas fa-bell"></i>
                        {notification.length > 0 && <span>{notification.length}</span>}
                    </div>
                    <ProfileModal user={user}>
                        <img src={user.pic} alt={user.username} className="avatar" style={{ cursor: "pointer" }} />
                    </ProfileModal>
                    <button className="btn" onClick={logoutHandler}>Logout</button>
                </div>
            </div>

            {isSearchOpen && (
                <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
                    <div className="modal-content" style={{ height: "100%", width: "300px", position: "absolute", left: 0, top: 0, borderRadius: 0 }} onClick={(e) => e.stopPropagation()}>
                        <h3>Search Users</h3>
                        <div className="d-flex gap-2 mb-2">
                            <input
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: "100%", padding: "8px" }}
                            />
                            <button onClick={handleSearch} className="btn btn-primary">Go</button>
                        </div>
                        <div style={{ overflowY: "auto", height: "calc(100% - 100px)" }}>
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                searchResult?.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => accessChat(user.id)}
                                        className="user-list-item"
                                    >
                                        <img
                                            src={user.pic}
                                            alt={user.username}
                                            className="avatar"
                                        />
                                        <div>
                                            <div>{user.username}</div>
                                            <small><b>Email : </b>{user.email}</small>
                                        </div>
                                    </div>
                                ))
                            )}
                            {loadingChat && <div>Loading chat...</div>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SideDrawer;
