import React, { useState, useEffect, useRef } from "react";
import {  } from "../../store/slice/Adminslice"; // Update this import path
import socketIOClient from "socket.io-client";
import { toast } from "react-toastify";
import { Send } from "lucide-react";

interface ChatPageProps {
  chatId: string;
  onClose: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({  }) => {
  const [userdata, setUserdata] = useState<{ username?: string; _id?: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

//   const [sendmessages] = useSendmessageMutation();
//   const {
//     data: messagesData,
//     isLoading: messagesLoading,
//     isError: messagesError,
//   } = useGetmessagesQuery(chatId);

  const socketio = socketIOClient("http://localhost:3000");

  useEffect(() => {
    socketio.on("chat", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketio.off("chat");
    };
  }, []);

//   useEffect(() => {
//     if (messagesData) {
//       setMessages(messagesData);
//     }
//   }, [messagesData]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    // if (!currentMessage.trim()) return;

    // try {
    //   const response = await sendmessages({
    //     chatid: chatId,
    //     content: currentMessage,
    //   }).unwrap();

    //   if (response) {
    //     setMessages((prevMessages) => [...prevMessages, response]);
    //     socketio.emit("chat", response);
    //     setCurrentMessage("");
    //   }
    // } catch (error) {
    //   console.error("Error sending message:", error);
    //   toast.error("Failed to send message");
    // }
  };

  const isSender = (message: any) => message.sender === userdata?._id;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-auto">
        {/* {messagesLoading && <p>Loading messages...</p>}
        {messagesError && <p>Error loading messages</p>} */}

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
                  className={`inline-block px-3 py-2 rounded-lg ${
                    isSender(msg) ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                <small className="block text-gray-500 text-xs">
                  {new Date(msg.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;