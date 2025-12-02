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

            const { data } = await axios.get("http://localhost:3000/api/chat", config);
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
            <div className="d-flex justify-between align-center p-2 mb-2">
                <h3>My Chats</h3>
                <GroupChatModal>
                    <button className="btn" style={{ fontSize: "12px", padding: "5px 10px" }}>
                        New Group Chat +
                    </button>
                </GroupChatModal>
            </div>
            <div className="d-flex flex-column gap-2" style={{ overflowY: "auto" }}>
                {chats ? (
                    chats.map((chat) => (
                        <div
                            onClick={() => setSelectedChat(chat)}
                            className={`user-list-item ${selectedChat === chat ? "selected-chat" : ""}`}
                            key={chat.id}
                        >
                            <div>
                                <div style={{ fontWeight: "bold" }}>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </div>
                                {chat.latestMessage && (
                                    <div style={{ fontSize: "12px", opacity: 0.8 }}>
                                        <b>{chat.latestMessage.sender.username} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>Loading Chats...</div>
                )}
            </div>
        </div>
    );
};

export default MyChats;
