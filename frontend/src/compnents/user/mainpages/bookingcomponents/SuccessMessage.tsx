import {SuccessMessageProps} from "./type"
  
  export const SuccessMessage: React.FC<SuccessMessageProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-center text-green-600">
            🎉 Booking Successful! 🎉
          </h2>
          <p className="text-lg text-center mb-6">
            Your session has been booked successfully. We look forward to seeing you!
          </p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white rounded-md font-medium hover:from-[#2A3F7E] hover:to-[#0A102E] transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };