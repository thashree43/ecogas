// import React, { useState } from 'react';
// import Homepage from '../mainpages/Homepage';
// import Header from '../../../layouts/Header';
// import Footer from '../../../layouts/Footer';
// import LoginPage from '../Registerpart/Loginpage';
// import SignUpPage from '../Registerpart/Usersignuppage';

// const Home: React.FC = () => {
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isRegisterOpen, setIsRegisterOpen] = useState(false);

//   const handleLoginOpen = () => {
//     setIsLoginOpen(true);
//   };

//   const handleLoginClose = () => {
//     setIsLoginOpen(false);
//   };

//   const handleRegisterOpen = () => {
//     setIsLoginOpen(false); 
//     setIsRegisterOpen(true);
//   };

//   const handleRegisterClose = () => {
//     setIsRegisterOpen(false);
//   };

//   return (
//     <div>
//       {/* <Header onAccountClick={handleLoginOpen} /> */}
//       <Homepage />
//       <LoginPage isOpen={isLoginOpen} onClose={handleLoginClose} onRegisterClick={handleRegisterOpen} />
//       <SignUpPage isOpen={isRegisterOpen} onClose={handleRegisterClose} />
//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default Home;
