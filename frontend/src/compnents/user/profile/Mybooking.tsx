import React, { useState } from 'react';
import { useGetordersQuery } from "../../../store/slice/Userapislice";
import {  TruckIcon, CalendarIcon, CreditCardIcon, FileTextIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {Order} from "../../../interfacetypes/type"


const OrderCard: React.FC<{ order: Order; index: number }> = ({ order, index }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm font-semibold text-gray-500">Order #{index + 1}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-blue-100 text-blue-800'
      }`}>
        {order.status}
      </span>
    </div>
    <h3 className="text-lg font-semibold mb-2">{order.company}</h3>
    <div className="flex items-center mb-2">
      <TruckIcon className="w-4 h-4 mr-2 text-gray-500" />
      <span className="text-sm text-gray-600">{order.address}</span>
    </div>
    <div className="flex items-center mb-2">
      <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
      <span className="text-sm text-gray-600">{new Date(order.expectedat).toLocaleDateString()}</span>
    </div>
    <div className="flex items-center mb-4">
      <CreditCardIcon className="w-4 h-4 mr-2 text-gray-500" />
      <span className="text-sm text-gray-600">{order.paymentmethod}</span>
    </div>
    <div className="mt-auto">
      <div className="text-lg font-bold text-green-600 mb-2">₹.{order.price.toFixed(2)}/-</div>
      {order.status.toLowerCase() === "delivered" && (
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center">
          <FileTextIcon className="w-4 h-4 mr-2" />
          Invoice
        </button>
      )}
    </div>
  </div>
);

const OrderListCards: React.FC = () => {
  const userInfoString = localStorage.getItem("userInfo");
  let userId = '';
  
  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      userId = userInfo.user._id;
    } catch (error) {
      console.error("Error parsing user info from localStorage:", error);
    }
  }

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useGetordersQuery(userId);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  if (userLoading) {    
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (userError) {
    return <div className="text-center text-red-500 font-semibold">Error loading orders. Please try again later.</div>;
  }

  const orders = userData?.orders || [];
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOrders.map((order: Order, index: number) => (
              <OrderCard key={order._id} order={order} index={indexOfFirstOrder + index} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderListCards;