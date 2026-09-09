import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";
  const navigate = useNavigate();

  // Dummy Data for Dashboard
  const stats = [
    { title: "Total Revenue", value: "₹4,50,320", change: "+12.5%", icon: "💰", isPrimary: true },
    { title: "Total Orders", value: "1,245", change: "+3.2%", icon: "🛒", isPrimary: false },
    { title: "Total Customers", value: "8,920", change: "+5.1%", icon: "👥", isPrimary: false },
    { title: "Total Products", value: "340", change: "-1.0%", icon: "📦", isPrimary: false }
  ];

  const recentOrders = [
    { id: "ORD-1024", customer: "John Doe", date: "2024-05-18", amount: "₹1,170", status: "PENDING" },
    { id: "ORD-1023", customer: "Sarah Connor", date: "2024-05-18", amount: "₹1,650", status: "PAID" },
    { id: "ORD-1022", customer: "Michael Smith", date: "2024-05-17", amount: "₹3,450", status: "SHIPPED" },
    { id: "ORD-1021", customer: "Jessica Jones", date: "2024-05-17", amount: "₹850", status: "DELIVERED" },
    { id: "ORD-1020", customer: "Bruce Wayne", date: "2024-05-16", amount: "₹12,400", status: "CANCELLED" }
  ];

  const topProducts = [
    { name: "Apple iPhone 15 Pro", sold: 320, percentage: 85 },
    { name: "Dell XPS 13 Laptop", sold: 210, percentage: 65 },
    { name: "Samsung Galaxy S24", sold: 180, percentage: 50 },
    { name: "Wireless Mouse", sold: 90, percentage: 30 }
  ];

  const getStatusBadge = (status) => {
    let bg = "rgba(108, 117, 125, 0.1)", color = "#6c757d";
    if (status === "PAID" || status === "DELIVERED") { bg = "rgba(40, 167, 69, 0.1)"; color = "#28a745"; }
    if (status === "PENDING") { bg = "rgba(255, 193, 7, 0.1)"; color = "#ffc107"; }
    if (status === "SHIPPED") { bg = "rgba(0, 123, 255, 0.1)"; color = "#007bff"; }
    if (status === "CANCELLED") { bg = "rgba(220, 53, 69, 0.1)"; color = "#dc3545"; }
    return <span className="badge rounded-pill px-3 py-2" style={{ background: bg, color: color, fontWeight: "500", fontSize: "12px" }}>{status}</span>;
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Dashboard Overview</h3>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>Welcome back! Here's what's happening with your store today.</p>
        </div>
        {/* <button className="btn text-white fw-bold d-flex align-items-center px-4 py-2" style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add New Product
        </button> */}
      </div>

      {/* Summary Cards Row */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div className="col-md-6 col-xl-3" key={index}>
            <div 
              className="card border-0 shadow-sm rounded-4 h-100"
              style={stat.isPrimary ? { background: redGradient, color: "white" } : { backgroundColor: "#ffffff" }}
            >
              <div className="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1" style={{ fontSize: "14px", fontWeight: "500", color: stat.isPrimary ? "rgba(255,255,255,0.8)" : "#6c757d" }}>{stat.title}</p>
                  <h4 className="fw-bold mb-1">{stat.value}</h4>
                  <p className="mb-0" style={{ fontSize: "12px", color: stat.isPrimary ? "rgba(255,255,255,0.9)" : (stat.change.startsWith("+") ? "#28a745" : "#dc3545") }}>
                    {stat.change} this month
                  </p>
                </div>
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ 
                    width: "50px", 
                    height: "50px", 
                    fontSize: "24px",
                    background: stat.isPrimary ? "rgba(255,255,255,0.2)" : "rgba(221, 36, 118, 0.1)"
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Orders Table (Left Side - 2/3 width) */}
        <div className="col-xl-8 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0">Recent Orders</h5>
              <button className="btn btn-sm btn-link text-danger text-decoration-none" style={{ fontWeight: "500" }} onClick={() => navigate("/orders")}>
                View All →
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                      <th className="text-muted fw-medium ps-4">Order ID</th>
                      <th className="text-muted fw-medium">Customer</th>
                      <th className="text-muted fw-medium">Amount</th>
                      <th className="text-muted fw-medium">Status</th>
                      <th className="text-muted fw-medium pe-4 text-end">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                        <td className="fw-bold text-dark ps-4">{order.id}</td>
                        <td className="text-dark">{order.customer}</td>
                        <td className="fw-bold text-success">{order.amount}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="text-muted text-end pe-4">{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products (Right Side - 1/3 width) */}
        <div className="col-xl-4 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 p-4">
              <h5 className="fw-bold text-dark mb-0">Top Selling Products</h5>
            </div>
            <div className="card-body p-4 pt-0">
              {topProducts.map((product, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium text-dark" style={{ fontSize: "15px" }}>{product.name}</span>
                    <span className="text-muted" style={{ fontSize: "13px" }}>{product.sold} sold</span>
                  </div>
                  <div className="progress" style={{ height: "8px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${product.percentage}%`, background: redGradient, borderRadius: "10px" }} 
                      aria-valuenow={product.percentage} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;