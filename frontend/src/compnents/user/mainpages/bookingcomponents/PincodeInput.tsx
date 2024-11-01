import {PincodeInputProps} from "./type"
 export const PincodeInput: React.FC<PincodeInputProps> = ({ pincode, onChange }) => (
    <div className="mb-8">
      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
        Enter Pincode:
      </label>
      <input
        type="text"
        id="pincode"
        value={pincode}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        maxLength={6}
        placeholder="Enter 6-digit pincode"
      />
    </div>
  );
