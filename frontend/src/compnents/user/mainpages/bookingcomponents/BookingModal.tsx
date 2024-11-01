import { createPortal } from 'react-dom';
import {
  BookingModalProps,
  CustomerDetailsFormProps,
  PaymentMethodSelectorProps,
  GasSelectorProps
} from "./type";

// Base Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ 
  isOpen, 
  onClose, 
  children 
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Main Booking Modal
export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  customerDetails,
  onCustomerDetailsChange,
  selectedProvider,
  selectedGas,
  onGasSelect,
  paymentMethod,
  onPaymentMethodChange,
  onBookingConfirm,
  isLoadingAddress,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <CustomerDetailsForm
            customerDetails={customerDetails}
            onChange={onCustomerDetailsChange}
            isLoadingAddress={isLoadingAddress}
          />

          <GasSelector
            selectedGas={selectedGas}
            products={selectedProvider.products}
            onChange={onGasSelect}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onChange={onPaymentMethodChange}
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={onBookingConfirm}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Customer Details Form Component
export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customerDetails,
  onChange,
  isLoadingAddress,
}) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={customerDetails.name}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label htmlFor="consumerId" className="block text-sm font-medium text-gray-700">
        Consumer ID
      </label>
      <input
        type="text"
        id="consumerId"
        name="consumerId"
        value={customerDetails.consumerId}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
        Mobile
      </label>
      <input
        type="text"
        id="mobile"
        name="mobile"
        value={customerDetails.mobile}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
        Address
      </label>
      <input
        type="text"
        id="address"
        name="address"
        value={customerDetails.address}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        disabled={isLoadingAddress}
      />
      {isLoadingAddress && (
        <p className="text-sm text-gray-500 mt-2">Loading default address...</p>
      )}
    </div>
  </div>
);

// Payment Method Selector Component
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onChange,
}) => (
  <div>
    <p className="block text-sm font-medium text-gray-700 mb-3">
      Select Payment Method
    </p>
    <div className="space-y-3">
      <label className="flex items-center">
        <input
          type="radio"
          name="paymentMethod"
          value="UPI"
          checked={paymentMethod === "UPI"}
          onChange={onChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
        />
        <span className="ml-2 text-sm text-gray-700">UPI</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={onChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
        />
        <span className="ml-2 text-sm text-gray-700">Cash on Delivery</span>
      </label>
    </div>
  </div>
);

// Gas Selector Component
export const GasSelector: React.FC<GasSelectorProps> = ({
  selectedGas,
  products,
  onChange,
}) => (
  <div>
    <label htmlFor="gas" className="block text-sm font-medium text-gray-700">
      Select Gas Type
    </label>
    <select
      id="gas"
      value={selectedGas?._id || ""}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {products.map((product) => (
        <option key={product._id} value={product._id}>
          {product.companyname} - {product.weight}kg - ₹{product.price}
        </option>
      ))}
    </select>
  </div>
);