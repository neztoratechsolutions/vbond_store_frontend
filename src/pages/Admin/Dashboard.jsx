import React from 'react';

function Dashboard() {
  return (
    <div className="container-fluid">
      <h3 className="fw-bold text-dark mb-4">Dashboard Overview</h3>
      
      <div className="row g-4">
        {/* Cards */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Sales</p>
                <h4 className="fw-bold mb-0">$45,200</h4>
              </div>
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>📈</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Orders</p>
                <h4 className="fw-bold mb-0">1,245</h4>
              </div>
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>🛒</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">New Customers</p>
                <h4 className="fw-bold mb-0">350</h4>
              </div>
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>👥</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mt-4 p-4">
        <h5 className="fw-bold mb-3">Recent Activity</h5>
        <p className="text-muted">We will put the charts and tables here soon!</p>
      </div>

    </div>
  );
}

export default Dashboard;