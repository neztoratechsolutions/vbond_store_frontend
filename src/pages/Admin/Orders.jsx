import React, { useState, useMemo } from "react";

function Orders() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  // Dummy Orders Data with nested Order Items
  const [orders] = useState([
    {
      id: 1, order_number: "ORD-1001", customer_id: 1, customer_name: "John Doe", address_id: 101,
      address: "123 Main St, Springfield, IL", subtotal: "1000.00", discount_amount: "50.00", tax_amount: "180.00", 
      delivery_charge: "40.00", total_amount: "1170.00", payment_method: "COD", payment_status: "PENDING", 
      order_status: "PENDING", customer_note: "Leave at front door", is_active: true, created_at: "2024-05-10",
      order_items: [
        { id: 1, product_name: "Apple iPhone 15 Pro", quantity: "1.00", unit_price: "999.00", discount_amount: "0.00", tax_amount: "180.00", total_price: "1179.00" }
      ]
    },
    {
      id: 2, order_number: "ORD-1002", customer_id: 2, customer_name: "Sarah Connor", address_id: 102,
      address: "456 Oak Ave, Los Angeles, CA", subtotal: "1500.00", discount_amount: "100.00", tax_amount: "250.00", 
      delivery_charge: "0.00", total_amount: "1650.00", payment_method: "Online", payment_status: "PAID", 
      order_status: "SHIPPED", customer_note: "", is_active: true, created_at: "2024-05-12",
      order_items: [
        { id: 2, product_name: "Dell XPS 13", quantity: "1.00", unit_price: "1200.00", discount_amount: "50.00", tax_amount: "216.00", total_price: "1366.00" },
        { id: 3, product_name: "Wireless Mouse", quantity: "2.00", unit_price: "150.00", discount_amount: "50.00", tax_amount: "34.00", total_price: "284.00" }
      ]
    },
    {
      id: 3, order_number: "ORD-1003", customer_id: 1, customer_name: "John Doe", address_id: 101,
      address: "123 Main St, Springfield, IL", subtotal: "300.00", discount_amount: "0.00", tax_amount: "54.00", 
      delivery_charge: "20.00", total_amount: "374.00", payment_method: "COD", payment_status: "PENDING", 
      order_status: "DELIVERED", customer_note: "Call before delivery", is_active: true, created_at: "2024-05-15",
      order_items: [
        { id: 4, product_name: "Samsung Galaxy S24", quantity: "1.00", unit_price: "300.00", discount_amount: "0.00", tax_amount: "54.00", total_price: "354.00" }
      ]
    }
  ]);

  // Filter & Search States
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // View Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Date Filtering
      const orderDate = new Date(order.created_at);
      let isDateValid = true;

      if (fromDate) {
        isDateValid = isDateValid && orderDate >= new Date(fromDate);
      }
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        isDateValid = isDateValid && orderDate <= endOfDay;
      }

      // 2. Search Filtering
      const lowerCaseQuery = searchQuery.toLowerCase();
      const isSearchValid = 
        order.order_number.toLowerCase().includes(lowerCaseQuery) ||
        order.customer_name.toLowerCase().includes(lowerCaseQuery) ||
        order.payment_status.toLowerCase().includes(lowerCaseQuery) ||
        order.order_status.toLowerCase().includes(lowerCaseQuery);

      return isDateValid && isSearchValid;
    });
  }, [orders, fromDate, toDate, searchQuery]);

  const openViewModal = (order) => {
    setViewingOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setSearchQuery("");
  };

  // Helper for Status Badges
  const getStatusBadge = (status) => {
    let bg = "rgba(108, 117, 125, 0.1)", color = "#6c757d";
    if (status === "PAID" || status === "DELIVERED") { bg = "rgba(40, 167, 69, 0.1)"; color = "#28a745"; }
    if (status === "PENDING") { bg = "rgba(255, 193, 7, 0.1)"; color = "#ffc107"; }
    if (status === "SHIPPED" || status === "PROCESSING") { bg = "rgba(0, 123, 255, 0.1)"; color = "#007bff"; }
    if (status === "CANCELLED") { bg = "rgba(220, 53, 69, 0.1)"; color = "#dc3545"; }
    
    return (
      <span className="badge rounded-pill px-3 py-2" style={{ background: bg, color: color, fontWeight: "500", fontSize: "12px" }}>
        {status}
      </span>
    );
  };

  const inputStyle = { padding: "12px", borderRadius: "10px", border: "1px solid #e9ecef", backgroundColor: "#f8f9fa", fontSize: "15px" };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Orders List</h3>
      </div>

      {/* Filter & Search Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 d-flex flex-wrap align-items-end gap-3">
          
          {/* Search Bar */}
          <div className="flex-grow-1" style={{ minWidth: "250px" }}>
            <label className="form-label text-muted mb-1" style={{ fontSize: "13px", fontWeight: "500" }}>Search Orders</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "10px 0 0 10px" }}>
                <svg width="18" height="18" fill="none" stroke="#6c757d" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Search by Order No, Customer, Status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, borderRadius: "0 10px 10px 0", paddingLeft: "0" }}
              />
            </div>
          </div>

          {/* From Date */}
          <div style={{ minWidth: "160px" }}>
            <label className="form-label text-muted mb-1" style={{ fontSize: "13px", fontWeight: "500" }}>From Date</label>
            <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
          </div>

          {/* To Date */}
          <div style={{ minWidth: "160px" }}>
            <label className="form-label text-muted mb-1" style={{ fontSize: "13px", fontWeight: "500" }}>To Date</label>
            <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
          </div>

          {/* Clear Filters Button */}
          {(fromDate || toDate || searchQuery) && (
            <button className="btn btn-light text-danger d-flex align-items-center" style={{ border: "1px solid #e9ecef", borderRadius: "10px", padding: "12px 16px" }} onClick={clearFilters}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" className="me-1"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ width: "120px" }} className="text-muted fw-medium">Order No</th>
                  <th className="text-muted fw-medium">Customer</th>
                  <th style={{ width: "120px" }} className="text-muted fw-medium">Total (₹)</th>
                  <th style={{ width: "100px" }} className="text-muted fw-medium">Method</th>
                  <th style={{ width: "120px" }} className="text-muted fw-medium">Pay Status</th>
                  <th style={{ width: "120px" }} className="text-muted fw-medium">Order Status</th>
                  <th style={{ width: "120px" }} className="text-muted fw-medium">Date</th>
                  <th style={{ width: "80px" }} className="text-muted fw-medium text-end">View</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                      <td className="fw-bold text-dark">{order.order_number}</td>
                      <td className="text-dark">{order.customer_name}</td>
                      <td className="fw-bold text-success">₹{order.total_amount}</td>
                      <td className="text-muted">{order.payment_method}</td>
                      <td>{getStatusBadge(order.payment_status)}</td>
                      <td>{getStatusBadge(order.order_status)}</td>
                      <td className="text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-link text-info p-1" onClick={() => openViewModal(order)} title="View Details">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-5">No orders found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL FOR ORDER DETAILS */}
      {isModalOpen && viewingOrder && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", 
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div className="modal-content-custom" style={{
            background: "#ffffff", width: "100%", maxWidth: "850px", 
            borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
          }}>
            
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom sticky-top bg-white rounded-top" style={{ zIndex: 10 }}>
              <div>
                <h5 className="fw-bold text-dark mb-0">Order Details</h5>
                <span className="text-muted" style={{ fontSize: "14px" }}>{viewingOrder.order_number} • {new Date(viewingOrder.created_at).toLocaleString()}</span>
              </div>
              <button className="btn btn-link p-0 text-muted" onClick={closeModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="p-4">
              
              {/* Top Info Grid */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa", height: "100%" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>CUSTOMER & SHIPPING</p>
                    <h6 className="fw-bold text-dark mb-1">{viewingOrder.customer_name}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>{viewingOrder.address}</p>
                    {viewingOrder.customer_note && (
                      <p className="mt-2 mb-0 text-warning" style={{ fontSize: "13px" }}><strong>Note:</strong> {viewingOrder.customer_note}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa", height: "100%" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>PAYMENT & STATUS</p>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted" style={{ fontSize: "14px" }}>Payment Method:</span>
                      <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>{viewingOrder.payment_method}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted" style={{ fontSize: "14px" }}>Payment Status:</span>
                      {getStatusBadge(viewingOrder.payment_status)}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted" style={{ fontSize: "14px" }}>Order Status:</span>
                      {getStatusBadge(viewingOrder.order_status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="d-flex align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0 me-3">Order Items</h6>
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
              </div>

              <div className="table-responsive mb-4">
                <table className="table table-sm table-bordered align-middle">
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th className="text-muted fw-medium" style={{ fontSize: "13px" }}>Product Name</th>
                      <th className="text-muted fw-medium text-center" style={{ fontSize: "13px", width: "80px" }}>Qty</th>
                      <th className="text-muted fw-medium text-end" style={{ fontSize: "13px", width: "100px" }}>Unit Price</th>
                      <th className="text-muted fw-medium text-end" style={{ fontSize: "13px", width: "100px" }}>Discount</th>
                      <th className="text-muted fw-medium text-end" style={{ fontSize: "13px", width: "100px" }}>Tax</th>
                      <th className="text-muted fw-medium text-end" style={{ fontSize: "13px", width: "120px" }}>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingOrder.order_items.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-bold text-dark" style={{ fontSize: "14px" }}>{item.product_name}</td>
                        <td className="text-center text-muted" style={{ fontSize: "14px" }}>{item.quantity}</td>
                        <td className="text-end text-muted" style={{ fontSize: "14px" }}>₹{item.unit_price}</td>
                        <td className="text-end text-danger" style={{ fontSize: "14px" }}>-₹{item.discount_amount}</td>
                        <td className="text-end text-muted" style={{ fontSize: "14px" }}>₹{item.tax_amount}</td>
                        <td className="text-end fw-bold text-dark" style={{ fontSize: "14px" }}>₹{item.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="row g-3">
                <div className="col-md-6">
                  {/* Empty space for alignment */}
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted" style={{ fontSize: "14px" }}>Subtotal:</span>
                      <span className="text-dark" style={{ fontSize: "14px" }}>₹{viewingOrder.subtotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted" style={{ fontSize: "14px" }}>Discount:</span>
                      <span className="text-danger" style={{ fontSize: "14px" }}>-₹{viewingOrder.discount_amount}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted" style={{ fontSize: "14px" }}>Tax (GST):</span>
                      <span className="text-dark" style={{ fontSize: "14px" }}>₹{viewingOrder.tax_amount}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted" style={{ fontSize: "14px" }}>Delivery Charge:</span>
                      <span className="text-dark" style={{ fontSize: "14px" }}>₹{viewingOrder.delivery_charge}</span>
                    </div>
                    <hr className="my-2" style={{ borderColor: "#e9ecef" }} />
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold text-dark" style={{ fontSize: "16px" }}>Grand Total:</span>
                      <span className="fw-bold text-success" style={{ fontSize: "18px" }}>₹{viewingOrder.total_amount}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;