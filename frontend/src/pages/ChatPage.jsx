import { ChatState } from "../Context/ChatProvider";
import { useState } from "react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div className="w-full h-screen flex flex-col">
            {user && <SideDrawer />}
            <div className="flex justify-between w-full h-[91.5vh] p-2.5 gap-2.5">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </div>
        </div>
    );
};

export default ChatPage;
