import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";

interface Message {
    from: string;
    text: string;
}

interface ChatProps {
    idInstance: string;
    apiTokenInstance: string;
}

export const Chat: React.FC<ChatProps> = ({ idInstance, apiTokenInstance }) => {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSendMessage = async () => {
        if (!phoneNumber || !message) return;
        try {
            const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");

            const data = {
                chatId: `${formattedPhoneNumber}@c.us`,
                message,
            }
            await useAxios().post(`/waInstance${idInstance}/SendMessage/${apiTokenInstance}`, data);
            setMessages([...messages, { from: "me", text: message }]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await useAxios().get( `/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`);
            if (response.data && response.data.body) {
                const { senderData, messageData } = response.data.body;
                if (senderData && messageData) {
                    setMessages((prev) => [
                        ...prev,
                        { from: senderData.senderName, text: messageData.textMessageData.text },
                    ]);
                }
                await useAxios().delete(`/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${response.data.receiptId}`);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [idInstance, apiTokenInstance]);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">WhatsApp Chat</h1>
            <input
                type="text"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <div className="border p-4 h-64 overflow-y-auto rounded bg-gray-100">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded mb-2 ${msg.from === "me" ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        <strong>{msg.from}: </strong>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 border rounded"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-green-500 cursor-pointer text-white py-2 px-4 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};