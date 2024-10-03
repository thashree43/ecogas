import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppProductMutation } from "../../store/slice/Brokerslice";
import { toast } from "react-toastify";
import {CompanyData,FunctionData} from "../../interfacetypes/type"


const ProductAddingForm: React.FC<FunctionData> = ({
  refetch,
  closeModal,
}) => {
  const [formData, setFormData] = useState<CompanyData>({
    companyname: "",
    weight: 0,
    price:0,
    quantity: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [addProduct] = useAppProductMutation();

  const agentId = localStorage.getItem("agentId");

  const validateInput = (name: string, value: string): string => {
    let error = '';
    switch (name) {
      case 'companyName':
        if (!value) {
          error = 'Company name is required';
        } else if (value.length < 3) {
          error = 'Company name must be at least 3 characters long';
        }
        break;
      case 'kg':
      case 'price':
      case 'quantity':
        if (!value) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} must be a positive number`;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    let formErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateInput(key, value);
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateInput(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const productData = {
        ...formData,
        agentId,
      };

      const data = await addProduct(productData).unwrap();
      console.log("Response data:", data);

      if (data.success) {
        setServerError("");
        refetch();
        toast.success("Product added successfully");
        closeModal();
      }
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message;
      if (errorMessage === "Product with the same name already exists.") {
        toast.error("Product already exists. Please try a different name.");
      } else {
        toast.error("Failed to add the product");
      }
      setServerError("Failed to add the product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Product Registration
        </h2>
        {[
          {
            name: "companyName",
            label: "Company Name",
            placeholder: "GasCorp",
            type: "text",
          },
          { name: "kg", label: "KG (Weight)", placeholder: "12", type: "number" },
          { name: "price", label: "Price (₹)", placeholder: "50", type: "number" },
          { name: "quantity", label: "Quantity", placeholder: "100", type: "number" },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={field.name}
            >
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name as keyof CompanyData]}
              onChange={handleChange}
              required
              min={field.type === "number" ? "0.01" : undefined}
              step={field.type === "number" ? "0.01" : undefined}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            {isLoading ? "Submitting..." : "Register Product"}
          </button>
        </div>

        {serverError && (
          <p className="text-red-500 text-xs italic mt-2">{serverError}</p>
        )}
      </form>
    </motion.div>
  );
};

export default ProductAddingForm;