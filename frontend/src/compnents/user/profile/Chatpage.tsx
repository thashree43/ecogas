import React, { useEffect, useState } from "react";
import {
  useSendmessageMutation,
  useGetmessagesQuery,
} from "../../../store/slice/Userapislice";
import { toast } from "react-toastify";
import socketIOClient from "socket.io-client";
import { X } from "lucide-react";

// ChatPage component
interface ChatPageProps {
  onClose: () => void;
  chatId?: string;
  chats?: any[];
}
const ChatPage: React.FC<ChatPageProps> = ({ onClose, chatId = "",chats=[] }) => {
  const [userdata, setUserdata] = useState<{ username?: string; _id?: string } | null>(null);
  const [messages, setMessages] = useState<any[]>(chats);
  const [currentMessage, setCurrentMessage] = useState("");

  const [sendmessages] = useSendmessageMutation();
  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useGetmessagesQuery(chatId);

  // Socket.io client initialization
  const socketio = socketIOClient("http://localhost:3000");

  useEffect(() => {
    socketio.on("chat", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketio.off("chat");
    };
  }, []);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData); // Assuming messagesData is an array of messages
    }
  }, [messagesData]);

  // Load user data from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserdata(parsedUserInfo.user);
      } catch (error) {
        console.error("Failed to parse userInfo from localStorage:", error);
      }
    }
  }, []);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    try {
      const response = await sendmessages({
        chatid: chatId,
        content: currentMessage,
      }).unwrap();

      if (response) {
        setMessages((prevMessages) => [...prevMessages, response]);
        socketio.emit("chat", response); 
        setCurrentMessage(""); }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const isSender = (message: any) => message.sender === userdata?._id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Customer Support</h2>

        <div className="flex-1 overflow-auto p-4 border border-gray-300 rounded-lg h-80">
          {messagesLoading && <p>Loading messages...</p>}
          {messagesError && <p>Error loading messages</p>}

          {messages.length > 0 ? (
            <div>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    isSender(msg) ? "text-right" : "text-left"
                  } mb-2`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      isSender(msg)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  <small className="block text-gray-500 text-xs">
                    {new Date(msg.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No messages yet</p>
          )}

          <p className="text-sm mt-4">
            Welcome {userdata?.username ? userdata.username : "Guest"}! How can we
            help you today?
          </p>
        </div>

        <div className="mt-4">
          <div className="flex">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
