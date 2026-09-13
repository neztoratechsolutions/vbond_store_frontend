import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function ProductCreation() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  // State for dropdowns
  const [subCategories, setSubCategories] = useState([]);
  const [units, setUnits] = useState([]);

  // State for Products Table
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // State for View Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    subcategory_id: "", unit_id: "", name: "", slug: "", description: "", sku: "",
    price: "", mrp: "", discount_price: "", tax_percentage: "0",
    is_available: true, is_active: true, display_order: "0",
  });

  // 1. Fetch SubCategories, Units, and Products on mount
  useEffect(() => {
    fetchSubCategories();
    fetchUnits();
    fetchProducts();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/subcategories/`, {
        headers: { "accept": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.subcategories) {
        setSubCategories(data.subcategories);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/units`, {
        headers: { "accept": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUnits(data);
      }
    } catch (err) {
      console.error("Error fetching units:", err);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/products`, {
        headers: { "accept": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setEditingProductId(null);
    setFormData({
      subcategory_id: "", unit_id: "", name: "", slug: "", description: "", sku: "",
      price: "", mrp: "", discount_price: "", tax_percentage: "0",
      is_available: true, is_active: true, display_order: "0",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProductId(product.id);
    setFormData({
      subcategory_id: product.subcategory_id,
      unit_id: product.unit_id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      sku: product.sku,
      price: product.price,
      mrp: product.mrp || "",
      discount_price: product.discount_price || "",
      tax_percentage: product.tax_percentage || "0",
      is_available: product.is_available,
      is_active: product.is_active,
      display_order: product.display_order || "0",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeViewModal = () => setIsViewModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFormData({ ...formData, name: name, slug: slug });
  };

  // 2. Handle Create & Update via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      subcategory_id: parseInt(formData.subcategory_id),
      unit_id: parseInt(formData.unit_id),
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      sku: formData.sku,
      price: parseFloat(formData.price),
      mrp: formData.mrp ? parseFloat(formData.mrp) : null,
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      tax_percentage: parseFloat(formData.tax_percentage) || 0,
      is_available: formData.is_available,
      is_active: formData.is_active,
      display_order: parseInt(formData.display_order) || 0
    };

    try {
      if (editingProductId) {
        const res = await fetch(`${API}/products/${editingProductId}`, {
          method: "PUT",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const updatedProduct = await res.json();
          setProducts(products.map(p => (p.id === editingProductId ? updatedProduct : p)));
          closeModal();
          Swal.fire({ icon: 'success', title: 'Updated!', text: 'Product has been updated.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
        } else {
          const errData = await res.json();
          Swal.fire({ icon: 'error', title: 'Failed', text: errData.detail || 'Failed to update product.', confirmButtonColor: '#DD2476' });
        }
      } else {
        const res = await fetch(`${API}/products`, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const newProduct = await res.json();
          setProducts([...products, newProduct]);
          closeModal();
          Swal.fire({ icon: 'success', title: 'Created!', text: 'Product has been created.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
        } else {
          const errData = await res.json();
          Swal.fire({ icon: 'error', title: 'Failed', text: errData.detail || 'Failed to create product.', confirmButtonColor: '#DD2476' });
        }
      }
    } catch (err) {
      console.error("Error saving product:", err);
      Swal.fire({ icon: 'error', title: 'Server Error', text: 'Server error while saving.', confirmButtonColor: '#DD2476' });
    }
  };

  // 3. Handle Delete via API with SweetAlert
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD2476',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Deleting...', didOpen: () => Swal.showLoading() });
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API}/products/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });

          if (res.ok) {
            setProducts(products.filter(p => p.id !== id));
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Product has been deleted.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
          } else {
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to delete product.', confirmButtonColor: '#DD2476' });
          }
        } catch (err) {
          console.error("Error deleting product:", err);
          Swal.fire({ icon: 'error', title: 'Server Error', text: 'Server error while deleting.', confirmButtonColor: '#DD2476' });
        }
      }
    });
  };

  // Helper to get Unit name
  const getUnitName = (id) => {
    const unit = units.find(u => u.id === id);
    return unit ? unit.name : `ID: ${id}`;
  };

  // Reusable styles
  const inputStyle = { padding: "14px", borderRadius: "10px", border: "1px solid #e9ecef", backgroundColor: "#f8f9fa", fontSize: "15px" };
  const labelStyle = { fontSize: "14px", fontWeight: "500", color: "#6c757d", marginBottom: "8px", display: "block" };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Product Master</h3>
        <button 
          className="btn text-white fw-bold d-flex align-items-center px-4 py-2"
          style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}
          onClick={openModal}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted">Loading products...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    <th style={{ width: "50px" }} className="text-muted fw-medium">#</th>
                    <th className="text-muted fw-medium">Product Name</th>
                    <th className="text-muted fw-medium">Category</th>
                    <th className="text-muted fw-medium">Sub Category</th>
                    <th className="text-muted fw-medium">Unit</th>
                    <th className="text-muted fw-medium">Price (₹)</th>
                    <th className="text-muted fw-medium">Status</th>
                    <th style={{ width: "120px" }} className="text-muted fw-medium text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                        <td className="text-muted">{prod.id}</td>
                        <td className="fw-bold text-dark">{prod.name}</td>
                        <td className="text-muted">{prod.subcategory?.category?.name || "-"}</td>
                        <td className="text-muted">{prod.subcategory?.name || "-"}</td>
                        <td className="text-muted">{getUnitName(prod.unit_id)}</td>
                        <td className="text-success fw-bold">₹{prod.price}</td>
                        <td>
                          <span className="badge rounded-pill px-3 py-2" style={{ background: prod.is_active ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: prod.is_active ? "#28a745" : "#6c757d", fontWeight: "500" }}>
                            {prod.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end align-items-center">
                            {/* View Button */}
                            <button className="btn btn-sm btn-link text-info p-1 me-2" onClick={() => openViewModal(prod)} title="View Details">
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            {/* Edit Button */}
                            <button className="btn btn-sm btn-link text-primary p-1 me-2" onClick={() => openEditModal(prod)} title="Edit">
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            {/* Delete Button */}
                            <button className="btn btn-sm btn-link text-danger p-1" onClick={() => handleDelete(prod.id)} title="Delete">
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-5">No products found. Click "Add Product" to create one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL FOR VIEWING ALL PRODUCT DETAILS      */}
      {/* ========================================== */}
      {isViewModalOpen && viewingProduct && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="modal-content-custom" style={{ background: "#ffffff", width: "100%", maxWidth: "800px", borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom sticky-top bg-white rounded-top" style={{ zIndex: 10 }}>
              <div>
                <h5 className="fw-bold text-dark mb-0">Product Details</h5>
                <span className="text-muted" style={{ fontSize: "14px" }}>ID: {viewingProduct.id}</span>
              </div>
              <button className="btn btn-link p-0 text-muted" onClick={closeViewModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="p-4">
              
              <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>PRODUCT NAME</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingProduct.name}</h6>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>SKU</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingProduct.sku}</h6>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>PARENT CATEGORY</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingProduct.subcategory?.category?.name || "N/A"}</h6>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>SUB CATEGORY</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingProduct.subcategory?.name || "N/A"}</h6>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>UNIT</p>
                    <h6 className="fw-bold text-dark mb-0">{getUnitName(viewingProduct.unit_id)}</h6>
                  </div>
                  <div className="col-md-12">
                    <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>DESCRIPTION</p>
                    <h6 className="text-dark mb-0">{viewingProduct.description || "N/A"}</h6>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0 me-3">Pricing & Tax</h6>
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>Price (₹)</p>
                    <h6 className="fw-bold text-success mb-0">₹{viewingProduct.price}</h6>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>MRP (₹)</p>
                    <h6 className="fw-bold text-dark mb-0">₹{viewingProduct.mrp || "0.00"}</h6>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>Discount (₹)</p>
                    <h6 className="fw-bold text-danger mb-0">₹{viewingProduct.discount_price || "0.00"}</h6>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 rounded-3 text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>Tax (%)</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingProduct.tax_percentage}%</h6>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0 me-3">Status & Meta</h6>
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
              </div>

              <div className="row g-3">
                <div className="col-md-4 d-flex align-items-center">
                  <span className="badge rounded-pill px-3 py-2 w-100" style={{ background: viewingProduct.is_active ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: viewingProduct.is_active ? "#28a745" : "#6c757d", fontWeight: "500" }}>
                    {viewingProduct.is_active ? "🟢 Active" : "⚫ Inactive"}
                  </span>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <span className="badge rounded-pill px-3 py-2 w-100" style={{ background: viewingProduct.is_available ? "rgba(0, 123, 255, 0.1)" : "rgba(108, 117, 125, 0.1)", color: viewingProduct.is_available ? "#007bff" : "#6c757d", fontWeight: "500" }}>
                    {viewingProduct.is_available ? "🔵 Available" : "⚫ Unavailable"}
                  </span>
                </div>
                <div className="col-md-4">
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>DISPLAY ORDER</p>
                  <h6 className="fw-bold text-dark mb-0">{viewingProduct.display_order}</h6>
                </div>
                <div className="col-md-6 mt-3">
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>SLUG</p>
                  <h6 className="text-muted mb-0" style={{ fontSize: "14px", wordBreak: "break-all" }}>{viewingProduct.slug}</h6>
                </div>
                <div className="col-md-3 mt-3">
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>CREATED AT</p>
                  <h6 className="text-dark mb-0" style={{ fontSize: "14px" }}>{new Date(viewingProduct.created_at).toLocaleString()}</h6>
                </div>
                <div className="col-md-3 mt-3">
                  <p className="text-muted mb-1" style={{ fontSize: "12px", fontWeight: "500" }}>UPDATED AT</p>
                  <h6 className="text-dark mb-0" style={{ fontSize: "14px" }}>{new Date(viewingProduct.updated_at).toLocaleString()}</h6>
                </div>
              </div>

            </div>

            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL FOR PRODUCT CREATION / EDIT FORM     */}
      {/* ========================================== */}
      {isModalOpen && (
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
              <h5 className="fw-bold text-dark mb-0">
                {editingProductId ? "Edit Product" : "Create New Product"}
              </h5>
              <button className="btn btn-link p-0 text-muted" onClick={closeModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body (Scrollable Form) */}
            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="p-4">
              <form onSubmit={handleSubmit} id="productForm">
                
                {/* Row 1: Sub Category & Unit */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label" style={labelStyle}>Sub Category *</label>
                    <select className="form-select" name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} style={inputStyle} required>
                      <option value="">Select Sub Category</option>
                      {subCategories.map((sub) => (<option key={sub.id} value={sub.id}>{sub.name}</option>))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={labelStyle}>Unit *</label>
                    <select className="form-select" name="unit_id" value={formData.unit_id} onChange={handleChange} style={inputStyle} required>
                      <option value="">Select Unit</option>
                      {units.map((unit) => (<option key={unit.id} value={unit.id}>{unit.name}</option>))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Name & SKU */}
                <div className="row g-4 mb-4">
                  <div className="col-md-8">
                    <label className="form-label" style={labelStyle}>Product Name *</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleNameChange} style={inputStyle} placeholder="e.g. Apple iPhone 15 Pro" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>SKU *</label>
                    <input type="text" className="form-control" name="sku" value={formData.sku} onChange={handleChange} style={inputStyle} placeholder="e.g. IPH15PRO256" required />
                  </div>
                </div>

                {/* Row 3: Slug & Display Order */}
                <div className="row g-4 mb-4">
                  <div className="col-md-8">
                    <label className="form-label" style={labelStyle}>Slug (Auto-generated)</label>
                    <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} style={{...inputStyle, backgroundColor: "#e9ecef"}} placeholder="auto-generated-slug" readOnly />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>Display Order</label>
                    <input type="number" className="form-control" name="display_order" value={formData.display_order} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                {/* Row 4: Description */}
                <div className="mb-4">
                  <label className="form-label" style={labelStyle}>Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} style={{...inputStyle, minHeight: "100px"}} placeholder="Enter product description..."></textarea>
                </div>

                <div className="d-flex align-items-center mb-4 mt-5">
                  <h6 className="fw-bold text-dark mb-0 me-3">Pricing & Tax</h6>
                  <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
                </div>

                {/* Row 5: Price, MRP, Discount, Tax */}
                <div className="row g-4 mb-5">
                  <div className="col-md-3">
                    <label className="form-label" style={labelStyle}>Price (₹) *</label>
                    <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} style={inputStyle} placeholder="999.99" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" style={labelStyle}>MRP (₹)</label>
                    <input type="number" step="0.01" className="form-control" name="mrp" value={formData.mrp} onChange={handleChange} style={inputStyle} placeholder="1099.99" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" style={labelStyle}>Discount Price (₹)</label>
                    <input type="number" step="0.01" className="form-control" name="discount_price" value={formData.discount_price} onChange={handleChange} style={inputStyle} placeholder="899.99" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" style={labelStyle}>Tax (%)</label>
                    <input type="number" step="0.01" className="form-control" name="tax_percentage" value={formData.tax_percentage} onChange={handleChange} style={inputStyle} placeholder="5.00" />
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4 mt-5">
                  <h6 className="fw-bold text-dark mb-0 me-3">Status & Visibility</h6>
                  <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch me-3">
                      <input className="form-check-input" type="checkbox" role="switch" id="is_available" name="is_available" checked={formData.is_available} onChange={handleChange} style={{ width: "2.5em", height: "1.5em", cursor: "pointer" }} />
                    </div>
                    <label className="form-check-label" htmlFor="is_available" style={{ fontWeight: "500", color: "#333" }}>Available for Sale</label>
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch me-3">
                      <input className="form-check-input" type="checkbox" role="switch" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} style={{ width: "2.5em", height: "1.5em", cursor: "pointer" }} />
                    </div>
                    <label className="form-check-label" htmlFor="is_active" style={{ fontWeight: "500", color: "#333" }}>Active (Show on Storefront)</label>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white me-2 px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" form="productForm" className="btn text-white fw-bold px-4 py-2" style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}>
                {editingProductId ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCreation;