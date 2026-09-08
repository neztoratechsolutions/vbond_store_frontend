import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "admin123") {
        const dummyUser = { id: 1, name: "Admin User", role: "super_admin" };
        const dummyToken = "dummy_jwt_token_12345";
        
        localStorage.setItem("user", JSON.stringify(dummyUser));
        localStorage.setItem("token", dummyToken);
        
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Try admin@gmail.com / admin123");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center p-3"
      style={{ background: "#ffffff", minHeight: "100vh" }}
    >
      <div 
        className="row w-100 position-relative" 
        style={{ 
          maxWidth: "950px", 
          borderRadius: "24px", 
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(221, 36, 118, 0.15)",
          border: "none" 
        }}
      >
        
        {/* LEFT SIDE - PREMIUM RED GRADIENT */}
        <div 
          className="col-md-6 d-none d-md-flex flex-column justify-content-between text-white p-5 position-relative"
          style={{ 
            background: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",
            minHeight: "600px",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}></div>
          <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>

          <div className="d-flex align-items-center mb-4 position-relative" style={{ zIndex: "2" }}>
            <h4 className="fw-bold mb-0 d-flex align-items-center" style={{ fontSize: "1.5rem" }}>
              <span style={{ marginRight: "10px", fontSize: "1.8rem" }}>🏬</span> Vbond Store
            </h4>
          </div>

          <div className="position-relative" style={{ zIndex: "2" }}>
            <h2 
              className="fw-bold mb-3" 
              style={{ 
                lineHeight: "1.3", 
                fontSize: "2.2rem",
                whiteSpace: "nowrap" 
              }}
            >
              Manage your<br/>e-commerce empire<br/>with ease.
            </h2>
            <p className="text-white-75" style={{ fontSize: "1.05rem", maxWidth: "350px" }}>
              Welcome to the admin dashboard. Sign in to manage products, track orders, and analyze your store's performance.
            </p>
          </div>

          <div className="position-relative" style={{ zIndex: "2" }}>
            <p className="mb-0 text-white-50" style={{ fontSize: "14px" }}>
              © 2026 Vbond Store. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - CLEAN WHITE LOGIN FORM */}
        <div className="col-md-6 bg-white p-5 d-flex align-items-center">
          <div className="w-100">
            
            <div className="d-md-none text-center mb-5">
              <h4 className="fw-bold d-inline-block px-4 py-2 rounded-pill text-white shadow-sm" style={{ background: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)" }}>
                🏬 Vbond Store
              </h4>
            </div>

            <div className="mb-5">
              <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}>
                Admin Login
              </h5>
              <p className="text-muted" style={{ fontSize: "15px", marginBottom: "0" }}>
                Enter your credentials to access the dashboard.
              </p>
            </div>

            {error && (
              <div className="alert py-2 mb-4" style={{ fontSize: "14px", borderRadius: "10px", border: "none", backgroundColor: "#fff0f0", color: "#dd2476" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              
              <div className="mb-4">
                <label className="form-label text-muted fw-medium" style={{ fontSize: "14px", marginBottom: "8px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#ffffff", border: "1px solid #e9ecef", fontSize: "15px" }}
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label text-muted fw-medium mb-0" style={{ fontSize: "14px" }}>
                    Password
                  </label>
                  <a href="#" className="fw-medium" style={{ fontSize: "13px", textDecoration: "none", color: "#dd2476" }}>
                    Forgot password?
                  </a>
                </div>
                <div className="input-group" style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "#ffffff" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    style={{ padding: "16px", borderRadius: "12px 0 0 12px", backgroundColor: "#ffffff", border: "1px solid #e9ecef", borderRight: "none", fontSize: "15px" }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span 
                    className="input-group-text d-flex align-items-center justify-content-center" 
                    style={{ cursor: "pointer", borderRadius: "0 12px 12px 0", backgroundColor: "#ffffff", border: "1px solid #e9ecef", borderLeft: "none", color: "#888", padding: "0 20px", width: "56px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              <div className="form-check mb-4 mt-3 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember_me"
                  style={{ cursor: "pointer", width: "18px", height: "18px", marginRight: "10px", marginTop: "0" }}
                />
                <label className="form-check-label text-muted" htmlFor="remember_me" style={{ fontSize: "14px", cursor: "pointer" }}>
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-bold"
                style={{
                  background: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                  boxShadow: "0 10px 20px rgba(221, 36, 118, 0.3)"
                }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in to Dashboard"}
              </button>

            </form>

            <p className="text-center text-muted mt-4" style={{ fontSize: "13px" }}>
              <span className="badge bg-light text-dark border">Demo: admin@gmail.com / admin123</span>
            </p>

            <p className="text-center text-muted mt-3" style={{ fontSize: "14px" }}>
              Not an admin? <a href="#" className="fw-medium" style={{ textDecoration: "none", color: "#dd2476" }}>Go to Store Front</a>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;