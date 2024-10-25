import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  TruckIcon, CalendarIcon, CreditCardIcon, FileTextIcon, 
  ChevronLeftIcon, ChevronRightIcon, SearchIcon,
  PackageIcon, MapPinIcon, PhoneIcon, FilterIcon
} from 'lucide-react';
import { useOrderlistingQuery, useMarkorderdeliverMutation } from "../../store/slice/Brokerslice";
import { toast } from 'react-toastify';
import { Order } from "../../interfacetypes/type";
import debounce from 'lodash.debounce';

interface DashboardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: string;
}

interface BadgeProps extends DashboardProps {
  variant?: 'success' | 'warning' | 'info' | 'default'; // Define the valid variants
}

// Custom Card Component
const Card: React.FC<DashboardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

// Custom Badge Component
const Badge: React.FC<BadgeProps> = ({ children, variant = "default" }) => {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Define the type for the OrderCard props
interface OrderCardProps {
  order: Order;
  index: number;
  onDelivered: (orderId: string) => void; // Define the type of onDelivered function
}

const OrderCard: React.FC<OrderCardProps> = ({ order, index, onDelivered }) => {
  const statusVariant: { [key: string]: 'success' | 'warning' | 'info' | 'default' } = {
    Delivered: "success",
    Pending: "warning",
    default: "info"
  };

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <PackageIcon className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="text-xs font-medium text-gray-500">Order #{index + 1}</p>
            <h3 className="text-lg font-bold text-gray-900">{order.company}</h3>
          </div>
        </div>
        <Badge variant={statusVariant[order.status] as 'success' | 'warning' | 'info' | 'default'}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{order.address}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{new Date(order.expectedat).toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <CreditCardIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{order.paymentmethod}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <PhoneIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{order.mobile}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-lg font-bold text-indigo-600">
          ₹{order.price.toLocaleString('en-IN', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
        </div>
        {order.status.toLowerCase() === "delivered" ? (
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center space-x-2 cursor-not-allowed" disabled>
            <FileTextIcon className="w-4 h-4" />
            <span>Delivered</span>
          </button>
        ) : (
          <button 
            onClick={() => onDelivered(order._id)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <TruckIcon className="w-4 h-4" />
            <span>Mark as Delivered</span>
          </button>
        )}
      </div>
    </Card>
  );
};

const OrderListCards = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [updated] = useMarkorderdeliverMutation();
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const ordersPerPage = 6;

  const {
    data: orderResponse,
    error: userError,
    isLoading: userLoading,
    refetch,
  } = useOrderlistingQuery();

  useEffect(() => {
    refetch();
  }, [updateTrigger, refetch]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleDelivered = async (orderId: string) => {
    try {
      const result = await updated(orderId).unwrap();
      if (result.success) {
        toast.success("Order marked as delivered successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setUpdateTrigger(prev => prev + 1);
      } else {
        toast.error("Failed to update status: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-500 text-xl font-semibold">Unable to load orders</div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  const orders = Array.isArray(orderResponse?.result?.orders) ? orderResponse.result.orders : [];

  const filteredOrders = orders.filter((order: Order) => 
    order.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    order.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    order.mobile.toString().includes(debouncedSearchTerm)
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order List</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentOrders.map((order: Order, index: number) => (
          <OrderCard key={order._id} order={order} index={index + indexOfFirstOrder} onDelivered={handleDelivered} />
        ))}
      </div>

      <div className="flex justify-between">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <div className="text-lg">
          Page {currentPage} of {totalPages}
        </div>
        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrderListCards;
