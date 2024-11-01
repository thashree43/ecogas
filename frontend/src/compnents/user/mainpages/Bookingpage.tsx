// GasBookingPage.tsx
import React, { useState, useEffect } from "react";
import { useGetProvidersQuery, useGetbookQuery, useOrderthegasMutation } from "../../../store/slice/Userapislice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import {
  PincodeInput,
  ProvidersList,
  BookingModal,
  PaymentModal,
  SuccessMessage,
} from "./bookingcomponents";
import { GasProvider, CustomerDetails, GasProduct } from "./bookingcomponents/type";
import { createPortal } from 'react-dom';


const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
           onClick={onClose}
           aria-hidden="true" />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
             onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

const GasBookingPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  // State management
  const [pincode, setPincode] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<GasProvider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    consumerId: "",
    mobile: "",
    address: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "cod">("UPI");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [selectedGas, setSelectedGas] = useState<GasProduct | null>(null);
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // API hooks
  const {
    data: providers,
    error: providersError,
    isLoading: providersLoading,
    refetch,
  } = useGetProvidersQuery(pincode, {
    skip: pincode.length !== 6,
  });

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useGetbookQuery(userId || "", {
    skip: !isModalOpen || !userId,
  });

  const [orderdata] = useOrderthegasMutation();

  // Effect hooks
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserId(parsedUserInfo.user._id);
    }
  }, []);

  useEffect(() => {
    if (pincode.length === 6) {
      refetch();
    }
  }, [pincode, refetch]);

  useEffect(() => {
    if (userData) {
      const firstBook = userData.book[0] || [];
      setCustomerDetails({
        name: firstBook.name,
        consumerId: firstBook.consumerid.toString(),
        mobile: firstBook.mobile.toString(),
        address: firstBook.address,
      });
    }
  }, [userData]);

  useEffect(() => {
    const loadDefaultAddress = async () => {
      setIsLoadingAddress(true);
      try {
        setCustomerDetails((prev) => ({ ...prev }));
      } catch (error) {
        console.error("Failed to fetch default address:", error);
      } finally {
        setIsLoadingAddress(false);
      }
    };

    if (isModalOpen && !userData) {
      loadDefaultAddress();
    }
  }, [isModalOpen, userData]);

  // Event handlers
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  };

  const handleProviderSelect = (provider: GasProvider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
    if (provider.products.length > 0) {
      setSelectedGas(provider.products[0]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
    setCustomerDetails({
      name: "",
      consumerId: "",
      mobile: "",
      address: "",
    });
    setPaymentMethod("UPI");
    setSelectedGas(null);
  };

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as "UPI" | "cod");
  };

  const handleGasSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = e.target.value;
    const selectedProduct = selectedProvider?.products.find(
      (product) => product._id === selectedProductId
    );
    if (selectedProduct) {
      setSelectedGas(selectedProduct);
    }
  };

  const handleBooking = async () => {
    if (selectedProvider && selectedGas) {
      const newBookingData = {
        selectedProviderId: selectedProvider._id,
        customerDetails,
        paymentMethod,
        selectedGas: {
          _id: selectedGas._id,
          companyname: selectedGas.companyname,
          weight: selectedGas.weight,
          price: selectedGas.price,
        },
      };
      setBookingData(newBookingData);

      try {
        if (paymentMethod === "cod") {
          const { data: orderResult, error: orderError } = await orderdata(newBookingData);
          if (orderError) {
            toast.error("Failed to create order. Please try again.");
            return;
          }
          setShowSuccessMessage(true);
        } else {
          setIsPaymentModal(true);
        }
        handleModalClose();
      } catch (error) {
        console.error("Booking failed:", error);
        toast.error("Booking failed. Please try again.");
      }
    }
  };

  const handleProcessPayment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      if (!stripe || !elements || !bookingData) {
        toast.error("Payment processing is not ready.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("Card information is not filled.");
        return;
      }

      const { data: orderResult, error: orderError } = await orderdata(bookingData);
      
      if (orderError) {
        toast.error("Failed to create order. Please try again.");
        return;
      }

      setIsPaymentModal(false);
      setShowSuccessMessage(true);

    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("An error occurred while processing your payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Gas Booking
          </h1>

          <PincodeInput 
            pincode={pincode} 
            onChange={handlePincodeChange} 
          />

          {providersLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {providersError && (
            <p className="text-red-500 text-center py-4">
              Failed to fetch gas providers. Please try again.
            </p>
          )}

          {providers && providers.length > 0 && (
            <ProvidersList
              providers={providers}
              selectedProvider={selectedProvider}
              onProviderSelect={handleProviderSelect}
            />
          )}
        </div>
      </div>

      {selectedProvider && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          customerDetails={customerDetails}
          onCustomerDetailsChange={handleCustomerDetailsChange}
          selectedProvider={selectedProvider}
          selectedGas={selectedGas}
          onGasSelect={handleGasSelect}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={handlePaymentMethodChange}
          onBookingConfirm={handleBooking}
          isLoadingAddress={isLoadingAddress}
        />
      )}

      <PaymentModal
        isOpen={isPaymentModal}
        onClose={() => setIsPaymentModal(false)}
        bookingData={bookingData}
        onProcessPayment={handleProcessPayment}
        selectedGas={selectedGas}
      />

      <SuccessMessage
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
      />
    </div>
  );
};

export default GasBookingPage;