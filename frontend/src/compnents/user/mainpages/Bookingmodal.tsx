// import React, { useState } from 'react';
// import {  Check } from 'lucide-react';

// const Bookingmodal: React.FC = () => {
//   const [gasProvider, setGasProvider] = useState('Indane');
//   const [bookingType, setBookingType] = useState('Mobile Number');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [savedAs, setSavedAs] = useState('');

//   return (
//     <div className="max-w-md mx-auto p-4 font-sans">
//       <div className="flex items-center mb-6">
//         <h1 className="text-xl font-bold">Enter Details</h1>
//       </div>

//       <div className="space-y-4">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Gas Provider</div>
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
//               <span>{gasProvider}</span>
//             </div>
//             <button className="text-blue-500">Change</button>
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Booking Type Value</div>
//           <div className="flex justify-between items-center">
//             <span>{bookingType}</span>
//             <button className="text-blue-500">Change</button>
//           </div>
//           <div className="text-xs text-gray-400 mt-1">
//             Click on change to book with consumer no. or LPG ID
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow">
//           <input
//             type="text"
//             placeholder="Enter Registered Mobile Num..."
//             className="w-full outline-none"
//             value={mobileNumber}
//             onChange={(e) => setMobileNumber(e.target.value)}
//           />
//           <div className="flex justify-between items-center mt-2">
//             <div className="text-xs text-gray-400">
//               Enter Mobile no. Registered with Indane or proceed with Consumer ID
//             </div>
//           </div>
//         </div>

//         <div>
//           <div className="text-sm mb-2">Save this bill as (Optional)</div>
//           <div className="flex space-x-2">
//             {['Home', 'Mom', 'Dad', 'Other'].map((option) => (
//               <button
//                 key={option}
//                 className={`px-4 py-2 rounded-full ${
//                   savedAs === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                 }`}
//                 onClick={() => setSavedAs(option)}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow flex items-center">
//           <Check className="w-5 h-5 text-green-500 mr-2" />
//           <span className="text-sm">Quick delivery at no extra cost.</span>
//         </div>

//         {/* <div className="bg-blue-50 p-4 rounded-lg flex items-center">
//           <div className="w-6 h-6 bg-blue-200 rounded-full mr-2"></div>
//           <span className="text-sm">1,690 users have booked a cylinder in last 1 hour.</span>
//         </div> */}

//         <button className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-semibold">
//           Proceed
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Bookingmodal;