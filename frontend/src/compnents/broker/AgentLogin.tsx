import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import Lottie from "react-lottie";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginAnimation from "../../Animation/Animation - 1725986382181 (1).json";
import { validateInput, hasFormErrors } from "../../validationpages/validation";
import { useAgentloginMutation } from "../../store/slice/Brokerslice";
import { setagentInfo } from "../../store/slice/Agentauthslice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {FormData,FormErrors,AgentLoginResponse} from "../../interfacetypes/type"

const AgentLoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agentLogin] = useAgentloginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    for (const field in formData) {
      const value = formData[field as keyof FormData];
      const error = validateInput(field, value);
      if (error) newErrors[field as keyof FormErrors] = error;
    }
    setErrors(newErrors);
    return !hasFormErrors(newErrors);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setServerError("");

    try {
      const result = (await agentLogin(
        formData
      ).unwrap()) as AgentLoginResponse;
      if (result.success) {
        toast.success("Successfully logged in");
        dispatch(setagentInfo(result.agent));
        localStorage.setItem("agentToken", result.token);
        localStorage.setItem("agentInfo", JSON.stringify(result.agent));
        navigate("/agent/dashboard");
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "Failed to login. Please try again.";

      if (error.status === "PARSING_ERROR") {
        errorMessage = "Server error. Please try again later.";
      } else if (error.data && typeof error.data === "string") {
        try {
          const parsedError = JSON.parse(error.data);
          errorMessage = parsedError.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
      }

      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex h-screen bg-gray-100 justify-center items-center">
      <div className="max-w-sm w-full p-6 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-900">
          Agent Login
        </h2>
        <Lottie options={defaultOptions} height={200} width={200} />
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-1 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10" // Increased padding on right
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {serverError && <p className="text-xs text-red-600">{serverError}</p>}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <Link
                to="/agent/apply"
                className="text-blue-500 hover:underline ml-1"
              >
                Apply here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentLoginForm;
