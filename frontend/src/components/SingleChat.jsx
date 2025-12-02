import { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"; // Need to create this
import ScrollableChat from "./ScrollableChat"; // Need to create this
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json"; // Need to add this animation file

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

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

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
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
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
                    <div className="text-xl md:text-2xl pb-3 px-2 w-full font-light flex justify-between items-center text-gray-800 border-b border-gray-200">
                        <button
                            className="md:hidden flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                            onClick={() => setSelectedChat("")}
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </ProfileModal>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                >
                                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </UpdateGroupChatModal>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col justify-end p-3 bg-gray-50 w-full h-full rounded-lg overflow-y-hidden mt-2 relative">
                        {loading ? (
                            <div className="self-center m-auto w-20 h-20 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
                        ) : (
                            <div className="flex flex-col overflow-y-scroll scrollbar-hide">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <div className="mt-3" onKeyDown={sendMessage}>
                            {isTyping ? (
                                <div className="mb-2 ml-2">
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <input
                                className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                placeholder="Enter a message.."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-3xl pb-3 font-light text-gray-400">
                        Click on a user to start chatting
                    </p>
                </div>
            )}
        </>
    );
};

export default SingleChat;
