import React, { useState } from "react";

function ProductImages() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  // Dummy list of products for the dropdown
  const products = [
    { id: 1, name: "Apple iPhone 15 Pro" },
    { id: 2, name: "Dell XPS 13" },
    { id: 3, name: "Samsung Galaxy S24" },
  ];

  // State for Images List
  const [images, setImages] = useState([
    { id: 1, product_id: 1, product_name: "Apple iPhone 15 Pro", image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500", display_order: 1 },
    { id: 2, product_id: 1, product_name: "Apple iPhone 15 Pro", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500", display_order: 2 },
    { id: 3, product_id: 2, product_name: "Dell XPS 13", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500", display_order: 1 },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    product_id: "",
    image: "",
    display_order: "0",
  });

  const openModal = () => {
    setEditingImageId(null);
    setFormData({ product_id: "", image: "", display_order: "0" });
    setIsModalOpen(true);
  };

  const openEditModal = (img) => {
    setEditingImageId(img.id);
    setFormData({ product_id: img.product_id, image: img.image, display_order: img.display_order });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Upload (Converts to Base64 for instant preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));
    
    if (editingImageId) {
      // Update
      setImages(images.map(img => 
        img.id === editingImageId ? { ...formData, id: editingImageId, product_name: selectedProduct?.name } : img
      ));
    } else {
      // Add
      const newImage = {
        ...formData,
        id: images.length + 1,
        product_name: selectedProduct?.name || "Unknown Product"
      };
      setImages([...images, newImage]);
    }
    closeModal();
  };

  const inputStyle = { padding: "14px", borderRadius: "10px", border: "1px solid #e9ecef", backgroundColor: "#f8f9fa", fontSize: "15px" };
  const labelStyle = { fontSize: "14px", fontWeight: "500", color: "#6c757d", marginBottom: "8px", display: "block" };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Product Images</h3>
        <button 
          className="btn text-white fw-bold d-flex align-items-center px-4 py-2"
          style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}
          onClick={openModal}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Image
        </button>
      </div>

      {/* Images Grid */}
      <div className="row g-4">
        {images.map((img) => (
          <div className="col-md-4 col-lg-3" key={img.id}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              {/* Image Preview */}
              <div style={{ height: "200px", overflow: "hidden", borderRadius: "16px 16px 0 0", backgroundColor: "#f8f9fa" }}>
                <img 
                  src={img.image} 
                  alt="Product" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image" }}
                />
              </div>
              
              {/* Card Body */}
              <div className="card-body p-3 d-flex flex-column">
                <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: "15px" }}>{img.product_name}</h6>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>
                    Order: {img.display_order}
                  </span>
                  
                  {/* Actions */}
                  <div className="d-flex">
                    <button className="btn btn-sm btn-link text-primary p-1 me-1" onClick={() => openEditModal(img)}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button className="btn btn-sm btn-link text-danger p-1">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FOR ADD/EDIT IMAGE */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", 
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div className="modal-content-custom" style={{
            background: "#ffffff", width: "100%", maxWidth: "600px", 
            borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
          }}>
            
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="fw-bold text-dark mb-0">
                {editingImageId ? "Edit Image" : "Add Product Image"}
              </h5>
              <button className="btn btn-link p-0 text-muted" onClick={closeModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body (Form) */}
            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="p-4">
              <form onSubmit={handleSubmit} id="imageForm">
                
                {/* Product Dropdown */}
                <div className="mb-4">
                  <label className="form-label" style={labelStyle}>Select Product *</label>
                  <select className="form-select" name="product_id" value={formData.product_id} onChange={handleChange} style={inputStyle} required>
                    <option value="">Choose a product...</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>{prod.name}</option>
                    ))}
                  </select>
                </div>

                {/* Image Upload Area */}
                <div className="mb-4">
                  <label className="form-label" style={labelStyle}>Upload Image *</label>
                  
                  {/* If image exists, show preview. Otherwise, show upload box */}
                  {!formData.image ? (
                    <div 
                      className="d-flex flex-column align-items-center justify-content-center"
                      style={{ border: "2px dashed #e9ecef", borderRadius: "12px", padding: "40px", backgroundColor: "#f8f9fa", cursor: "pointer" }}
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      <svg width="40" height="40" fill="none" stroke="#DD2476" viewBox="0 0 24 24" strokeWidth="1.5" className="mb-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-muted mb-1" style={{ fontSize: "15px", fontWeight: "500" }}>Click to upload or drag and drop</p>
                      <p className="text-muted mb-0" style={{ fontSize: "13px" }}>PNG, JPG, GIF up to 5MB</p>
                      <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} required />
                    </div>
                  ) : (
                    <div className="position-relative">
                      <div style={{ height: "220px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}>
                        <img src={formData.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      {/* Remove/Change Image Button */}
                      <button 
                        type="button" 
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                        onClick={removeImage}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Display Order */}
                <div className="mb-4">
                  <label className="form-label" style={labelStyle}>Display Order</label>
                  <input type="number" className="form-control" name="display_order" value={formData.display_order} onChange={handleChange} style={inputStyle} placeholder="0" />
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white me-2 px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" form="imageForm" className="btn text-white fw-bold px-4 py-2" style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}>
                {editingImageId ? "Update Image" : "Save Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductImages;