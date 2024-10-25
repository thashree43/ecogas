import { useState, ChangeEvent, FormEvent } from "react";
import Lottie from "react-lottie";
import fuelAnimation from "../../Animation/Animation - 1725986382181 (1).json"; // Path to your Lottie animation JSON file
import { validateInput, hasFormErrors } from "../../validationpages/validation";
import { useAgentapplyMutation } from "../../store/slice/Brokerslice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { CustomFormData, FormErrors } from "../../interfacetypes/type";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<CustomFormData>({
    username: "",
    email: "",
    mobile: "",
    password: "",
    profileImage: undefined,
    pincode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [agentapply] = useAgentapplyMutation();
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const error = validateInput("profileImage", file);

    if (file && file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, profileImage: "File size exceeds 5MB limit." });
    } else if (error) {
      setErrors({ ...errors, profileImage: error });
    } else {
      setFormData({ ...formData, profileImage: file });
      setErrors({ ...errors, profileImage: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    for (const field in formData) {
      const value = formData[
        field as keyof Omit<CustomFormData, "profileImage">
      ] as string;
      const error = validateInput(
        field,
        field === "profileImage" ? formData.profileImage : value
      );
      if (error) newErrors[field as keyof FormErrors] = error;
    }

    setErrors(newErrors);
    return !hasFormErrors(newErrors);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setServerError("");
    console.log("Form data before submission:", formData);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("agentname", formData.username);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("mobile", formData.mobile);
      formDataToSubmit.append("password", formData.password);
      formDataToSubmit.append("pincode", formData.pincode);
      if (formData.profileImage) {
        formDataToSubmit.append("image", formData.profileImage);
      }

      console.log("FormData content:");
      for (let [key, value] of formDataToSubmit.entries()) {
        console.log(key, value);
      }

      const result = await agentapply(formDataToSubmit).unwrap();
      console.log("Registration successful:", result);
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "Failed to register. Please try again.";

      if (error.status === "PARSING_ERROR") {
        console.error("Server response parsing error:", error.error);
        errorMessage =
          "Server error. Please try again later or contact support.";
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
    navigate("/agent/login");
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: fuelAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 flex items-center justify-center">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

      {/* Right side: Registration form */}
      <div className="w-1/2 max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Application Form
        </h2>
        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Full Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="e.g. Bonnie Green"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="mobile"
            >
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
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
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="pincode"
            >
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              placeholder="Enter your pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="profileImage"
            >
              Upload your licence Picture
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.profileImage && (
              <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>

          {serverError && (
            <p className="mt-2 text-sm text-red-600">{serverError}</p>
          )}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Alreaddy have an account?
              <Link
                to="/agent/login"
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

export default RegisterForm;