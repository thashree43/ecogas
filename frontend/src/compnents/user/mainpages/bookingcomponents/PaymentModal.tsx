import {PaymentModalProps,BookingDetailsProps} from "./type"
import { CardElement } from "@stripe/react-stripe-js";

  export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    bookingData,
    onProcessPayment,
    selectedGas,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1D2B6B]">
            Confirm Gas Booking
          </h2>
          <BookingDetails bookingData={bookingData} />
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
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 rounded-md text-gray-800 font-medium hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onProcessPayment}
              className="px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
            >
              Pay ₹{selectedGas?.price}
            </button>
          </div>
        </div>
      </div>
    );
  };
  export const BookingDetails: React.FC<BookingDetailsProps> = ({ bookingData }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Name:</span> {bookingData.customerDetails.name}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Consumer ID:</span>{" "}
          {bookingData.customerDetails.consumerId}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Mobile:</span>{" "}
          {bookingData.customerDetails.mobile}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Address:</span>{" "}
          {bookingData.customerDetails.address}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Gas Type:</span>{" "}
          {bookingData.selectedGas.companyname} ({bookingData.selectedGas.weight}kg)
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Price:</span> ₹{bookingData.selectedGas.price}
        </p>
      </div>
    </div>
  );