import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            alert("Please fill all the feilds");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `http://localhost:3000/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u.id)),
                },
                config
            );
            setChats([data, ...chats]);
            setIsOpen(false);
            alert("New Group Chat Created!");
        } catch (error) {
            alert("Failed to Create the Chat");
        }
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            alert("User already added");
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel.id !== delUser.id));
    };

    return (
        <>
            <span onClick={() => setIsOpen(true)}>{children}</span>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light text-gray-800">Create Group Chat</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <input
                                placeholder="Chat Name"
                                className="input-field mb-1"
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                className="input-field mb-1"
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                            <div className="flex flex-wrap gap-2">
                                {selectedUsers.map((u) => (
                                    <div
                                        key={u.id}
                                        className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded-full text-sm"
                                    >
                                        {u.username}
                                        <i
                                            className="fas fa-times cursor-pointer hover:text-red-200"
                                            onClick={() => handleDelete(u)}
                                        ></i>
                                    </div>
                                ))}
                            </div>

                            {loading ? (
                                <div className="text-center py-2">Loading...</div>
                            ) : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleGroup(user)}
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
                            onClick={handleSubmit}
                            className="btn btn-primary mt-6 w-full"
                        >
                            Create Chat
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default GroupChatModal;
