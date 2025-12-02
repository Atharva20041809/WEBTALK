import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getSender } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal"; // Need to create this

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
            <div className="flex justify-between items-center bg-white w-full p-2.5 border-b-4 border-gray-100">
                <button
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsSearchOpen(true)}
                >
                    <i className="fas fa-search"></i>
                    <span className="hidden md:inline">Search User</span>
                </button>

                <h1 className="text-2xl font-light text-gray-800">WebTalk</h1>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        {/* Notification Logic Here */}
                        <i className="fas fa-bell text-xl text-gray-600 cursor-pointer"></i>
                        {notification.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {notification.length}
                            </span>
                        )}
                    </div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 cursor-pointer">
                            <img
                                src={user.pic}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <i className="fas fa-chevron-down text-xs text-gray-600"></i>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                            <ProfileModal user={user}>
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    My Profile
                                </button>
                            </ProfileModal>
                            <button
                                onClick={logoutHandler}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Drawer */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="w-80 bg-white shadow-xl h-full flex flex-col p-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Search Users</h2>
                            <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <input
                                placeholder="Search by name or email"
                                className="input-field mb-0"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button onClick={handleSearch} className="btn btn-primary">Go</button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-4">Loading...</div>
                            ) : (
                                searchResult?.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => accessChat(user.id)}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mb-2"
                                    >
                                        <img
                                            src={user.pic}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.username}</p>
                                            <p className="text-xs text-gray-500">
                                                <b>Email : </b>{user.email}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            {loadingChat && <div className="text-center py-4">Loading chat...</div>}
                        </div>
                    </div>
                    <div className="flex-1 bg-black/50" onClick={() => setIsSearchOpen(false)}></div>
                </div>
            )}
        </>
    );
};

export default SideDrawer;
