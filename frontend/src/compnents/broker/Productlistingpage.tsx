import React, { useState, useEffect } from "react";
import {
  useLazyListproductQuery,
  useEditproductMutation,
  useDeleteproductMutation,
} from "../../store/slice/Brokerslice";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import ProductAddingForm from "./Productaddingmodal";
import ProductEditingForm from "./Producteditingmodal";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  companyname: string;
  weight: number;
  price: number;
  quantity: number;
}

const ProductList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [trigger, { data, isLoading, error }] = useLazyListproductQuery();
  const [updateProduct] = useEditproductMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteproduct] = useDeleteproductMutation();

  useEffect(() => {
    trigger(); // Fetch products on mount
  }, [trigger]);

  const filteredProducts =
    data?.products?.filter((product) =>
      product.companyname.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await deleteproduct({ id: productId }).unwrap();
      if (res.success) {
        toast.success("The product was deleted successfully");
        trigger(); // Refetch products after deletion
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = async (updatedProduct: Product) => {
    try {
      await updateProduct(updatedProduct).unwrap();
      toast.success("Product updated successfully");
      trigger(); 
      closeEditModal();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Product List</h2>
        <button style={styles.addButton} onClick={openModal}>
          Add Product
        </button>
      </div>

      <div style={styles.searchContainer}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by company name"
          value={search}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading products:</p>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.companyName}>{product.companyname}</h3>
                </div>
                <div style={styles.cardBody}>
                  <p style={styles.info}>
                    <strong>Weight:</strong> {product.weight}kg
                  </p>
                  <p style={styles.info}>
                    <strong>Price:</strong> ₹.{product.price}/-
                  </p>
                  <p style={styles.info}>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <div style={styles.cardActions}>
                    <button
                      style={styles.editButton}
                      onClick={() => openEditModal(product)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(product._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <button style={styles.closeModalButton} onClick={closeModal}>
              X
            </button>
            <ProductAddingForm refetchProducts={trigger} closeModal={closeModal} />
          </div>
        </div>
      )}

      {isEditModalOpen && editingProduct && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <button style={styles.closeModalButton} onClick={closeEditModal}>
              X
            </button>
            <ProductEditingForm
              refetchProducts={trigger}
              closeModal={closeEditModal}
              initialProduct={editingProduct}
              onEdit={handleEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f0f3f6",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    color: "#2c3e50",
  },
  addButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px",
  },
  searchContainer: {
    position: "relative" as "relative",
    marginBottom: "20px",
  },
  searchIcon: {
    position: "absolute" as "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#7f8c8d",
  },
  searchInput: {
    padding: "10px 10px 10px 40px",
    width: "300px",
    borderRadius: "25px",
    border: "1px solid #bdc3c7",
    fontSize: "16px",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "20px",
    background: "linear-gradient(rgb(44, 62, 80) 0%, rgb(52, 73, 94) 100%)",
    color: "#ffffff",
    textAlign: "center" as "center",
  },
  companyName: {
    margin: 0,
    fontSize: "18px",
  },
  cardBody: {
    padding: "20px",
  },
  info: {
    margin: "10px 0",
    fontSize: "14px",
  },
  modalBackdrop: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "500px",
    position: "relative" as "relative",
  },
  closeModalButton: {
    position: "absolute" as "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginRight: "10px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  cardActions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end",
  },
};

export default ProductList;