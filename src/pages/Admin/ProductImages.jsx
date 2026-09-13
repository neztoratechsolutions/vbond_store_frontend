import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function ProductImages() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  // State for Products Dropdown
  const [products, setProducts] = useState([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  
  // State for Images List
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState(null);
  const [originalProductId, setOriginalProductId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    product_id: "",
    image: null,
    imagePreview: "",
    display_order: "0",
  });

  // 1. Fetch Products and Images on mount
  useEffect(() => {
    fetchProducts();
    fetchImages();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/products`, {
        headers: { "accept": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/product-images/`, {
        headers: { "accept": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setImages(data.data);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API}/${imagePath.replace(/^\//, '')}`;
  };

  // Helper to get product name
  const getProductName = (productId) => {
    const prod = products.find(p => p.id === productId);
    return prod ? prod.name : `Product ID: ${productId}`;
  };

  // Filtered products for search dropdown
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Selected product display name
  const selectedProductName = formData.product_id 
    ? products.find(p => p.id === parseInt(formData.product_id))?.name 
    : "Choose a product...";

  const openModal = () => {
    setEditingImageId(null);
    setOriginalProductId(null);
    setFormData({ product_id: "", image: null, imagePreview: "", display_order: "0" });
    setProductSearch("");
    setIsModalOpen(true);
  };

  const openEditModal = (img) => {
    setEditingImageId(img.id);
    setOriginalProductId(img.product_id);
    setFormData({
      product_id: img.product_id,
      image: null,
      imagePreview: getImageUrl(img.image),
      display_order: img.display_order || "0",
    });
    setProductSearch("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsProductDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Handle Create & Update via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingImageId) {
        // --- EDIT MODE ---
        const productChanged = parseInt(formData.product_id) !== originalProductId;
        const newFileSelected = formData.image !== null;

        if (newFileSelected || productChanged) {
          Swal.fire({ title: 'Updating...', didOpen: () => Swal.showLoading() });

          // 1. Delete old
          await fetch(`${API}/product-images/${editingImageId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });

          // 2. Upload new
          const formDataObj = new FormData();
          formDataObj.append("product_id", formData.product_id);
          formDataObj.append("images", formData.image);

          const res = await fetch(`${API}/product-images/bulk`, {
            method: "POST",
            headers: { "accept": "application/json", "Authorization": `Bearer ${token}` },
            body: formDataObj
          });

          if (res.ok) {
            const data = await res.json();
            if (data.images && data.images.length > 0) {
              setImages(prev => [...prev.filter(img => img.id !== editingImageId), ...data.images]);
            }
            closeModal();
            Swal.fire({ icon: 'success', title: 'Updated!', text: 'Image and product updated.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
          } else {
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to update image.', confirmButtonColor: '#DD2476' });
          }

        } else {
          // Only display_order changed -> Use PUT request
          const payload = { display_order: parseInt(formData.display_order) };
          const res = await fetch(`${API}/product-images/${editingImageId}`, {
            method: "PUT",
            headers: {
              "accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            const data = await res.json();
            setImages(images.map(img => (img.id === editingImageId ? data.data : img)));
            closeModal();
            Swal.fire({ icon: 'success', title: 'Updated!', text: 'Display order updated.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
          } else {
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to update order.', confirmButtonColor: '#DD2476' });
          }
        }
      } else {
        // --- ADD MODE ---
        if (!formData.product_id || !formData.image) {
          Swal.fire({ icon: 'warning', title: 'Missing Data', text: 'Please select a product and an image.', confirmButtonColor: '#DD2476' });
          return;
        }

        const formDataObj = new FormData();
        formDataObj.append("product_id", formData.product_id);
        formDataObj.append("images", formData.image);

        const res = await fetch(`${API}/product-images/bulk`, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: formDataObj
        });

        if (res.ok) {
          const data = await res.json();
          if (data.images) {
            setImages([...images, ...data.images]);
          }
          closeModal();
          Swal.fire({ icon: 'success', title: 'Uploaded!', text: 'Image uploaded successfully.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
        } else {
          const errData = await res.json();
          Swal.fire({ icon: 'error', title: 'Failed', text: errData.detail || 'Failed to upload image.', confirmButtonColor: '#DD2476' });
        }
      }
    } catch (err) {
      console.error("Error saving image:", err);
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
          const res = await fetch(`${API}/product-images/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });

          if (res.ok) {
            setImages(images.filter(img => img.id !== id));
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Image has been deleted.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
          } else {
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to delete image.', confirmButtonColor: '#DD2476' });
          }
        } catch (err) {
          console.error("Error deleting image:", err);
          Swal.fire({ icon: 'error', title: 'Server Error', text: 'Server error while deleting.', confirmButtonColor: '#DD2476' });
        }
      }
    });
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
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-muted">Loading images...</p>
        </div>
      ) : (
        <div className="row g-4">
          {images.length > 0 ? (
            images.map((img) => (
              <div className="col-md-4 col-lg-3" key={img.id}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  {/* Image Preview */}
                  <div style={{ height: "200px", overflow: "hidden", borderRadius: "16px 16px 0 0", backgroundColor: "#f8f9fa" }}>
                    <img 
                      src={getImageUrl(img.image)} 
                      alt="Product" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image" }}
                    />
                  </div>
                  
                  {/* Card Body */}
                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: "15px" }}>{getProductName(img.product_id)}</h6>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>
                        Order: {img.display_order}
                      </span>
                      
                      {/* Actions */}
                      <div className="d-flex">
                        <button className="btn btn-sm btn-link text-primary p-1 me-1" onClick={() => openEditModal(img)} title="Edit Image/Product/Order">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button className="btn btn-sm btn-link text-danger p-1" onClick={() => handleDelete(img.id)} title="Delete">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted py-5">No images found. Click "Add Image" to upload one.</div>
          )}
        </div>
      )}

      {/* MODAL FOR ADD/EDIT IMAGE */}
      {isModalOpen && (
        <>
          {/* Click outside catcher for dropdown */}
          {isProductDropdownOpen && (
            <div className="position-fixed" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }} onClick={() => setIsProductDropdownOpen(false)}></div>
          )}
          
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
                  
                  {/* CUSTOM SEARCHABLE PRODUCT DROPDOWN */}
                  <div className="mb-4 position-relative">
                    <label className="form-label" style={labelStyle}>Select Product *</label>
                    <button 
                      type="button" 
                      className="form-control text-start d-flex align-items-center justify-content-between"
                      style={inputStyle}
                      onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                    >
                      <span className={formData.product_id ? "text-dark text-truncate" : "text-muted"}>{selectedProductName}</span>
                      <svg width="18" height="18" fill="none" stroke="#6c757d" viewBox="0 0 24 24" strokeWidth="2" style={{ transition: 'transform 0.2s', transform: isProductDropdownOpen ? 'rotate(180deg)' : 'none' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {isProductDropdownOpen && (
                      <div className="position-absolute bg-white border shadow-lg rounded-3 mt-1 w-100" style={{ zIndex: 1055, maxHeight: "300px", overflowY: "hidden", display: "flex", flexDirection: "column" }}>
                        <div className="p-2 border-bottom">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search product..." 
                            value={productSearch} 
                            onChange={(e) => setProductSearch(e.target.value)} 
                            autoFocus
                            style={{ borderRadius: "8px", backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
                          />
                        </div>
                        <div style={{ overflowY: "auto" }}>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((prod) => (
                              <div 
                                key={prod.id} 
                                className="p-3 text-dark" 
                                style={{ cursor: "pointer", borderBottom: "1px solid #f8f9fa" }}
                                onClick={() => {
                                  setFormData({ ...formData, product_id: prod.id });
                                  setIsProductDropdownOpen(false);
                                  setProductSearch("");
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#fff0f3"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#ffffff"}
                              >
                                {prod.name}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-muted">No products found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Upload Area */}
                  <div className="mb-4">
                    <label className="form-label" style={labelStyle}>{editingImageId ? "Change Image (Optional)" : "Upload Image *"}</label>
                    
                    {formData.imagePreview ? (
                      <div className="position-relative">
                        <div style={{ height: "220px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}>
                          <img src={formData.imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        {/* Remove/Change Image Button */}
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => document.getElementById("fileInput").click()}
                          title="Change Image"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </button>
                        <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                      </div>
                    ) : (
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
                        <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} required={!editingImageId} />
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
        </>
      )}
    </div>
  );
}

export default ProductImages;