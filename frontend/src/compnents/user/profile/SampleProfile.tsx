import React, { useState } from "react";
import {
  MessageCircle,
  User,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Star,
  Book,
  MapPin,
  Zap,
  X,
  Send,
} from "lucide-react";
import BookingList from "./Bookingcard";
import GasBookList from "./Gasbooklist";
import ChatWidget from "./Chatcomponent";
import {
  useAddbookMutation,
  useGetbookQuery,
  useDeletebookMutation,
  useUserchatMutation,
} from "../../../store/slice/Userapislice";
import { toast } from "react-toastify";
import { Books, GasBookListProps } from "../../../interfacetypes/type";
import { MenuItemProps } from "../../../interfacetypes/type";
import { useDispatch } from "react-redux";

// Interfaces
interface FormData {
  name: string;
  consumerId: number;
  mobile: number;
  address: string;
  company: string;
  gender: string;
}

interface FormField {
  name: keyof FormData;
  label: string;
}

interface Avatar {
  name: string;
}

const Avatar: React.FC<Avatar> = ({ name }) => {
  const getInitials = (name: string) => {
    const splitName = name.split(" ");
    const initials = splitName.map((part) => part[0].toUpperCase()).join("");
    return initials;
  };

  return (
    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
      {getInitials(name)}
    </div>
  );
};

// Main Component
const BookingProfilePage = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chats, setChats] = useState<string>("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [userchat] = useUserchatMutation();
  const [formData, setFormData] = useState({
    name: "",
    consumerId: "",
    mobile: "",
    address: "",
    company: "",
    gender: "",
  });

  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") || "{}")
    : null;
  const userId = userInfo?.user?._id;

  const [addbook] = useAddbookMutation();
  const [deletebook] = useDeletebookMutation();
  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useGetbookQuery(userId);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addbook(formData).unwrap();
      toast.success("Book added successfully");
      setIsModalOpen(false);
      refetch();
      setFormData({
        name: "",
        consumerId: "",
        mobile: "",
        address: "",
        company: "",
        gender: "",
      });
    } catch (error) {
      toast.error("Failed to add book");
    }
  };
  const fields: FormField[] = [
    { name: "name", label: "Name" },
    { name: "consumerId", label: "Consumer ID" },
    { name: "mobile", label: "Mobile" },
    { name: "address", label: "Address" },
    { name: "company", label: "Company" },
  ];
  const handleDelete = async (bookId: string) => {
    try {
      await deletebook(bookId).unwrap();
      toast.success("Book deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const MenuItem: React.FC<MenuItemProps> = ({
    Icon,
    label,
    active,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingList />;
      case "gasbook":
        return (
          <GasBookList
            books={userData?.book || []}
            isLoading={isLoading}
            isError={isError}
            handleDelete={handleDelete}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case "payment":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
            <p className="text-gray-600">Manage your payment methods here</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleChat = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      console.log(userInfo, "the user data while chat initializing ,");

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log(
          parsedUserInfo,
          "the userinfo while in the parseduserinfo stage "
        );

        const userId = parsedUserInfo.user._id;
        console.log("userId in profile", userId);
        if (userId) {
          const res = await userchat(userId).unwrap();
          console.log("Chat initiated:", res);

          if (res.success === true) {
            setChatId(res.data.chatId);
            setChats(res.data.messages);
            setIsChatOpen(true);
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
    <div className="min-h-screen bg-gray-100 relative">
      <div className="max-w-7xl mx-auto p-4">
        <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">ECOGAS</h1>
          <button
            className={`p-2 rounded-full transition-colors ${
              isChatOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
            }`}
            // onClick={() => setIsChatOpen(!isChatOpen)}
            onClick={handleChat}
            aria-label="Toggle chat"
          >
            <MessageCircle size={24} />
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                  <User size={40} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">
                  {userInfo?.user?.username}
                </h2>
                <p className="text-gray-600">{userInfo?.user?.email}</p>
              </div>
            </div>

            <nav className="bg-white rounded-lg shadow-sm p-2">
              <MenuItem
                Icon={Calendar}
                label="My Bookings"
                active={activeTab === "bookings"}
                onClick={() => setActiveTab("bookings")}
              />
              <MenuItem
                Icon={Book}
                label="Gas Book"
                active={activeTab === "gasbook"}
                onClick={() => setActiveTab("gasbook")}
              />
              <MenuItem
                Icon={CreditCard}
                label="Payment Methods"
                active={activeTab === "payment"}
                onClick={() => setActiveTab("payment")}
              />
              <MenuItem
                Icon={Settings}
                label="Settings"
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
              />
              <MenuItem
                Icon={LogOut}
                label="Logout"
                onClick={() => {}}
                active={undefined}
              />
            </nav>
          </aside>

          <main className="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </main>
          {isChatOpen && chatId && (
        <ChatWidget 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          chatId={chatId}
        />
      )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Gas Book</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Add Book
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingProfilePage;
