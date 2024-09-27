import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./Userroute";
import Adminroute from "./Adminroute";
import BrokerRoute from "./Brokerroute";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const secretKet = "pk_test_51Q2oHQ07bhNnobEeFPOALRw2PH8CMUAv1d7QON3WnI2ktWnuZ8uzNd4ZTujcKnzuL16KoPkTyYqidVWfH6jyGC2j00mZhrOOsx"
const stripePromise = loadStripe(secretKet);

const AppRoutes: React.FC = () => {
  return (
    <Router>
       <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/*" element={<UserRoute />} />
        <Route path="/admin/*" element={<Adminroute />} />
        <Route path="/agent/*" element= {<BrokerRoute/>}/>
      </Routes>
      </Elements>
    </Router>
  );
};

export default AppRoutes;
