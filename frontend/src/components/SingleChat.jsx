import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notification, setNotification } =
        ChatState();

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
                `http://localhost:3000/api/message/${selectedChat.id}`,
                config
            );

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat.id);
        } catch (error) {
            alert("Failed to Load the Messages");
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
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:3000/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat.id,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                alert("Failed to send the Message");
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare.id !== newMessageRecieved.chat.id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat.id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
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
                    <div className="header" style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                        <button
                            className="btn"
                            style={{ display: "none" }} // Hidden on desktop, show on mobile via CSS media query if needed
                            onClick={() => setSelectedChat("")}
                        >
                            Back
                        </button>
                        {!selectedChat.isGroupChat ? (
                            <div className="d-flex justify-between w-100 align-center">
                                <h3>{getSender(user, selectedChat.users)}</h3>
                                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                                    <button className="btn"><i className="fas fa-eye"></i></button>
                                </ProfileModal>
                            </div>
                        ) : (
                            <div className="d-flex justify-between w-100 align-center">
                                <h3>{selectedChat.chatName.toUpperCase()}</h3>
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                >
                                    <button className="btn"><i className="fas fa-eye"></i></button>
                                </UpdateGroupChatModal>
                            </div>
                        )}
                    </div>
                    <div className="d-flex flex-column justify-between h-100 p-2" style={{ background: "#E8E8E8", borderRadius: "8px", overflow: "hidden" }}>
                        {loading ? (
                            <div className="align-center justify-center d-flex h-100">Loading...</div>
                        ) : (
                            <div className="messages" style={{ overflowY: "auto", flex: 1 }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <div onKeyDown={sendMessage} style={{ marginTop: "10px" }}>
                            {isTyping ? (
                                <div style={{ marginBottom: "5px", color: "gray" }}>Typing...</div>
                            ) : (
                                <></>
                            )}
                            <input
                                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                                placeholder="Enter a message.."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="d-flex align-center justify-center h-100">
                    <h2>Click on a user to start chatting</h2>
                </div>
            )}
        </>
    );
};

export default SingleChat;
