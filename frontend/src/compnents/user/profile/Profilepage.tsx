import React, { useEffect, useState } from "react";
import {
  Book,
  Calendar,
  Wallet,
  Settings,
  LogOut,
  X,
  User,
  Phone,
  MapPin,
  Building,
  Trash2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import {
  useAddbookMutation,
  useGetbookQuery,
  useDeletebookMutation,
  useUserchatMutation,
  useSendmessageMutation,
  useGetmessagesQuery,
} from "../../../store/slice/Userapislice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import OrderListTable from "./Mybooking";
import socketIOClient from "socket.io-client";
import { useDispatch } from "react-redux";

interface ChatPageProps {
  onClose: () => void;
  chatId?: string;
}
const ChatPage: React.FC<ChatPageProps> = ({ onClose, chatId = "" }) => {
  const [userdata, setUserdata] = useState<{ username?: string; _id?: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
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

      console.log("Message sent:", response);

      if (response) {
        setMessages((prevMessages) => [...prevMessages, response]);
        socketio.emit("chat", response); // Emit new message for real-time
        setCurrentMessage(""); // Clear input
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const isSender = (message: any) => message.sender === userdata?._id;

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Customer Support</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
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
          </div>
        ) : (
          <p>No messages yet</p>
        )}

        <p className="text-sm">
          Welcome {userdata?.username ? userdata.username : "Guest"}! How can we
          help you today?
        </p>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
};

// LPG Animation component
const LPGAnimation = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100">
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="#f3f4f6"
      stroke="#d1d5db"
      strokeWidth="2"
    />
    <path d="M30 70 Q50 20 70 70" stroke="#4b5563" strokeWidth="4" fill="none">
      <animate
        attributeName="d"
        values="M30 70 Q50 20 70 70;M30 70 Q50 40 70 70;M30 70 Q50 20 70 70"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
    <rect x="40" y="70" width="20" height="10" fill="#4b5563" />
  </svg>
);

// Main ProfilePage component
const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("MY BOOK");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addbook] = useAddbookMutation();
  const [deletebook] = useDeletebookMutation();
  const [userchat] = useUserchatMutation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const userInfo = localStorage.getItem("userInfo") 
  ? JSON.parse(localStorage.getItem("userInfo") || "{}")
  : null; 
   const dispatch = useDispatch();
   const userId = userInfo.user._id ;
     const [chats, setChats] = useState<string>("");
  const [chatId, setChatId] = useState<string | null>(null);

  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useGetbookQuery(userId);

  const [formData, setFormData] = useState({
    name: "",
    consumerId: "",
    mobile: "",
    address: "",
    company: "",
    gender: "",
  });

  const navItems = [
    { icon: Book, text: "MY BOOK" },
    { icon: Calendar, text: "MY BOOKINGS" },
    { icon: Wallet, text: "MY WALLET" },
    { icon: Settings, text: "PROFILE SETTINGS" },
    { icon: LogOut, text: "LOG-OUT" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await addbook({ ...formData, userId }).unwrap();
      console.log("Add book response:", response);

      if (response.success) {
        toast.success("Book added successfully");
        refetch();
        setIsModalOpen(false);
        setFormData({
          name: "",
          consumerId: "",
          mobile: "",
          address: "",
          company: "",
          gender: "",
        });
      }
    } catch (error: any) {
      console.error("Error occurred while adding book:", error);
      if (error.status === 409) {
        toast.error("The book already exists");
      } else {
        toast.error("An error occurred while adding the book");
      }
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      const response = await deletebook(bookId).unwrap();
      console.log("Delete book response:", response);

      if (response.success) {
        toast.success("Book deleted successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error occurred while deleting book:", error);
      toast.error("An error occurred while deleting the book");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "MY BOOK":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Books</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : isError ? (
              <p>Error loading books</p>
            ) : userData && userData.book && userData.book.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.book.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative"
                  >
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      title="Delete book"
                    >
                      <Trash2 size={20} />
                    </button>
                    <h3 className="text-xl font-semibold mb-2">{book.name}</h3>
                    <div className="space-y-2">
                      <p className="flex items-center text-gray-600">
                        <User className="mr-2" size={16} />
                        Consumer ID: {book.consumerid}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Phone className="mr-2" size={16} />
                        {book.mobile}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <MapPin className="mr-2" size={16} />
                        {book.address}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Building className="mr-2" size={16} />
                        {book.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-4">No books found</p>
            )}
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              ADD BOOK
            </button>
          </div>
        );
      case "MY BOOKINGS":
        return (
          <>
            <h2 className="text-2xl font-bold">My Bookings</h2>
            <OrderListTable />
          </>
        );
      case "MY WALLET":
        return <h2 className="text-2xl font-bold">My Wallet</h2>;
      case "PROFILE SETTINGS":
        return <h2 className="text-2xl font-bold">Profile Settings</h2>;
      case "LOG-OUT":
        return <h2 className="text-2xl font-bold">Logging Out...</h2>;
      default:
        return null;    
    }
  };

  const handleChat = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      console.log(userInfo,"the user data while chat initializing ,");
      
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log(parsedUserInfo,"the userinfo while in the parseduserinfo stage ");
        
          const userId = parsedUserInfo.user._id;
          console.log("userId in profile", userId);
if (userId) {
  

          const res = await userchat(userId).unwrap();
          console.log("Chat initiated:", res); 

          if (res.success === true) {
            // Access the chatId directly from res.data.chatId
            setChatId(res.data.chatId);
            setChats(res.data.messages); // Assuming the messages are in res.data.messages
            setIsChatOpen(true);
            toast.success("Chat initialized successfully");
          } else {
            console.error("Chat ID not found in response");
            toast.error("Chat initialization failed.");
          }
        } else {
          console.error("User ID not found in localStorage");
          toast.error("Unable to start chat. User ID not found.");
        }
      } else {
        console.error("User info not found in localStorage");
        toast.error("Unable to start chat. User information not found.");
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
      toast.error("An error occurred while initializing chat.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="relative p-4">
          <Link
            to="/"
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full mb-4 relative overflow-hidden">
            <LPGAnimation />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2">
              {/* You can add an edit icon or other controls here */}
            </div>
          </div>
        </div>
        <nav>
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-2 ${
                activeSection === item.text
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection(item.text)}
            >
              <item.icon className="inline-block mr-2" />
              {item.text}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 overflow-auto">{renderContent()}</div>

      {/* Customer Experience Icon */}
      <button
        onClick={handleChat}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Page */}
      {/* Chat Page */}
      {isChatOpen && chatId && (
        <ChatPage onClose={() => setIsChatOpen(false)} chatId={chatId} />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Book</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "consumerId", "mobile", "address", "company"].map(
                (field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )
              )}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
