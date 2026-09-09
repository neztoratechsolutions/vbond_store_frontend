import React, { useState } from "react";

function Customers() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  // Dummy Data (In reality, this will be fetched from your API)
  const [customers] = useState([
    {
      id: 1, name: "John Doe", email: "john.doe@example.com", phone: "9876543210", is_active: true, created_at: "2024-05-01",
      addresses: [
        { id: 101, address_type: "Home", name: "John Doe", phone: "9876543210", address_line_1: "123 Main St", address_line_2: "Apt 4", city: "Springfield", state: "IL", pincode: "62701", landmark: "Near Park", is_default: true },
        { id: 102, address_type: "Office", name: "John Doe", phone: "9876543210", address_line_1: "456 Corporate Ave", address_line_2: "Suite 10", city: "Chicago", state: "IL", pincode: "60601", landmark: "", is_default: false }
      ]
    },
    {
      id: 2, name: "Sarah Connor", email: "sarah.c@example.com", phone: "9123456789", is_active: false, created_at: "2024-05-10",
      addresses: [
        { id: 103, address_type: "Home", name: "Sarah Connor", phone: "9123456789", address_line_1: "789 Oak St", address_line_2: "", city: "Los Angeles", state: "CA", pincode: "90001", landmark: "Blue House", is_default: true }
      ]
    }
  ]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const openViewModal = (customer) => {
    setViewingCustomer(customer);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Customers Directory</h3>
      </div>

      {/* Customers Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ width: "80px" }} className="text-muted fw-medium">#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th style={{ width: "120px" }} className="text-muted fw-medium">Status</th>
                  <th style={{ width: "100px" }} className="text-muted fw-medium text-end">View</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td className="text-muted">{c.id}</td>
                    <td className="fw-bold text-dark">{c.name}</td>
                    <td className="text-dark">{c.phone}</td>
                    <td className="text-muted">{c.email || "-"}</td>
                    <td>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: c.is_active ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: c.is_active ? "#28a745" : "#6c757d", fontWeight: "500" }}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-link text-info p-1" onClick={() => openViewModal(c)} title="View Details">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL FOR VIEWING CUSTOMER & ADDRESSES     */}
      {/* ========================================== */}
      {isViewModalOpen && viewingCustomer && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="modal-content-custom" style={{ background: "#ffffff", width: "100%", maxWidth: "700px", borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom sticky-top bg-white rounded-top" style={{ zIndex: 10 }}>
              <div>
                <h5 className="fw-bold text-dark mb-0">Customer Details</h5>
                <span className="text-muted" style={{ fontSize: "14px" }}>Joined on {new Date(viewingCustomer.created_at).toLocaleDateString()}</span>
              </div>
              <button className="btn btn-link p-0 text-muted" onClick={closeViewModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="p-4">
              
              {/* Customer Basic Info */}
              <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>NAME</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingCustomer.name}</h6>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>PHONE</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingCustomer.phone}</h6>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>EMAIL</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingCustomer.email || "N/A"}</h6>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>STATUS</p>
                    <span className="badge rounded-pill px-3 py-2" style={{ background: viewingCustomer.is_active ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: viewingCustomer.is_active ? "#28a745" : "#6c757d", fontWeight: "500" }}>
                      {viewingCustomer.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Saved Addresses Section */}
              <div className="d-flex align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0">Saved Addresses ({viewingCustomer.addresses.length})</h6>
                <hr className="flex-grow-1 ms-3" style={{ borderColor: "#f0f0f0" }} />
              </div>

              {/* Address Cards */}
              <div className="row g-3">
                {viewingCustomer.addresses.map((addr) => (
                  <div className="col-md-6" key={addr.id}>
                    <div className="p-3 h-100 rounded-3" style={{ border: "1px solid #e9ecef", backgroundColor: "#ffffff" }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>{addr.address_type}</span>
                        {addr.is_default && <span className="badge rounded-pill px-3 py-2" style={{ background: "rgba(221, 36, 118, 0.1)", color: "#DD2476", fontWeight: "500" }}>Default</span>}
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{addr.name}</h6>
                      <p className="text-muted mb-1" style={{ fontSize: "14px" }}>{addr.phone}</p>
                      <p className="text-dark mb-0" style={{ fontSize: "14px" }}>
                        {addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ""}, <br/>
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      {addr.landmark && <p className="text-muted mt-1 mb-0" style={{ fontSize: "13px" }}><strong>Landmark:</strong> {addr.landmark}</p>}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;