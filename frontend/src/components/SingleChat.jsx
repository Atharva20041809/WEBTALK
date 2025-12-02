import React, { useState, useEffect, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const selectedChatCompare = useRef();

    const { user, selectedChat, setSelectedChat, notification, setNotification, chats, setChats } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com"}/api/message/${selectedChat.id}`,
                config
            );

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat.id);
        } catch (error) {
            alert("Failed to Load the Messages");
            setLoading(false);
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat.id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL || "https://webtalk-8ank.onrender.com"}/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat.id,
                    },
                    config
                );

                setNewMessage("");

                // Emit to socket AFTER saving to database
                socket.emit("new message", data);

                // Update local messages immediately
                setMessages((prevMessages) => [...prevMessages, data]);
            } catch (error) {
                alert("Failed to send the Message");
            }
        }
    };

    // Initialize socket connection
    useEffect(() => {
        socket = io(ENDPOINT, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.emit("setup", user);

        socket.on("connected", () => {
            setSocketConnected(true);
            console.log("Socket connected successfully");
        });

        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            setSocketConnected(false);
        });

        socket.on("reconnect", (attemptNumber) => {
            console.log("Socket reconnected after", attemptNumber, "attempts");
            socket.emit("setup", user);
        });

        return () => {
            socket.off("connected");
            socket.off("typing");
            socket.off("stop typing");
            socket.off("message received");
            socket.disconnect();
        };
    }, [user]);

    // Fetch messages when chat changes
    useEffect(() => {
        fetchMessages();
        selectedChatCompare.current = selectedChat;
    }, [selectedChat]);

    // Handle incoming messages
    useEffect(() => {
        const handleMessageReceived = (newMessageReceived) => {
            console.log("Message received:", newMessageReceived);

            if (
                !selectedChatCompare.current ||
                selectedChatCompare.current.id !== newMessageReceived.chat.id
            ) {
                // Message for different chat - add to notifications
                if (!notification.find(n => n.id === newMessageReceived.id)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                // Message for current chat - add to messages
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        };

        socket.on("message received", handleMessageReceived);

        return () => {
            socket.off("message received", handleMessageReceived);
        };
    }, [notification, fetchAgain]);

    // Handle removal events
    useEffect(() => {
        if (!socket) return;

        const handleRemovedFromGroup = (chatId) => {
            if (selectedChat && selectedChat.id === chatId) {
                setSelectedChat(null);
            }
            setChats(chats.filter((c) => c.id !== chatId));
        };

        const handleUserRemoved = ({ chatId, userId }) => {
            if (selectedChat && selectedChat.id === chatId) {
                const updatedUsers = selectedChat.users.filter((u) => u.user.id !== userId);
                setSelectedChat({ ...selectedChat, users: updatedUsers });
                setFetchAgain(!fetchAgain);
            }
        };

        socket.on("removed from group", handleRemovedFromGroup);
        socket.on("user removed", handleUserRemoved);

        return () => {
            socket.off("removed from group", handleRemovedFromGroup);
            socket.off("user removed", handleUserRemoved);
        };
    }, [socketConnected, selectedChat, chats, fetchAgain]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat.id);
        }

        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;

        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat.id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <div className="chat-header">
                        <div className="chat-name">
                            {!selectedChat.isGroupChat ? (
                                getSender(user, selectedChat.users)
                            ) : (
                                selectedChat.chatName.toUpperCase()
                            )}
                        </div>
                        <div>
                            {!selectedChat.isGroupChat ? (
                                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                                    <button className="btn btn-secondary">View Profile</button>
                                </ProfileModal>
                            ) : (
                                <UpdateGroupChatModal
                                    fetchMessages={fetchMessages}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    socket={socket}
                                >
                                    <button className="btn btn-secondary">Update Group</button>
                                </UpdateGroupChatModal>
                            )}
                        </div>
                    </div>

                    <div className="messages-container">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "50px", color: "#65676b" }}>
                                Loading Messages...
                            </div>
                        ) : (
                            <ScrollableChat messages={messages} />
                        )}
                    </div>

                    {isTyping && <div className="typing-indicator">Typing...</div>}

                    <div className="message-input-container">
                        <input
                            className="message-input"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={typingHandler}
                            onKeyDown={sendMessage}
                        />
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <h3>Click on a user to start chatting</h3>
                </div>
            )}
        </>
    );
};

export default SingleChat;
