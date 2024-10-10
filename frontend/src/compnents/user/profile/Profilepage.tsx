import React, { useState } from "react";
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
} from "lucide-react";
import { useAddbookMutation, useGetbookQuery, useDeletebookMutation } from "../../../store/slice/Userapislice";
import { toast } from "react-toastify";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderListTable from "./Mybooking";




const LPGAnimation = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
    <path d="M30 70 Q50 20 70 70" stroke="#4b5563" strokeWidth="4" fill="none">
      <animate attributeName="d" 
               values="M30 70 Q50 20 70 70;M30 70 Q50 40 70 70;M30 70 Q50 20 70 70" 
               dur="2s" 
               repeatCount="indefinite" />
    </path>
    <rect x="40" y="70" width="20" height="10" fill="#4b5563" />
  </svg>
);

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("MY BOOK");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addbook] = useAddbookMutation();
  const [deletebook] = useDeletebookMutation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  console.log(userInfo,"the userInfo");
  
  const userId = userInfo.user._id;
  console.log(userId,"the userid in getboook request");
  
  
  const { data: userData, isLoading, isError ,refetch} = useGetbookQuery(userId);

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
                  <div key={book._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative">
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
      <div className="relative p-4">
      <Link to="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-800">
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