import React, { useState, useEffect } from "react";
import { useGetcustomersQuery, useGetMessagesQuery, useSendMessageMutation } from "../../store/slice/Adminslice";
import { User, MessageCircle, Clock, ChevronRight, X, Send, Image as ImageIcon } from "lucide-react";
import { Chat, Message } from "../../interfacetypes/type";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface ChatPageProps {
  onClose: () => void;
  selectedChatId?: string;
}

interface MessageContentProps {
  message: Message & {
    chat?: {_id:string}[];
    image?: string | null;
  };
}

const ENDPOINTS = "http://localhost:3000";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const CustomerExperience: React.FC<ChatPageProps> = ({ }) => {
  const { data: chats, isLoading, isError, refetch: refetchChats } = useGetcustomersQuery();
  const [selectedChatId, setSelectedChatId] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [image, setImage] = useState<File | null>(null); 
  const [socketconnected, setSocketconnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();

  const { data: chatMessages, refetch: refetchMessages } = useGetMessagesQuery(
    selectedChatId?._id ?? "", 
    { skip: !selectedChatId }
  );

  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINTS);
    }

    if (selectedChatId && selectedChatId.admin[0]) {
      console.log("");
      
      socket.emit("setup", selectedChatId.admin[0]);
    }

    socket.off("message recieved");

    socket.on("message recieved", (newMessageReceived: Message & { chat?: string[] }) => {
      if (selectedChatId?._id === newMessageReceived.chat?.[0]) {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    socket.on("connected", () => {
      setSocketconnected(true);
    });

    return () => {
      socket.off("message recieved");
      socket.off("connected");
    };
  }, [selectedChatId]);

  useEffect(() => {
    if (selectedChatId) {
      socket.emit("join chat", { _id: selectedChatId?._id });
    }
  }, [selectedChatId, socketconnected]);

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  const handleCustomerClick = (chat: Chat) => {
    setSelectedChatId(chat);
    if (socket && chat.admin[0]) {
      socket.emit("setup", chat.admin[0]);
    }
  };

  const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
    const hasImage = message.image && message.image.length > 0;
    
    return (
      <div className="max-w-xs md:max-w-md">
        {message.content && (
          <div className="mb-2">{message.content}</div>
        )}
        {hasImage && (
          <div className="mt-2">
            <img 
              src={message.image}
              alt="Message attachment" 
              className="rounded-lg max-h-48 object-contain"
              onClick={() => message.image && window.open(message.image, '_blank')}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )}
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (!selectedChatId?._id || (!newMessage.trim() && !image)) {
      console.log("No content to send");
      return;
    }

    const formData = new FormData();
    formData.append("chatId", selectedChatId._id);
    
    if (newMessage.trim()) {
      formData.append("content", newMessage.trim());
    }
    
    if (image) {
      formData.append("image", image);
    }

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      console.log("No admin token found");
      return;
    }

    try {
      // Create temporary message for optimistic update
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        content: newMessage.trim(),
        image: image ? URL.createObjectURL(image) : null,
        chat: [selectedChatId._id],
        sender: [{ _id: selectedChatId?.admin[0] }],
        createdAt: new Date(),
      };

      // Add temporary message to UI
      setMessages(prev => [...prev, tempMessage]);

      // Clear input fields
      setNewMessage('');
      setImage(null);

      // Send actual message
      const result = await sendMessage({
        formData,
        adminToken
      }).unwrap();

      // Emit socket event with the new message
      socket.emit("new message", result);

      // Refetch messages to ensure consistency
      refetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temporary message if sending failed
      setMessages(prev => prev.filter(msg => msg._id !== `temp-${Date.now()}`));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and GIF files are allowed");
      return;
    }

    setImage(file);
  };

  const handleCloseChat = () => {
    setSelectedChatId(null);
    setMessages([]);
    refetchChats();
  };

  const isSender = (message: Message) => {
    console.log("the id may be this  for message.sender",message.sender[0]?._id);  
    console.log("the id may for the admin in the chat ",selectedChatId?.admin[0]);
    
    return typeof message.sender === 'object' && 
           Array.isArray(message.sender) && 
           message.sender[0]?._id === selectedChatId?.admin[0];
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error loading customer messages</div>;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Customer Experience
      </h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {chats &&
          chats.map((chat: Chat, index: number) => (
            <div
              key={chat._id}
              onClick={() => handleCustomerClick(chat)}
              className={`flex items-center justify-between p-6 cursor-pointer transition-colors duration-150 ease-in-out hover:bg-gray-50 ${
                index !== chats.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {chat.chatname}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <User size={16} className="mr-2" />
                  <span className="text-sm">
                    {chat.user.map((user) => user.username).join(", ")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageCircle size={16} className="mr-2" />
                  <p className="text-sm truncate w-64">
                    {chat.latestmessage?.length
                      ? chat.latestmessage[chat.latestmessage.length - 1]?.content
                      : "No messages yet"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end ml-4">
                <div className="flex items-center text-gray-500 text-xs mb-2">
                  <Clock size={14} className="mr-1" />
                  <span>{chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : "No date available"}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          ))}
      </div>

      {selectedChatId && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Customer Support</h2>
          <button onClick={handleCloseChat} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 ${isSender(message) ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  isSender(message) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <MessageContent message={message} image={message.image ?? null} />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex flex-col">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg p-2 mx-2">
              <ImageIcon size={20} />
            </label>
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send size={20} />
            </button>
          </div>
    
          {/* Image preview section */}
          {image && (
            <div className="mt-2 flex items-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="w-12 h-12 rounded-md object-cover" // Smaller image preview
              />
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => setImage(null)} // Clear image on button click
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    

      )}
      
    </div>
  );
};

export default CustomerExperience;