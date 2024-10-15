import React, { useState, useEffect } from "react";
import { useGetcustomersQuery, useGetMessagesQuery, useSendMessageMutation } from "../../store/slice/Adminslice";
import { User, MessageCircle, Clock, ChevronRight, X, Send } from "lucide-react";

interface Message {
  _id: string;
  content: string;
  sender: string;
  createdAt: Date;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Chat {
  _id: string;
  chatname: string;
  user: User[];
  latestmessage: Message[];
  updatedAt: string;
}

const CustomerExperience: React.FC = () => {
  const { data: chats, isLoading, isError } = useGetcustomersQuery();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const { data: chatMessages, refetch: refetchMessages } = useGetMessagesQuery(selectedChatId, {
    skip: !selectedChatId,
  });

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  const getAdminToken = () => {
    return localStorage.getItem('adminToken');
  };

  const handleCustomerClick = (chatId: string) => {
    setSelectedChatId(chatId);
    refetchMessages();
  };

  const handleCloseChat = () => {
    setSelectedChatId(null);
    setMessages([]);
  };

  
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChatId) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        try {
          const result = await sendMessage({
            chatId: selectedChatId,
            content: newMessage,
            adminToken
          }).unwrap();
          console.log('Message sent successfully:', result);
          setNewMessage("");
          refetchMessages();
        } catch (error) {
          console.error("Error sending message:", error);
          // Add user-friendly error handling here
        }
      } else {
        console.error('Admin token not found');
        // Add user-friendly error handling here
      }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error loading customer messages</div>;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Experience</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {chats && chats.map((chat: Chat, index: number) => (
          <div 
            key={chat._id}
            onClick={() => handleCustomerClick(chat._id)}
            className={`flex items-center justify-between p-6 cursor-pointer transition-colors duration-150 ease-in-out hover:bg-gray-50 ${
              index !== chats.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{chat.chatname}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <User size={16} className="mr-2" />
                <span className="text-sm">{chat.user.map(user => user.username).join(', ')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MessageCircle size={16} className="mr-2" />
                <p className="text-sm truncate w-64">
                  {chat.latestmessage[chat.latestmessage.length - 1]?.content || 'No messages yet'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end ml-4">
              <div className="flex items-center text-gray-500 text-xs mb-2">
                <Clock size={14} className="mr-1" />
                <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
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
                <div key={message._id} className={`mb-4 ${message.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.sender === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerExperience;