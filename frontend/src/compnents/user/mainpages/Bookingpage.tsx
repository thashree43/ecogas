import React, { useState, useEffect } from "react";
import {
  useGetProvidersQuery,
  useGetbookQuery,
  useOrderthegasMutation,
} from "../../../store/slice/Userapislice";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface GasProvider {
  _id: string;
  agentname: string;
  email: string;
  mobile: string;
  pincode: string;
  products: Array<{
    _id: string;
    companyname: string;
    weight: number;
    price: number;
    quantity: number;
  }>;
}

interface CustomerDetails {
  name: string;
  consumerId: string;
  mobile: string;
  address: string;
}
interface SuccessMessageProps {
  showSuccessMessage: boolean;
  setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>;
}
const GasBookingPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [pincode, setPincode] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<GasProvider | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    consumerId: "",
    mobile: "",
    address: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "cod">("UPI");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [selectedGas, setSelectedGas] = useState<{
    _id: string;
    companyname: string;
    weight: number;
    price: number;
  } | null>(null);

  const [isModal, setIsModal] = useState(false);
  const [datasbook, setDatasbook] = useState<any>();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve userId from localStorage when component mounts
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserId(parsedUserInfo._id);
      console.log("The userId from the booking page", parsedUserInfo._id);
    }
  }, []); 

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
  useEffect(() => {
    if (pincode.length === 6) {
      refetch();
    }
  }, [pincode, refetch]);

  useEffect(() => {
    if (userData) {
      const firstBook = userData.book[0]; // Assuming we use the first booking entry
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

  useEffect(() => {
    if (selectedProvider && selectedProvider.products.length > 0) {
      setSelectedGas(selectedProvider.products[0]);
    }
  }, [selectedProvider]);

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  };

  const handleProviderSelect = (provider: GasProvider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
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

  const handleCustomerDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      // Gather data to be sent
      const bookingData = {
        selectedProviderId: selectedProvider._id,
        customerDetails: {
          name: customerDetails.name,
          consumerId: customerDetails.consumerId,
          mobile: customerDetails.mobile,
          address: customerDetails.address,
        },
        paymentMethod,
        selectedGas: {
          _id: selectedGas._id,
          companyname: selectedGas.companyname,
          weight: selectedGas.weight,
          price: selectedGas.price,
        },
      };
      setDatasbook(bookingData);
      try {
        console.log(bookingData, "the bookdatas");
        if (paymentMethod === "cod") {
          const { data: orderResult, error: orderError } = await orderdata(bookingData);
          if (orderError) {
            toast.error("Failed to create order. Please try again.");
            return;
          }
          setShowSuccessMessage(true);
        } else {
        console.log(bookingData, "the bookdatas");
        setIsModal(true);
        }
        handleModalClose();
      } catch (error) {
        console.error("Booking failed:", error);
      }
    }
  };

  const PaymentModal = () => {
    if (!isModal) return null;

    const processPayment = async (
      event: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
      event.preventDefault();
      try {
        if (!stripe || !elements || !datasbook) {
          toast.error("Payment processing is not ready.");
          return;
        }
  
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          toast.error("Card information is not filled.");
          return;
        }
  
        const { data: orderResult, error: orderError } = await orderdata(datasbook);
        if (orderError) {
          toast.error("Failed to create order. Please try again.");
          return;
        }
  
        console.log(orderResult, "Order data results");
  
        const { clientSecret } = orderResult;
        console.log(clientSecret, "Client Secret");
        setIsModal(false);
        setShowSuccessMessage(true);
        // const result = await stripe.confirmCardPayment(clientSecret, {
        //   payment_method: {
        //     card: cardElement,
        //     billing_details: {
        //       name: customerDetails.name,
        //     },
        //   },
        // });
        // console.log("111111111111111111111111111",result)
        // if (result.error) {
        // console.log("2222222222222222222222222222")

        //   toast.error(result.error.message || "Payment failed");
        //   console.error("Payment failed:", result.error.message);
        // } else if (result.paymentIntent?.status === "succeeded") {
        // console.log("333333333333333333333333333333")

        //   console.log("Payment succeeded:", result.paymentIntent);
        //   toast.success("Payment successful!");
        //   setIsModalOpen(false);
        //   setIsModal(false);
        //   setShowSuccessMessage(true);
        // }
      } catch (error) {
        console.log("4444444444444444444444444444444")
        console.error("Error processing payment:", error);
        toast.error("An error occurred while processing your payment.");
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1D2B6B]">
            Confirm Gas Booking
          </h2>
          <div className="space-y-4 mb-6">
            <p className="text-lg">
              <span className="font-semibold">Name:</span>
              <strong>{datasbook.customerDetails.name}</strong>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Consumer ID:</span>
              <strong>{datasbook.customerDetails.consumerId}</strong>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Gas Type:</span>
              <strong>{datasbook.selectedGas.companyname}</strong>
              {selectedGas?.companyname}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Price:</span> ₹
              {datasbook.selectedGas.price}
              {selectedGas?.price}
            </p>
          </div>
          <div className="mb-6">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsModal(false)}
              className="px-6 py-3 bg-gray-200 rounded-md text-gray-800 font-medium hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={processPayment}
              className="px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
            >
              Pay ₹{selectedGas?.price}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const SuccessMessage: React.FC = () => {
    if (!showSuccessMessage) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-center text-green-600">🎉 Booking Successful! 🎉</h2>
          <p className="text-lg text-center mb-6">
            Your session has been booked successfully. We look forward to seeing you!
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Gas Booking
          </h1>

          <div className="mb-8">
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Pincode:
            </label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={handlePincodeChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              maxLength={6}
              placeholder="Enter 6-digit pincode"
            />
          </div>

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
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Gas Providers:
              </h2>
              <ul className="space-y-4">
                {providers.map((provider: GasProvider) => (
                  <li
                    key={provider._id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="provider"
                        value={provider._id}
                        checked={selectedProvider?._id === provider._id}
                        onChange={() => handleProviderSelect(provider)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <p className="text-lg font-medium text-gray-900">
                          {provider.agentname}
                        </p>
                        <p className="text-sm text-gray-500">
                          Pincode: {provider.pincode}
                        </p>
                        {provider.email && (
                          <p className="text-sm text-gray-500">
                            Email: {provider.email}
                          </p>
                        )}
                        {provider.mobile && (
                          <p className="text-sm text-gray-500">
                            Mobile: {provider.mobile}
                          </p>
                        )}
                        {provider.products && provider.products.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-700">
                              Products available:
                            </p>
                            <ul className="mt-1 space-y-1">
                              {provider.products
                                .filter((product) => product.quantity > 0)
                                .map((product) => (
                                  <li
                                    key={product._id}
                                    className="text-sm text-gray-600"
                                  >
                                    {product.companyname} - ₹{product.price} (
                                    {product.weight}kg) Quantity -{" "}
                                    {product.quantity}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Booking
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerDetails.name}
                  onChange={handleCustomerDetailsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="consumerId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Consumer ID
                </label>
                <input
                  type="text"
                  id="consumerId"
                  name="consumerId"
                  value={customerDetails.consumerId}
                  onChange={handleCustomerDetailsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={customerDetails.mobile}
                  onChange={handleCustomerDetailsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customerDetails.address}
                  onChange={handleCustomerDetailsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isLoadingAddress}
                />
                {isLoadingAddress && (
                  <div className="text-sm text-gray-500 mt-2">
                    Loading default address...
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="gasSelect"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Gas
                </label>
                <select
                  id="gasSelect"
                  value={selectedGas?._id || ""}
                  onChange={handleGasSelect}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {selectedProvider.products
                    .filter((product) => product.quantity > 0) // Filter out products with quantity less than or equal to 0
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.companyname} - ₹{product.price} (
                        {product.weight}kg)
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </p>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={handlePaymentMethodChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">UPI</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={handlePaymentMethodChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <PaymentModal />
      <SuccessMessage/>
    </div>
  );
};

export default GasBookingPage;
