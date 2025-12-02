import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal"; // Need to create this

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
        <div
            className={`${selectedChat ? "hidden md:flex" : "flex"
                } flex-col items-center p-3 bg-white w-full md:w-[31%] rounded-lg border border-gray-200 h-full`}
        >
            <div className="pb-3 px-3 text-2xl md:text-xl lg:text-2xl font-light flex w-full justify-between items-center text-gray-800">
                My Chats
                <GroupChatModal>
                    <button className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors">
                        <i className="fas fa-plus"></i>
                        New Group Chat
                    </button>
                </GroupChatModal>
            </div>
            <div className="flex flex-col p-3 bg-gray-50 w-full h-full rounded-lg overflow-y-hidden">
                {chats ? (
                    <div className="overflow-y-scroll flex flex-col gap-2 h-full">
                        {chats.map((chat) => (
                            <div
                                onClick={() => setSelectedChat(chat)}
                                className={`cursor-pointer px-4 py-3 rounded-lg transition-all ${selectedChat === chat
                                        ? "bg-teal-500 text-white shadow-md"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                                key={chat.id}
                            >
                                <p className="font-medium">
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </p>
                                {chat.latestMessage && (
                                    <p className="text-xs mt-1 opacity-80 truncate">
                                        <b>{chat.latestMessage.sender.username} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        Loading Chats...
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChats;
