import React, { useState } from "react";
import { useGetfullordersQuery } from "../../store/slice/Adminslice";
import { toast } from "react-toastify";

interface Order {
  _id: string;
  name: string;
  address: string;
  mobile: number;
  consumerid: number;
  company: string;
  price: number;
  paymentmethod: string;
  expectedat: string;
  status: string;
}

interface OrderResponse {
  success: boolean;
  orders: Order[];
}

const OrderList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, } = useGetfullordersQuery<{ data: OrderResponse }>();
  const ordersPerPage = 5;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredOrders = data?.orders?.filter(
    (order: Order) =>
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.mobile.toString().includes(search)
  ) || [];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="order-list-container" style={{ padding: "20px" }}>
      <h2>Order List</h2>
      <input
        type="text"
        placeholder="Search by name or mobile"
        value={search}
        onChange={handleSearch}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      />
     
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "10px", textAlign: "center" }}>No</th>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>ConsumerID</th>
                <th style={{ padding: "10px" }}>Address</th>
                <th style={{ padding: "10px" }}>Mobile</th>
                <th style={{ padding: "10px" }}>Company</th>
                <th style={{ padding: "10px" }}>Price</th>
                <th style={{ padding: "10px" }}>Payment Method</th>
                <th style={{ padding: "10px" }}>Expected At</th>
                <th style={{ padding: "10px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order: Order, index: number) => (
                <tr key={order._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px", textAlign: "center" }}>{indexOfFirstOrder + index + 1}</td>
                  <td style={{ padding: "10px" }}>{order.name}</td>
                  <td style={{ padding: "10px" }}>{order.consumerid}</td>
                  <td style={{ padding: "10px" }}>{order.address}</td>
                  <td style={{ padding: "10px" }}>{order.mobile}</td>
                  <td style={{ padding: "10px" }}>{order.company}</td>
                  <td style={{ padding: "10px" }}>{order.price}</td>
                  <td style={{ padding: "10px" }}>{order.paymentmethod}</td>
                  <td style={{ padding: "10px" }}>{new Date(order.expectedat).toLocaleDateString()}</td>
                  <td style={{ padding: "10px" }}>{order.status}</td>
                  {/* <td style={{ padding: "10px", textAlign: "center" }}>
                    {order.status === "delivered" && (
                      <button
                        onClick={() => toast.info("Invoice functionality not implemented")}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "5px",
                          border: "none",
                          backgroundColor: "#007bff",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Invoice
                      </button>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: currentPage === i + 1 ? "#007bff" : "#f0f0f0",
                  color: currentPage === i + 1 ? "white" : "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      
    </div>
  );
};

export default OrderList;