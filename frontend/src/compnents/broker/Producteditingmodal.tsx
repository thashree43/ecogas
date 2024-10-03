import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useEditproductMutation } from "../../store/slice/Brokerslice";
import { CompanyData, ProductEditingFormProps, Product } from "../../interfacetypes/type";

const ProductEditingForm: React.FC<ProductEditingFormProps> = ({
  refetch,
  closeModal,
  initialProduct,
  onEdit
}) => {
  const [formData, setFormData] = useState<CompanyData>({
    companyname: "",
    weight: 0,
    price: 0,
    quantity: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [editproduct] = useEditproductMutation();

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        companyname: initialProduct.companyname || "",
        weight: initialProduct.weight || 0,
        price: initialProduct.price || 0,
        quantity: initialProduct.quantity || 0,
      });
    }
  }, [initialProduct]);

  const validateInput = (name: string, value: string | number): string => {
    let error = '';
    switch (name) {
      case 'companyname':
        if (!value) {
          error = 'Company name is required';
        } else if (typeof value === 'string' && value.length < 3) {
          error = 'Company name must be at least 3 characters long';
        }
        break;
      case 'weight':
      case 'price':
      case 'quantity':
        if (value === '') {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} must be a non-negative number`;
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
    let newValue: string | number = value;

    if (name !== 'companyname') {
      // For number inputs, convert to number or use empty string
      newValue = value === '' ? '' : Number(value);
    }

    setFormData({ ...formData, [name]: newValue });
    const error = validateInput(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedProduct: Product = {
        _id: initialProduct._id,
        ...formData
      };

      await onEdit(updatedProduct);
      toast.success("Product updated successfully");
      refetch();
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
          Edit Product
        </h2>

        {[
          { name: "companyname", label: "Company Name", type: "text" },
          { name: "weight", label: "Weight (kg)", type: "number" },
          { name: "price", label: "Price (₹)", type: "number" },
          { name: "quantity", label: "Quantity", type: "number" },
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
              value={formData[field.name as keyof CompanyData]}
              onChange={handleChange}
              min={field.type === "number" ? "0" : undefined}
              step={field.type === "number" ? "any" : undefined}
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
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductEditingForm;