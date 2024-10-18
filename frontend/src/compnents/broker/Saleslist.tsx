import React, { useState, useEffect, useMemo } from "react";
import { useGetsalesQuery } from "../../store/slice/Brokerslice";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Agent, Order } from "../../interfacetypes/type";

const Saleslist: React.FC = () => {
  const [agentId, setAgentId] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    try {
      const agentInfo = JSON.parse(localStorage.getItem("agentInfo") || "{}");
      if (agentInfo?._id) {
        setAgentId(agentInfo._id);
      }
    } catch (error) {
      console.error("Error parsing agent info:", error);
    }
  }, []);

  const { data, isLoading, error, refetch } = useGetsalesQuery(agentId, {
    skip: !agentId,
  });

  useEffect(() => {
    if (data) {
      try {
        // Filter only the delivered orders
        const deliveredOrders = data.data?.orders?.filter((order: Order) => order.status === "delivered") || [];
        setFilteredOrders(deliveredOrders);
      } catch (error) {
        console.error("Error processing sales data:", error);
        setFilteredOrders([]);
      }
    }
  }, [data]);

  const { currentOrders, totalPages, totalOrders, topCompany } = useMemo(() => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const totalOrders = filteredOrders.length;
    
    const companySales = filteredOrders.reduce((acc: Record<string, number>, order: Order) => {
      if (order.company) {
        acc[order.company] = (acc[order.company] || 0) + 1;
      }
      return acc;
    }, {});
    
    const topCompany = Object.entries(companySales).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

    return { currentOrders, totalPages, totalOrders, topCompany };
  }, [filteredOrders, currentPage, ordersPerPage]);

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "sales_list.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Order ID', 'Name', 'Price', 'Company', 'Payment Method', 'Expected At', 'Status']],
      body: currentOrders.map(order => [
        order._id, order.name, order.price, order.company, order.paymentmethod, new Date(order.expectedat).toLocaleDateString(), order.status
      ]),
    });
    doc.save('sales_list.pdf');
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading sales data</div>;
  if (!filteredOrders.length) return <div className="p-4">No delivered orders available</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Delivered Sales List</h2>
        <div>
          <button 
            onClick={exportToExcel}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Export to Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Export to PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Company</th>
              <th className="px-4 py-2 border">Payment Method</th>
              <th className="px-4 py-2 border">Expected At</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-2 border">{order._id}</td>
                <td className="px-4 py-2 border">{order.name}</td>
                <td className="px-4 py-2 border">{order.price}</td>
                <td className="px-4 py-2 border">{order.company}</td>
                <td className="px-4 py-2 border">{order.paymentmethod}</td>
                <td className="px-4 py-2 border">
                  {new Date(order.expectedat).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="text-sm">
          <p>Total Delivered Orders: {totalOrders}</p>
          <p>Top Selling Company: {topCompany}</p>
        </div>
      </div>
    </div>
  );
};

export default Saleslist;
