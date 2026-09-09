import React, { useState } from "react";

function ProductCreation() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  // Dummy data for dropdowns
  const subCategories = [
    { id: 1, name: "Smartphones" },
    { id: 2, name: "Laptops" },
    { id: 3, name: "Men's Wear" },
  ];

  const units = [
    { id: 1, name: "Pieces (Pc)" },
    { id: 2, name: "Kilograms (Kg)" },
    { id: 3, name: "Liters (L)" },
  ];

  // State for Products Table (Now holds full data for editing)
  const [products, setProducts] = useState([
    { id: 1, subcategory_id: 1, unit_id: 1, name: "Apple iPhone 15 Pro", slug: "apple-iphone-15-pro", description: "Latest Apple smartphone", sku: "IPH15PRO256", price: "999.00", mrp: "1099.00", discount_price: "950.00", tax_percentage: "18.00", is_available: true, is_active: true, display_order: "1" },
    { id: 2, subcategory_id: 2, unit_id: 1, name: "Dell XPS 13", slug: "dell-xps-13", description: "UltraBook laptop", sku: "DELLXPS13", price: "1200.00", mrp: "1300.00", discount_price: "1150.00", tax_percentage: "18.00", is_available: true, is_active: true, display_order: "2" },
  ]);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    subcategory_id: "", unit_id: "", name: "", slug: "", description: "", sku: "",
    price: "", mrp: "", discount_price: "", tax_percentage: "0",
    is_available: true, is_active: true, display_order: "0",
  });

  // Open Modal for Adding New
  const openModal = () => {
    setEditingProductId(null);
    setFormData({
      subcategory_id: "", unit_id: "", name: "", slug: "", description: "", sku: "",
      price: "", mrp: "", discount_price: "", tax_percentage: "0",
      is_available: true, is_active: true, display_order: "0",
    });
    setIsModalOpen(true);
  };

  // Open Modal for Editing Existing
  const openEditModal = (product) => {
    setEditingProductId(product.id);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFormData({ ...formData, name: name, slug: slug });
  };

  // Handle Form Submit -> Add or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProductId) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProductId ? { ...formData, id: editingProductId, price: parseFloat(formData.price).toFixed(2) } : p
      ));
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: products.length + 1,
        price: parseFloat(formData.price).toFixed(2),
      };
      setProducts([...products, newProduct]);
    }
    closeModal();
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
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ width: "80px" }} className="text-muted fw-medium">#</th>
                  <th className="text-muted fw-medium">Product Name</th>
                  <th style={{ width: "200px" }} className="text-muted fw-medium">SKU</th>
                  <th style={{ width: "150px" }} className="text-muted fw-medium">Price (₹)</th>
                  <th style={{ width: "150px" }} className="text-muted fw-medium">Status</th>
                  <th style={{ width: "120px" }} className="text-muted fw-medium text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td className="text-muted">{prod.id}</td>
                    <td className="fw-bold text-dark">{prod.name}</td>
                    <td><span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>{prod.sku}</span></td>
                    <td className="text-success fw-bold">₹{prod.price}</td>
                    <td>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: prod.is_active ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: prod.is_active ? "#28a745" : "#6c757d", fontWeight: "500" }}>
                        {prod.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Edit Button */}
                        <button className="btn btn-sm btn-link text-primary p-1 me-2" onClick={() => openEditModal(prod)}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        {/* Delete Button */}
                        <button className="btn btn-sm btn-link text-danger p-1">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CUSTOM MODAL FOR PRODUCT CREATION / EDIT FORM */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", 
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div className="modal-content-custom" style={{
            background: "#ffffff", width: "100%", maxWidth: "850px", 
            borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
          }}>
            
            {/* Modal Header -> Changes Title based on Add/Edit */}
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

            {/* Modal Footer -> Changes Button Text based on Add/Edit */}
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