import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useEditproductMutation } from "../../store/slice/Brokerslice";

interface FormData {
  companyName: string;
  kg: string;
  price: string;
  quantity: string;
}

interface Product {
  _id: string;
  companyname: string;
  weight: number;
  price: number;
  quantity: number;
}

interface ProductEditingFormProps {
  refetchProducts: () => void;
  closeModal: () => void;
  initialProduct?: Product;
}

const ProductEditingForm: React.FC<ProductEditingFormProps> = ({
  refetchProducts,
  closeModal,
  initialProduct,
}) => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    kg: "",
    price: "",
    quantity: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [editproduct] = useEditproductMutation();

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        companyName: initialProduct.companyname || "",
        kg: String(initialProduct.weight) || "",
        price: String(initialProduct.price) || "",
        quantity: String(initialProduct.quantity) || "",
      });
    }
  }, [initialProduct]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedProduct = {
        _id: initialProduct?._id,
        companyname: formData.companyName,
        weight: parseFloat(formData.kg),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      const response = await editproduct(updatedProduct).unwrap();
      console.log(response, "the edited data");
      toast.success("Product updated successfully");
      refetchProducts();
      closeModal();
    } catch (error) {
      toast.error("Failed to update the product");
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
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          {initialProduct ? "Edit Product" : "Product Registration"}
        </h2>

        {[
          {
            name: "companyName",
            label: "Company Name",
            placeholder: "Enter company name",
            type: "text",
          },
          { name: "kg", label: "KG (Weight)", placeholder: "Enter weight in KG", type: "number" },
          { name: "price", label: "Price (₹)", placeholder: "Enter price", type: "number" },
          { name: "quantity", label: "Quantity", placeholder: "Enter quantity", type: "number" },
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
              value={formData[field.name as keyof FormData]}
              onChange={handleChange}
              placeholder={field.placeholder}
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
            {isLoading ? "Submitting..." : initialProduct ? "Update Product" : "Register Product"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductEditingForm;