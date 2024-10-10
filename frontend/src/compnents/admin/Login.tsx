import React, { ChangeEvent, useState } from "react";
import {
  validateInput,
  FormErrors,
  isFormEmpty,
} from "../../validationpages/validation"; 
import { useAdminloginMutation, useRefreshTokenMutation, } from "../../store/slice/Adminslice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  admin?: {
    _id: string;
    email: string;
  };
}
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const navigate = useNavigate();
  const [adminLogin] = useAdminloginMutation();
  const [refreshToken] = useRefreshTokenMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setLoginError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminLogin({ email, password }).unwrap() as unknown as  LoginResponse;
      if (res.success) {
        localStorage.setItem("adminToken", res.token);
        // localStorage.setItem("refreshToken", res.refreshToken);
        navigate("/admin/dashboard");
      } else {
        setLoginError("Login failed. Please check your credentials and try again.");
      }
    } catch (error: any) {
      if (error.status === 401) {
        console.error("login failed",error);
        
        
        try {
          console.log("the token set to refresh ");
          
          const refreshResult = await refreshToken().unwrap();
          console.log("reached the refresh token");
          
          localStorage.setItem("adminToken", refreshResult.token);
          const retryRes = await adminLogin({ email, password }).unwrap();
          console.log("the refreshed token");
          
            if (retryRes.success) {
              navigate("/admin/dashboard");
              console.log("done the refresh token ");
              
            } else {
              setLoginError("Login failed after token refresh. Please try again.");
            }
        } catch {
          setLoginError("Your session has expired. Please log in again.");
        }
      } else {
        setLoginError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
          fontSize: "24px",
        }}
      >
        Admin Login
      </h2>
      <form onSubmit={handleSubmit}>
        {loginError && (
          <div style={{ 
            backgroundColor: "#ffebee", 
            color: "#c62828", 
            padding: "10px", 
            borderRadius: "4px", 
            marginBottom: "20px" 
          }}>
            {loginError}
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={{
              width: "100%",
              padding: "12px",
              border: `1px solid ${errors.email ? "#dc3545" : "#ccc"}`,
              borderRadius: "6px",
              fontSize: "16px",
            }}
          />
          {errors.email && (
            <p style={{ color: "#dc3545", marginTop: "5px" }}>{errors.email}</p>
          )}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${errors.password ? "#dc3545" : "#ccc"}`,
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {errors.password && (
            <p style={{ color: "#dc3545", marginTop: "5px" }}>{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#007bff",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;