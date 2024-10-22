import React, { useState } from 'react'; 
import { Trash2, User, Phone, MapPin, Building } from 'lucide-react';
import {Books,GasBookListProps} from "../../../interfacetypes/type"


const GasBookList: React.FC<GasBookListProps> = ({
  books,
  isLoading,
  isError,
  handleDelete,
  setIsModalOpen,
}) => {
    
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gas Book</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading books</p>
      ) : books && books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
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
        className="mt-6 px-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        ADD BOOK
      </button>
    </div>
  );
};

export default GasBookList;
