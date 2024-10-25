import React, { useState, useEffect } from "react";
import {
  useLazyListproductQuery,
  useEditproductMutation,
  useDeleteproductMutation,
} from "../../store/slice/Brokerslice";
import { FaSearch, FaTrash, FaEdit, FaPlus, FaTimes, FaBox, FaRupeeSign, FaWeight, FaBoxes } from "react-icons/fa";
import ProductAddingForm from "./Productaddingmodal";
import ProductEditingForm from "./Producteditingmodal";
import { toast } from "react-toastify";
import { FunctionData, Product } from "../../interfacetypes/type";

const ProductList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [trigger, { data, isLoading, error }] = useLazyListproductQuery();
  const [updateProduct] = useEditproductMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteproduct] = useDeleteproductMutation();
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const filteredProducts =
    data?.products?.filter((product: Product) =>
      product.companyname.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await deleteproduct({ id: productId }).unwrap();
      if (res.success) {
        toast.success("Product deleted successfully", {
          position: "top-right",
          style: { background: '#10B981', color: 'white' }
        });
        setShowDeleteConfirm(null);
        trigger();
      }
    } catch (error) {
      toast.error("Failed to delete product", {
        position: "top-right",
        style: { background: '#EF4444', color: 'white' }
      });
    }
  };

  const handleEdit = async (updatedProduct: Product) => {
    try {
      await updateProduct(updatedProduct).unwrap();
      toast.success("Product updated successfully", {
        position: "top-right",
        style: { background: '#10B981', color: 'white' }
      });
      trigger();
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update product", {
        position: "top-right",
        style: { background: '#EF4444', color: 'white' }
      });
    }
  };

  const formProps: FunctionData = {
    refetch: trigger,
    closeModal: () => setIsModalOpen(false),
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{product.companyname}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditingProduct(product);
                setIsEditModalOpen(true);
              }}
              className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
            >
              <FaEdit className="text-white" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(product._id)}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <FaTrash className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <FaWeight className="text-blue-500" />
            <span className="font-medium">Weight:</span>
            <span>{product.weight} kg</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaRupeeSign className="text-green-500" />
            <span className="font-medium">Price:</span>
            <span>₹{product.price}/-</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaBoxes className="text-purple-500" />
            <span className="font-medium">Quantity:</span>
            <span>{product.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Inventory</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <FaPlus />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('grid')}
              className={`px-4 py-2 rounded-lg ${
                selectedView === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`px-4 py-2 rounded-lg ${
                selectedView === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">
          <p>Error loading products. Please try again later.</p>
        </div>
      ) : (
        <div className={`grid ${
          selectedView === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'grid-cols-1 gap-4'
        }`}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FaBox className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
            <ProductAddingForm {...formProps} />
          </div>
        </div>
      )}

      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
            <ProductEditingForm
              initialProduct={editingProduct}
              onEdit={handleEdit}
              {...formProps}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;