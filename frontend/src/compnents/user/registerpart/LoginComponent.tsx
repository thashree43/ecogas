// LoginComponent.tsx

import React, { useState } from "react";
import Modal from "./Registermodal";
import { validateInput, FormErrors } from "../../../validationpages/validation";
import {
  useLoginMutation,
  useGoogleregisterMutation,
  useRefreshtokenMutation,
} from "../../../store/slice/Userapislice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { setUserInfo ,setUserToken} from "../../../store/slice/Authslice";
import { Link, useNavigate } from "react-router-dom";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const LoginComponent: React.FC<LoginPageProps> = ({
  isOpen,
  onClose,
  onRegisterClick,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPost, { isLoading }] = useLoginMutation();
  const [refreshtoken] = useRefreshtokenMutation();
  const [googleregister] = useGoogleregisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateInput(name, value) });
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.email || errors.password) {
      setLoginError("Please correct the highlighted errors.");
      toast.error("Please correct the highlighted errors.");
      return;
    }

    try {
      const user = await loginPost({ email, password }).unwrap();
      dispatch(setUserInfo(user));
      localStorage.setItem("userInfo", JSON.stringify(user)); 
      dispatch(setUserToken(user.token)); // Assuming you have an action to set user token

      navigate("/");
      setEmail("");
      setPassword("");
      onClose();
      toast.success("Successfully logged in!");
    } catch (error: any) {
      if (error.status === 401) {
        console.error("login failed", error);
        try {
          console.log("the token set to refresh ");
          
          const refreshResult = await refreshtoken({}).unwrap();
          console.log("reached the refresh token");
          
          localStorage.setItem("userToken", refreshResult.token);
          const retryRes = await loginPost({ email, password }).unwrap(); 
          console.log("the refreshed token");       
          dispatch(setUserInfo(retryRes));          
           dispatch(setUserToken(retryRes.token)); 

          navigate("/"); 
          setEmail("");
          setPassword("");
          onClose();
          toast.success("Successfully logged in!");
        } catch (refreshError: any) {
          setLoginError("Login failed after token refresh. Please try again.");
        }
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (token: TokenResponse) => {
      try {
        const response = await googleregister(token.access_token).unwrap();
        dispatch(setUserInfo(response));
        localStorage.setItem("userInfo", JSON.stringify(response));
        dispatch(setUserToken(response.token));      
        navigate("/");
        setEmail("");
        setPassword("");
        onClose();
        toast.success("Successfully logged in with Google!");
      } catch (error: any) {
        console.log("abhiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        
        if (error.status === 401) {
          console.error("login failed", error);
          try {
            console.log("the token set to refresh ");
            
            const refreshResult = await refreshtoken({}).unwrap();
            console.log("reached the refresh token");
            
            localStorage.setItem("userToken", refreshResult.token);
            const retryRes = await googleregister(token.access_token).unwrap(); 
            console.log("the refreshed token");       
            dispatch(setUserInfo(retryRes.user)); 
            dispatch(setUserToken(retryRes.token))
            navigate("/");
            setEmail("");
            setPassword("");
            onClose();
            toast.success("Successfully logged in with Google!");
          } catch (refreshError: any) {
            setLoginError("Login failed after token refresh. Please try again.");
          }
        }
      }
    },
    onError: (error) => {
      console.log("Google login error", error);
      toast.error("Google login error occurred.");
    },
  });

  const handleGoogleButtonClick = () => {
    handleGoogleLogin();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Login">
        <div className="p-8 max-w-md mx-auto space-y-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome Back!
          </h2>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleButtonClick}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition focus:outline-none"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google Icon"
                className="h-6 w-6"
              />
              Log in with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Password"
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Additional Options */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500 bg-gray-100 border-gray-400 focus:ring-blue-500"
                />
                <span className="ml-2">Remember Me</span>
              </label>
              <Link to="/resetpassword" className="hover:text-blue-600">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            {loginError && (
              <p className="text-red-500 text-xs mt-2 text-center">{loginError}</p>
            )}
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={onRegisterClick}
            >
              Register
            </button>
          </p>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default LoginComponent;


