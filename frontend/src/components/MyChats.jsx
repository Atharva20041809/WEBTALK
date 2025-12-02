import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/chat`, config);
            setChats(data);
        } catch (error) {
            alert("Failed to Load the chats");
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">My Chats</h2>
                <GroupChatModal>
                    <button className="btn btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}>
                        New Group +
                    </button>
                </GroupChatModal>
            </div>
            <div className="chat-list">
                {chats ? (
                    chats.map((chat) => (
                        <div
                            onClick={() => setSelectedChat(chat)}
                            className={`chat-item ${selectedChat?.id === chat.id ? "selected" : ""}`}
                            key={chat.id}
                        >
                            <div className="chat-item-info">
                                <div className="chat-item-details">
                                    <div className="chat-item-name">
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </div>
                                    {chat.messages && chat.messages.length > 0 && (
                                        <div className="chat-item-message">
                                            <strong>{chat.messages[0].sender.username}: </strong>
                                            {chat.messages[0].content.length > 50
                                                ? chat.messages[0].content.substring(0, 51) + "..."
                                                : chat.messages[0].content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: "20px", textAlign: "center", color: "#65676b" }}>
                        Loading Chats...
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChats;
