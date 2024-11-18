import { useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import "./FlatformAIChatboxPage.css";

interface Message {
    user: string;
    text: string;
}

export function FlatformAIChatboxPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage: Message = { user: "User", text: input };
        setMessages([...messages, newMessage]);

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/engines/davinci-codex/completions",
                {
                    prompt: input,
                    max_tokens: 150,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            const botMessage: Message = {
                user: "Bot",
                text: response.data.choices[0].text.trim(),
            };
            setMessages([...messages, newMessage, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }

        setInput("");
    };

    return (
        <Layout>
            <div className="chatbox-container">
                Can't use because it's not free
                <div className="chatbox-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-chatbox ${msg.user === "User" ? "user-message" : "bot-message"}`}
                        >
                            <strong>{msg.user}: </strong>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    className="input-chatbox"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="button-chatbox" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </Layout>
    );
}
