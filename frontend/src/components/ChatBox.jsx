import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat"; // Need to create this

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <div
            className={`${selectedChat ? "flex" : "hidden"
                } md:flex items-center flex-col p-3 bg-white w-full md:w-[68%] rounded-lg border border-gray-200 h-full`}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default ChatBox;
