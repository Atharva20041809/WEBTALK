import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m.id}>
                        {(isSameSender(messages, m, i, user.id) ||
                            isLastMessage(messages, i, user.id)) && (
                                <div className="tooltip" data-tip={m.sender.username}>
                                    <img
                                        className="mt-2 mr-1 w-8 h-8 rounded-full object-cover cursor-pointer"
                                        src={m.sender.pic}
                                        alt={m.sender.username}
                                    />
                                </div>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender.id === user.id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                                marginTop: isSameUser(messages, m, i, user.id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
