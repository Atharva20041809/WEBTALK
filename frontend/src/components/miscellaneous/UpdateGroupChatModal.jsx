import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin.id !== user.id && user1.id !== user.id) {
            alert("Only admins can remove someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:3000/api/chat/groupremove`,
                {
                    chatId: selectedChat.id,
                    userId: user1.id,
                },
                config
            );

            user1.id === user.id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            alert("Error Occured: " + error.response.data.message);
            setLoading(false);
        }
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u.user.id === user1.id)) {
            alert("User Already in group!");
            return;
        }

        if (selectedChat.groupAdmin.id !== user.id) {
            alert("Only admins can add someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:3000/api/chat/groupadd`,
                {
                    chatId: selectedChat.id,
                    userId: user1.id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            alert("Error Occured: " + error.response.data.message);
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:3000/api/chat/rename`,
                {
                    chatId: selectedChat.id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameloading(false);
        } catch (error) {
            alert("Error Occured: " + error.response.data.message);
            setRenameloading(false);
        }
        setGroupChatName("");
    };

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

    return (
        <>
            <span onClick={() => setIsOpen(true)}>{children}</span>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light text-gray-800">{selectedChat.chatName}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedChat.users.map((u) => (
                                <div
                                    key={u.user.id}
                                    className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded-full text-sm"
                                >
                                    {u.user.username}
                                    <i
                                        className="fas fa-times cursor-pointer hover:text-red-200"
                                        onClick={() => handleRemove(u.user)}
                                    ></i>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input
                                placeholder="Chat Name"
                                className="input-field mb-0"
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <button
                                className="btn btn-primary whitespace-nowrap"
                                onClick={handleRename}
                                disabled={renameloading}
                            >
                                {renameloading ? "Updating..." : "Update"}
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <input
                                placeholder="Add User to group"
                                className="input-field mb-1"
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                            {loading ? (
                                <div className="text-center py-2">Loading...</div>
                            ) : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleAddUser(user)}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <img
                                            src={user.pic}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => handleRemove(user)}
                            className="btn mt-6 w-full bg-red-500 text-white hover:bg-red-600"
                        >
                            Leave Group
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateGroupChatModal;
