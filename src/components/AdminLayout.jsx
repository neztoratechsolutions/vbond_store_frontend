import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);
  const [isMastersOpen, setIsMastersOpen] = useState(true);
  const navigate = useNavigate();

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Vibrant Red to Pink Gradient for Active states
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /></svg> 
    },
    { 
      name: "Orders", 
      path: "/orders", 
      icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> 
    },
    { 
      name: "Customers", 
      path: "/customers", 
      icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg> 
    },
  ];

  const masterSubItems = [
    { name: "Category", path: "/masters/category" },
    { name: "Sub Category", path: "/masters/sub-category" },
     { name: "Unit Master", path: "/masters/unit" },
    { name: "Product Creation", path: "/masters/product-creation" },
    { name: "Product Images", path: "/masters/product-images" },
    //  { name: "Product Variants", path: "/masters/product-variants" }
  ];

  return (
    <div className="wrapper" style={{ minHeight: "100vh", backgroundColor: "#f4f6fb" }}>
      
      {/* SIDEBAR - ULTRA LIGHT PASTEL GRADIENT */}
      <aside 
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        style={{
          // Very soft, light pinkish-white gradient
          background: "linear-gradient(195deg, #ffffff 0%, #fff5f7 100%)",
          width: "270px",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1050,
          transition: "transform 0.3s ease-in-out",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: "5px 0 25px rgba(221, 36, 118, 0.05)", // Very soft shadow
          borderRight: "1px solid #fce7f3"
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 d-flex align-items-center justify-content-between border-bottom" style={{ borderColor: "#fce7f3 !important" }}>
          <h5 className="fw-bold mb-0 d-flex align-items-center" style={{ color: "#1a1a1a" }}>
            <span className="d-flex align-items-center justify-content-center me-2" style={{ width: "38px", height: "38px", borderRadius: "12px", background: redGradient }}>
              <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Vbond Store
          </h5>
          <button className="btn btn-sm p-0 d-lg-none" style={{ color: "#9ca3af" }} onClick={() => setIsSidebarOpen(false)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 px-3 sidebar-scroll" style={{ height: "calc(100vh - 150px)", overflowY: "auto" }}>
          
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              onClick={() => window.innerWidth < 992 && setIsSidebarOpen(false)}
              className={({ isActive }) => 
                `d-flex align-items-center text-decoration-none mb-2 px-3 py-3 rounded-3 transition-all ${
                  isActive ? "text-white shadow-sm fw-bold" : "text-secondary hover-bg-pink"
                }`
              }
              style={({ isActive }) => isActive ? { background: redGradient } : {}}
            >
              <span className="me-3">{item.icon}</span>
              <span style={{ fontSize: "15px" }}>{item.name}</span>
            </NavLink>
          ))}

          {/* MASTERS DROPDOWN */}
          <button 
            onClick={() => setIsMastersOpen(!isMastersOpen)}
            className="w-100 d-flex align-items-center text-decoration-none mb-2 px-3 py-3 rounded-3 transition-all text-secondary hover-bg-pink border-0 bg-transparent"
          >
            <span className="me-3">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </span>
            <span style={{ fontSize: "15px" }} className="me-auto text-start fw-medium text-dark">Masters</span>
            <svg 
              className={`transition-transform ${isMastersOpen ? "rotate-180" : ""}`} 
              width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Masters Submenu (Clean Nested Box) */}
          <div className={`collapse ${isMastersOpen ? "show" : ""}`}>
            <div className="ms-3 mt-1 mb-3 p-2" style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #fce7f3" }}>
              {masterSubItems.map((sub) => (
                <NavLink 
                  key={sub.name} 
                  to={sub.path} 
                  onClick={() => window.innerWidth < 992 && setIsSidebarOpen(false)}
                  className={({ isActive }) => 
                    `d-flex align-items-center text-decoration-none py-2 px-3 rounded-3 transition-all ${
                      isActive ? "bg-pink-soft text-danger fw-bold" : "text-muted hover-bg-pink"
                    }`
                  }
                >
                  <span className="me-3" style={{ fontSize: "8px" }}>◆</span>
                  <span style={{ fontSize: "14px" }}>{sub.name}</span>
                </NavLink>
              ))}
            </div>
          </div>

        </nav>

        {/* Logout Button Fixed at Bottom */}
        <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top" style={{ borderColor: "#fce7f3 !important" }}>
          <button 
            onClick={handleLogout}
            className="btn w-100 d-flex align-items-center justify-content-center rounded-3 py-3"
            style={{ background: "#ffffff", color: "#DD2476", fontWeight: "600", border: "1px solid #fce7f3" }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && window.innerWidth < 992 && (
        <div 
          className="d-lg-none" 
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div 
        className="content-area"
        style={{ transition: "margin-left 0.3s ease", marginLeft: isSidebarOpen && window.innerWidth >= 992 ? "270px" : "0" }}
      >
        {/* NAVBAR */}
        <header 
          className="navbar bg-white shadow-sm px-4 py-3 sticky-top d-flex align-items-center"
          style={{ borderBottom: "1px solid #e9ecef", zIndex: 1030 }}
        >
          <button className="btn btn-link p-0 text-dark me-3" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Admin Dashboard</h5>

          <div className="ms-auto d-flex align-items-center">
            <button className="btn btn-link text-dark p-2 me-2">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <div className="dropdown">
              <button className="btn d-flex align-items-center p-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white me-2"
                  style={{ width: "40px", height: "40px", background: redGradient, fontWeight: "bold" }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="text-start d-none d-md-block">
                  <div className="fw-bold text-dark" style={{ fontSize: "14px", lineHeight: "1" }}>{user.name || "Admin User"}</div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>Super Admin</div>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end mt-2 shadow border-0 rounded-3">
                <li><a className="dropdown-item py-2" href="#">Profile</a></li>
                <li><a className="dropdown-item py-2" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </div>
        </header>

        <main className="p-4">
          <Outlet /> 
        </main>
      </div>

      <style>{`
        .hover-bg-pink:hover {
          background-color: #fff0f3 !important; /* Very soft pink hover */
          color: #DD2476 !important;
        }
        .bg-pink-soft {
          background-color: #fff0f3 !important;
        }
        .sidebar-scroll::-webkit-scrollbar { width: 5px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #fce7f3; border-radius: 10px; }
        .transition-all { transition: all 0.2s ease; }
        .transition-transform { transition: transform 0.3s ease; }
      `}</style>
    </div>
  );
}

export default AdminLayout;