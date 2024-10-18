import React, { useState, useEffect } from 'react';
import { FaSort, FaArrowRight, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { useSaleslistsQuery } from "../../store/slice/Adminslice";
import { Agent, Order } from "../../interfacetypes/type";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autoTable plugin
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: UserOptions) => jsPDF;
    }
  }


const SalesListing: React.FC = () => {
  const { data: salesData = [], isLoading, error } = useSaleslistsQuery();
  const [sales, setSales] = useState<Agent[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [agentsPerPage] = useState<number>(5);
  const [currentOrderPage, setCurrentOrderPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(5);

  useEffect(() => {
    if (salesData) {
      const sortedSales = [...salesData].sort((a, b) => {
        const aTotal = getDeliveredOrders(a.orders).reduce((sum, order) => sum + order.price, 0);
        const bTotal = getDeliveredOrders(b.orders).reduce((sum, order) => sum + order.price, 0);
        return bTotal - aTotal;
      });
      setSales(sortedSales);
    }
  }, [salesData]);

  const getDeliveredOrders = (orders: Order[]) =>
    orders.filter(order => order.status === "delivered");

  const handleSort = (field: keyof Agent | 'orderTotal') => {
    const sortedSales = [...sales].sort((a, b) => {
      if (field === 'orderTotal') {
        const aTotal = getDeliveredOrders(a.orders).reduce((sum, order) => sum + order.price, 0);
        const bTotal = getDeliveredOrders(b.orders).reduce((sum, order) => sum + order.price, 0);
        return sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
      }
      if (sortOrder === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      }
      return a[field] < b[field] ? 1 : -1;
    });
    setSales(sortedSales);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = sales.slice(indexOfFirstAgent, indexOfLastAgent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastOrder = currentOrderPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const handleShowOrders = (agentId: string) => {
    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
    } else {
      setSelectedAgentId(agentId);
      setCurrentOrderPage(1);
    }
  };

  const handleOrderPagination = (pageNumber: number) => {
    setCurrentOrderPage(pageNumber);
  };

  const totalSalesAmount = sales.reduce((sum, agent) =>
    sum + getDeliveredOrders(agent.orders).reduce((orderSum, order) => orderSum + order.price, 0), 0);
  const totalDeliveredOrders = sales.reduce((sum, agent) =>
    sum + getDeliveredOrders(agent.orders).length, 0);
  const bestSalesperson = sales[0]?.agentname || "N/A";

  const handleNextPage = () => {
    if (currentPage + 1 <= Math.ceil(sales.length / agentsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage - 1 >= 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const downloadPDF = (agentId: string) => {
    const agent = sales.find(s => s._id === agentId);
    if (!agent) return;
  
    const doc = new jsPDF();
    doc.text(`Orders for ${agent.agentname}`, 14, 15);
    
    const deliveredOrders = getDeliveredOrders(agent.orders);
    const tableData = deliveredOrders.map(order => [
      order._id,
      order.company,
      `₹${order.price}`,
      order.expectedat ? new Date(order.expectedat).toLocaleDateString() : "N/A",
      order.status,
      new Date(order.createdAt).toLocaleDateString()
    ]);
  
    doc.autoTable({
      head: [['Order ID', 'Company', 'Amount', 'Exp Date', 'Status', 'Date']],
      body: tableData,
      startY: 20,
    });
  
    doc.save(`${agent.agentname}_orders.pdf`);
  };

  const downloadExcel = (agentId: string) => {
    const agent = sales.find(s => s._id === agentId);
    if (!agent) return;

    const deliveredOrders = getDeliveredOrders(agent.orders);
    const ws = XLSX.utils.json_to_sheet(deliveredOrders.map(order => ({
      'Order ID': order._id,
      'Company': order.company,
      'Amount': order.price,
      'Exp Date': order.expectedat ? new Date(order.expectedat).toLocaleDateString() : "N/A",
      'Status': order.status,
      'Date': new Date(order.createdAt).toLocaleDateString()
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `${agent.agentname}_orders.xlsx`);
  };

  if (isLoading) return <p>Loading sales data...</p>;
  if (error) return <p>Error fetching sales data</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Listing (Delivered Orders)</h1>

      <div className="bg-gray-100 p-4 mb-6 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Sales Summary</h2>
        <p>Total Delivered Orders: <strong>{totalDeliveredOrders}</strong></p>
        <p>Total Sales Amount: <strong>₹{totalSalesAmount.toFixed(2)}</strong></p>
        <p>Best Salesperson: <strong>{bestSalesperson}</strong></p>
      </div>

      <table className="w-full table-auto mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">
              Agent
              <FaSort
                className="inline ml-2 cursor-pointer"
                onClick={() => handleSort("agentname")}
              />
            </th>
            <th className="px-4 py-2">Pincode</th>
            <th className="px-4 py-2">
              Sales Amount (Delivered)
              <FaSort
                className="inline ml-2 cursor-pointer"
                onClick={() => handleSort("orderTotal")}
              />
            </th>
            <th className="px-4 py-2">
              Number of Delivered Orders
              <FaSort
                className="inline ml-2 cursor-pointer"
                onClick={() => handleSort("orderTotal")}
              />
            </th>
            <th className="px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {currentAgents.length > 0 ? (
            currentAgents.map((sale) => {
              const deliveredOrders = getDeliveredOrders(sale.orders);
              return (
                <React.Fragment key={sale._id}>
                  <tr className="border-b">
                    <td className="px-4 py-2">{sale.agentname}</td>
                    <td className="px-4 py-2">{sale.pincode}</td>
                    <td className="px-4 py-2">
                    ₹
                      {deliveredOrders
                        .reduce((sum, order) => sum + order.price, 0)
                        .toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{deliveredOrders.length}</td>
                    <td className="px-4 py-2 text-center">
                      <FaArrowRight
                        className="cursor-pointer"
                        onClick={() => handleShowOrders(sale._id)}
                      />
                    </td>
                  </tr>
                  {selectedAgentId === sale._id && (
                    <tr>
                      <td colSpan={6} className="px-4 py-2 bg-gray-50">
                        <div className="flex justify-end mb-2">
                          <button 
                            onClick={() => downloadPDF(sale._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded mr-2 flex items-center"
                          >
                            <FaFilePdf className="mr-1" /> PDF
                          </button>
                          <button 
                            onClick={() => downloadExcel(sale._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                          >
                            <FaFileExcel className="mr-1" /> Excel
                          </button>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Orders</h3>
                        <table className="w-full table-auto mb-4">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="px-4 py-2">Order ID</th>
                              <th className="px-4 py-2">Company</th>
                              <th className="px-4 py-2">Amount</th>
                              <th className="px-4 py-2">Exp Date</th>
                              <th className="px-4 py-2">Status</th>
                              <th className="px-4 py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deliveredOrders.slice(indexOfFirstOrder, indexOfLastOrder).map((order) => (
                              <tr key={order._id}>
                                <td className="px-4 py-2">{order._id}</td>
                                <td className="px-4 py-2">{order.company}</td>
                                <td className="px-4 py-2">₹{order.price.toFixed(2)}</td>
                                <td className="px-4 py-2">{order.expectedat ? new Date(order.expectedat).toLocaleDateString() : "N/A"}</td>
                                <td className="px-4 py-2">{order.status}</td>
                                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="flex justify-center mb-4">
                          <button
                            onClick={() => handleOrderPagination(currentOrderPage - 1)}
                            disabled={currentOrderPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded-l-md"
                          >
                            Prev
                          </button>
                          {[...Array(Math.ceil(deliveredOrders.length / ordersPerPage))].map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handleOrderPagination(index + 1)}
                              className={`px-3 py-1 ${currentOrderPage === index + 1 ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => handleOrderPagination(currentOrderPage + 1)}
                            disabled={currentOrderPage === Math.ceil(deliveredOrders.length / ordersPerPage)}
                            className="px-3 py-1 bg-gray-200 rounded-r-md"
                          >
                            Next
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No sales found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded-l-md"
        >
          Prev
        </button>
        <button
          className="px-3 py-1 bg-blue-400 text-white"
        >
          {currentPage}
        </button>
        {currentPage < Math.ceil(sales.length / agentsPerPage) && (
          <button
            onClick={handleNextPage}
            className="px-3 py-1 bg-gray-200"
          >
            {currentPage + 1}
          </button>
        )}
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(sales.length / agentsPerPage)}
          className="px-3 py-1 bg-gray-200 rounded-r-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SalesListing;