import React, { useEffect, useState } from "react";
import { Send, X, ImageIcon } from "lucide-react"; // Added ImageIcon for image uploads
import {
  useSendmessageMutation,
  useGetmessagesQuery,
} from "../../../store/slice/Userapislice";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Message } from "../../../interfacetypes/type";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  chatId?: string;
}

const ENDPOINTS = "http://localhost:3000";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, chatId }) => {
  const [userdata, setUserdata] = useState<{
    username?: string;
    _id?: string;
  } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [image, setImage] = useState<File | null>(null); // State to store selected image
  const [socketconnected, setSocketconnected] = useState(false);
  const [sendmessages] = useSendmessageMutation();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = useGetmessagesQuery(chatId || "");

  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINTS);
    }

    if (userdata && userdata._id) {
      socket.emit("setup", userdata._id);

      socket.off("message recieved");
      socket.on("message recieved", (newMessageReceived: Message) => {
        if (chatId === newMessageReceived.chat?.[0]) {
          setMessages((prevMessages) => {
            const exists = prevMessages.some(
              (msg) => msg._id === newMessageReceived._id
            );
            if (!exists) {
              return [...prevMessages, newMessageReceived];
            }
            return prevMessages;
          });
        }
      });

      socket.off("connected");
      socket.on("connected", () => {
        setSocketconnected(true);
      });
    }

    return () => {
      socket.off("message recieved");
      socket.off("connected");
    };
  }, [chatId, userdata]);

  useEffect(() => {
    if (chatId && socket) {
      socket.emit("join chat", { _id: chatId });
    }
  }, [chatId]);

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
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  useEffect(() => {
    if (chatId) {
      refetchMessages();
    }
  }, [chatId, refetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!currentMessage.trim() && !image) || !userdata?._id || !chatId) return;

    try {
      const newMessage: any = {
        content: currentMessage,
        sender: [userdata._id],
        createdAt: new Date().toISOString(),
      };

      if (image) {
        // If image is selected, convert it to base64 or upload it to a server and get the URL
        const imageUrl = URL.createObjectURL(image); // Example: replace this with your image upload logic
        newMessage.image = imageUrl; // Add image URL to message
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await sendmessages({
        chatid: chatId,
        content: currentMessage,
        image: image ? newMessage.image : null, // Send image with message if it exists
      }).unwrap();

      if (response) {
        socket.emit("new message", response.data);
        setCurrentMessage("");
        setImage(null); // Clear the selected image after sending
        refetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const isSender = (message: any) => {
    return message?.sender?.[0] === userdata?._id;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-[24rem] h-[30rem] bg-white rounded-lg shadow-lg flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Customer Support</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <p className="text-sm mb-4">
          Welcome {userdata?.username ? userdata.username : "Guest"}! How can we
          help you today?
        </p>

        {messagesLoading && <p>Loading messages...</p>}
        {messagesError && <p>Error loading messages</p>}

        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg, index) =>
              msg && msg.content ? (
                <ChatMessage
                  key={index}
                  message={msg.content}
                  image={msg.image} // Add image property to ChatMessage component
                  isUser={isSender(msg)}
                />
              ) : null
            )}
          </div>
        ) : (
          <p className="text-gray-500">No messages yet</p>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // Image selection handler
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <ImageIcon size={20} />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

const ChatMessage: React.FC<{ message: string; image?: string; isUser: boolean }> = ({
  message,
  image, // Added image prop
  isUser,
}) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] px-4 py-2 rounded-lg ${
        isUser
          ? "bg-blue-500 text-white rounded-br-none"
          : "bg-gray-200 text-black rounded-bl-none"
      }`}
    >
      {image && <img src={image} alt="chat image" className="mb-2" />} {/* Display image if present */}
      {message}
    </div>
  </div>
);

export default ChatWidget;
