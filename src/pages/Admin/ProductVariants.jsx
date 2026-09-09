import React, { useState } from "react";

function ProductVariants() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  const products = [
    { id: 1, name: "Apple iPhone 15 Pro" },
    { id: 2, name: "Dell XPS 13" },
    { id: 3, name: "Samsung Galaxy S24" },
  ];

  const [variants, setVariants] = useState([
    { id: 1, product_id: 1, product_name: "Apple iPhone 15 Pro", name: "128GB Black", quantity: "50.00", sku: "IP15-128-BLK", display_order: "1", is_available: true, is_active: true },
    { id: 2, product_id: 1, product_name: "Apple iPhone 15 Pro", name: "256GB Blue", quantity: "30.00", sku: "IP15-256-BLU", display_order: "2", is_available: true, is_active: false },
    { id: 3, product_id: 2, product_name: "Dell XPS 13", name: "16GB RAM", quantity: "15.00", sku: "XPS13-16", display_order: "1", is_available: false, is_active: true },
  ]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);
  
  // View Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingVariant, setViewingVariant] = useState(null);

  // State for ADD MULTIPLE mode
  const [selectedProductId, setSelectedProductId] = useState("");
  const [variantInputs, setVariantInputs] = useState([
    { tempId: Date.now(), name: "", quantity: "", sku: "", display_order: "0", is_available: true, is_active: true }
  ]);

  // State for EDIT SINGLE mode
  const [editFormData, setEditFormData] = useState({});

  const inputStyle = { padding: "14px", borderRadius: "10px", border: "1px solid #e9ecef", backgroundColor: "#f8f9fa", fontSize: "15px" };
  const labelStyle = { fontSize: "14px", fontWeight: "500", color: "#6c757d", marginBottom: "8px", display: "block" };

  const openAddModal = () => {
    setEditingVariantId(null);
    setSelectedProductId("");
    setVariantInputs([{ tempId: Date.now(), name: "", quantity: "", sku: "", display_order: "0", is_available: true, is_active: true }]);
    setIsModalOpen(true);
  };

  const openEditModal = (variant) => {
    setEditingVariantId(variant.id);
    setEditFormData({ ...variant });
    setIsModalOpen(true);
  };

  const openViewModal = (variant) => {
    setViewingVariant(variant);
    setIsViewModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeViewModal = () => setIsViewModalOpen(false);

  // Handlers for ADD MULTIPLE mode
  const handleAddFieldChange = (tempId, e) => {
    const { name, value, type, checked } = e.target;
    setVariantInputs(variantInputs.map(v => 
      v.tempId === tempId ? { ...v, [name]: type === "checkbox" ? checked : value } : v
    ));
  };

  const addVariantField = () => {
    setVariantInputs([...variantInputs, { tempId: Date.now(), name: "", quantity: "", sku: "", display_order: "0", is_available: true, is_active: true }]);
  };

  const removeVariantField = (tempId) => {
    setVariantInputs(variantInputs.filter(v => v.tempId !== tempId));
  };

  // Handler for EDIT SINGLE mode
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({ ...editFormData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVariantId) {
      const selectedProduct = products.find(p => p.id === parseInt(editFormData.product_id));
      setVariants(variants.map(v => 
        v.id === editingVariantId ? { ...editFormData, product_name: selectedProduct?.name } : v
      ));
    } else {
      if (!selectedProductId) {
        alert("Please select a parent product.");
        return;
      }
      const selectedProduct = products.find(p => p.id === parseInt(selectedProductId));
      const validVariants = variantInputs.filter(v => v.name.trim() !== "" && v.quantity.trim() !== "");
      
      const newVariants = validVariants.map((v, index) => ({
        id: variants.length + index + 1,
        product_id: selectedProductId,
        product_name: selectedProduct?.name || "Unknown",
        name: v.name,
        quantity: v.quantity,
        sku: v.sku,
        display_order: v.display_order || "0",
        is_available: v.is_available,
        is_active: v.is_active
      }));

      setVariants([...variants, ...newVariants]);
    }
    closeModal();
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Product Variants</h3>
        <button 
          className="btn text-white fw-bold d-flex align-items-center px-4 py-2"
          style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}
          onClick={openAddModal}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Variants
        </button>
      </div>

      {/* Variants Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ width: "80px" }} className="text-muted fw-medium">#</th>
                  <th>Product Name</th>
                  <th>Variant Name</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td className="text-muted">{v.id}</td>
                    <td className="fw-bold text-dark">{v.product_name}</td>
                    <td className="text-dark">{v.name}</td>
                    <td><span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>{v.sku || "-"}</span></td>
                    <td className="text-muted">{v.quantity}</td>
                    <td>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: v.is_available ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: v.is_available ? "#28a745" : "#6c757d", fontWeight: "500" }}>
                        {v.is_available ? "In Stock" : "Out"}
                      </span>
                    </td>
                    <td>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: v.is_active ? "rgba(221, 36, 118, 0.1)" : "rgba(108, 117, 125, 0.1)", color: v.is_active ? "#DD2476" : "#6c757d", fontWeight: "500" }}>
                        {v.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end align-items-center">
                        {/* View Button */}
                        <button className="btn btn-sm btn-link text-info p-1 me-2" onClick={() => openViewModal(v)} title="View Details">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {/* Edit Button */}
                        <button className="btn btn-sm btn-link text-primary p-1 me-2" onClick={() => openEditModal(v)} title="Edit">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        {/* Delete Button */}
                        <button className="btn btn-sm btn-link text-danger p-1" title="Delete">
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

      {/* ========================================== */}
      {/* MODAL FOR ADD/EDIT VARIANT (Existing Logic) */}
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
            
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom sticky-top bg-white rounded-top" style={{ zIndex: 10 }}>
              <h5 className="fw-bold text-dark mb-0">
                {editingVariantId ? "Edit Variant" : "Add Multiple Variants"}
              </h5>
              <button className="btn btn-link p-0 text-muted" onClick={closeModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="p-4">
              <form onSubmit={handleSubmit} id="variantForm">
                
                {editingVariantId ? (
                  <>
                    <div className="mb-4">
                      <label className="form-label" style={labelStyle}>Select Product *</label>
                      <select className="form-select" name="product_id" value={editFormData.product_id || ""} onChange={handleEditChange} style={inputStyle} required>
                        <option value="">Choose a product...</option>
                        {products.map((prod) => (<option key={prod.id} value={prod.id}>{prod.name}</option>))}
                      </select>
                    </div>

                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Variant Name *</label>
                        <input type="text" className="form-control" name="name" value={editFormData.name || ""} onChange={handleEditChange} style={inputStyle} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>SKU</label>
                        <input type="text" className="form-control" name="sku" value={editFormData.sku || ""} onChange={handleEditChange} style={inputStyle} />
                      </div>
                    </div>

                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Quantity *</label>
                        <input type="number" step="0.01" className="form-control" name="quantity" value={editFormData.quantity || ""} onChange={handleEditChange} style={inputStyle} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Display Order</label>
                        <input type="number" className="form-control" name="display_order" value={editFormData.display_order || "0"} onChange={handleEditChange} style={inputStyle} />
                      </div>
                    </div>

                    <div className="row g-4 mb-3 mt-4">
                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check form-switch me-3">
                          <input className="form-check-input" type="checkbox" role="switch" id="edit_is_available" name="is_available" checked={editFormData.is_available || false} onChange={handleEditChange} style={{ width: "2.5em", height: "1.5em", cursor: "pointer" }} />
                        </div>
                        <label className="form-check-label" htmlFor="edit_is_available" style={{ fontWeight: "500", color: "#333" }}>Available (In Stock)</label>
                      </div>
                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check form-switch me-3">
                          <input className="form-check-input" type="checkbox" role="switch" id="edit_is_active" name="is_active" checked={editFormData.is_active || false} onChange={handleEditChange} style={{ width: "2.5em", height: "1.5em", cursor: "pointer" }} />
                        </div>
                        <label className="form-check-label" htmlFor="edit_is_active" style={{ fontWeight: "500", color: "#333" }}>Active (Show on Storefront)</label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="form-label" style={labelStyle}>Select Parent Product *</label>
                      <select className="form-select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={inputStyle} required>
                        <option value="">Choose a product to attach variants to...</option>
                        {products.map((prod) => (<option key={prod.id} value={prod.id}>{prod.name}</option>))}
                      </select>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
                      <span className="text-muted mx-3" style={{ fontSize: "13px" }}>VARIANTS</span>
                      <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
                    </div>

                    {variantInputs.map((field, index) => (
                      <div key={field.tempId} className="p-3 mb-3 rounded-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-white text-dark border px-3 py-2" style={{ borderRadius: "8px", fontSize: "12px" }}>Variant {index + 1}</span>
                          {variantInputs.length > 1 && (
                            <button type="button" className="btn btn-sm btn-link text-danger p-1" onClick={() => removeVariantField(field.tempId)}>
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                            </button>
                          )}
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label" style={labelStyle}>Variant Name *</label>
                            <input type="text" className="form-control" name="name" value={field.name} onChange={(e) => handleAddFieldChange(field.tempId, e)} style={inputStyle} placeholder="e.g. 128GB Black" required={index === 0} />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label" style={labelStyle}>SKU</label>
                            <input type="text" className="form-control" name="sku" value={field.sku} onChange={(e) => handleAddFieldChange(field.tempId, e)} style={inputStyle} placeholder="IP15-128" />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label" style={labelStyle}>Quantity *</label>
                            <input type="number" step="0.01" className="form-control" name="quantity" value={field.quantity} onChange={(e) => handleAddFieldChange(field.tempId, e)} style={inputStyle} placeholder="50.00" required={index === 0} />
                          </div>
                        </div>

                        <div className="row g-3 mt-1 align-items-center">
                          <div className="col-md-3">
                            <label className="form-label" style={labelStyle}>Display Order</label>
                            <input type="number" className="form-control" name="display_order" value={field.display_order} onChange={(e) => handleAddFieldChange(field.tempId, e)} style={inputStyle} />
                          </div>
                          <div className="col-md-4 d-flex align-items-center pt-4">
                            <div className="form-check form-switch me-2">
                              <input className="form-check-input" type="checkbox" role="switch" id={`avail_${field.tempId}`} name="is_available" checked={field.is_available} onChange={(e) => handleAddFieldChange(field.tempId, e)} style={{ width: "2em", height: "1.2em", cursor: "pointer" }} />
                            </div>
                            <label className="form-check-label" htmlFor={`avail_${field.tempId}`} style={{ fontSize: "13px", color: "#333" }}>In Stock</label>
                          </div>
                          <div className="col-md-5 d-flex align-items-center pt-4">
                            <div className="form-check form-switch me-2">
                              <input className="form-check-input" type="checkbox" role="switch" id={`active_${field.tempId}`} name="is_active" checked={field.is_active} onChange={(e) => handleAddFieldChange(field.tempId, e)} style={{ width: "2em", height: "1.2em", cursor: "pointer" }} />
                            </div>
                            <label className="form-check-label" htmlFor={`active_${field.tempId}`} style={{ fontSize: "13px", color: "#333" }}>Active</label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100 mt-2 d-flex align-items-center justify-content-center"
                      style={{ borderRadius: "10px", padding: "12px", borderStyle: "dashed" }}
                      onClick={addVariantField}
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Add Another Variant
                    </button>
                  </>
                )}
              </form>
            </div>

            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white me-2 px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" form="variantForm" className="btn text-white fw-bold px-4 py-2" style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}>
                {editingVariantId ? "Update Variant" : "Save All Variants"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL FOR VIEWING VARIANT DETAILS          */}
      {/* ========================================== */}
      {isViewModalOpen && viewingVariant && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", 
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div className="modal-content-custom" style={{
            background: "#ffffff", width: "100%", maxWidth: "600px", 
            borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
          }}>
            
            {/* View Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom" style={{ background: redGradient, borderRadius: "16px 16px 0 0" }}>
              <h5 className="fw-bold text-white mb-0 d-flex align-items-center">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Variant Details
              </h5>
              <button className="btn btn-link p-0 text-white" onClick={closeViewModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* View Modal Body */}
            <div className="p-4">
              
              {/* Parent Product Info */}
              <div className="mb-4">
                <p className="text-muted mb-1" style={{ fontSize: "13px", fontWeight: "500" }}>PARENT PRODUCT</p>
                <h5 className="fw-bold text-dark mb-0">{viewingVariant.product_name}</h5>
              </div>

              <div className="d-flex align-items-center mb-4">
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
                <span className="text-muted mx-3" style={{ fontSize: "12px", fontWeight: "500" }}>VARIANT INFO</span>
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
              </div>

              {/* Details Grid */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>Variant Name</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingVariant.name}</h6>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>SKU Code</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingVariant.sku || "N/A"}</h6>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>Available Quantity</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingVariant.quantity}</h6>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>Display Order</p>
                    <h6 className="fw-bold text-dark mb-0">{viewingVariant.display_order}</h6>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
                <span className="text-muted mx-3" style={{ fontSize: "12px", fontWeight: "500" }}>STATUS</span>
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
              </div>

              <div className="row g-3">
                <div className="col-md-6 d-flex align-items-center">
                  <span className="badge rounded-pill px-3 py-2 w-100" style={{ background: viewingVariant.is_available ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: viewingVariant.is_available ? "#28a745" : "#6c757d", fontWeight: "500", fontSize: "14px" }}>
                    {viewingVariant.is_available ? "🟢 Available in Stock" : "🔴 Out of Stock"}
                  </span>
                </div>
                <div className="col-md-6 d-flex align-items-center">
                  <span className="badge rounded-pill px-3 py-2 w-100" style={{ background: viewingVariant.is_active ? "rgba(221, 36, 118, 0.1)" : "rgba(108, 117, 125, 0.1)", color: viewingVariant.is_active ? "#DD2476" : "#6c757d", fontWeight: "500", fontSize: "14px" }}>
                    {viewingVariant.is_active ? "🟣 Active on Storefront" : "⚫ Inactive"}
                  </span>
                </div>
              </div>

            </div>

            {/* View Modal Footer */}
            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeViewModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductVariants;