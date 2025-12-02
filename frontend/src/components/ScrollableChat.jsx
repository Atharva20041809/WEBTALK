import React from "react";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {messages &&
                messages.map((m, i) => (
                    <div
                        key={m.id}
                        style={{
                            display: "flex",
                            justifyContent: m.sender.id === user.id ? "flex-end" : "flex-start",
                            marginBottom: "8px",
                        }}
                    >
                        <div className={`message ${m.sender.id === user.id ? "sent" : "received"}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ScrollableChat;
