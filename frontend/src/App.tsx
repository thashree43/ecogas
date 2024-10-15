import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes/Mainroute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { GoogleOAuthProvider } from '@react-oauth/google';


// const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App: React.FC = () => {


  return (
    <GoogleOAuthProvider clientId={"661435766183-j334nbfrs00te5ff5opomog4aid02m2b.apps.googleusercontent.com"}>
      <Provider store={store}>
     
        <ToastContainer />
        <AppRoutes />
       
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;


