import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function SubCategory() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCatId, setEditingSubCatId] = useState(null);
  
  // State for Parent Categories & SubCategories Table
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the Modal
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [modalInputs, setModalInputs] = useState([{ tempId: Date.now(), name: "" }]);

  // 1. Fetch Categories and SubCategories on mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/categories/`, {
        headers: { "accept": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubCategories = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingSubCatId(null);
    setSelectedCategoryId("");
    setModalInputs([{ tempId: Date.now(), name: "" }]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (subcat) => {
    setEditingSubCatId(subcat.id);
    setSelectedCategoryId(subcat.category_id);
    setModalInputs([{ tempId: Date.now(), name: subcat.name }]);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Modal input handlers
  const addSubCategoryField = () => {
    setModalInputs([...modalInputs, { tempId: Date.now(), name: "" }]);
  };

  const removeSubCategoryField = (tempId) => {
    setModalInputs(modalInputs.filter((field) => field.tempId !== tempId));
  };

  const handleInputChange = (tempId, value) => {
    setModalInputs(
      modalInputs.map((field) =>
        field.tempId === tempId ? { ...field, name: value } : field
      )
    );
  };

  // 2. Handle Create (Bulk) & Update via API
  const handleSaveSubCategories = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!selectedCategoryId) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Please select a parent category.', confirmButtonColor: '#DD2476' });
      return;
    }

    const validSubCategories = modalInputs.filter((field) => field.name.trim() !== "");
    if (validSubCategories.length === 0) return;

    try {
      if (editingSubCatId) {
        // UPDATE (PUT request)
        const payload = { 
          category_id: parseInt(selectedCategoryId), 
          name: validSubCategories[0].name, 
          is_active: true 
        };

        // Parse to Int to fix the int_parsing backend error
        const subId = parseInt(editingSubCatId);

        const res = await fetch(`${API}/subcategories/${subId}`, {
          method: "PUT",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const updatedSub = await res.json();
          setSubCategories(subCategories.map(s => s.id === editingSubCatId ? updatedSub.subcategory : s));
          closeModal();
          Swal.fire({ icon: 'success', title: 'Updated!', text: 'Subcategory has been updated.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
        } else {
          const errData = await res.json();
          Swal.fire({ icon: 'error', title: 'Failed', text: errData.detail || 'Failed to update subcategory.', confirmButtonColor: '#DD2476' });
        }
      } else {
        // CREATE BULK (POST request)
        const payload = {
          subcategories: validSubCategories.map(field => ({ 
            category_id: parseInt(selectedCategoryId), 
            name: field.name, 
            is_active: true 
          }))
        };

        const res = await fetch(`${API}/subcategories/bulk`, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.subcategories) {
            setSubCategories([...subCategories, ...data.subcategories]);
          }
          closeModal();
          Swal.fire({ icon: 'success', title: 'Created!', text: 'Subcategories have been created.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to create subcategories.', confirmButtonColor: '#DD2476' });
        }
      }
    } catch (err) {
      console.error("Error saving subcategories:", err);
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
          const res = await fetch(`${API}/subcategories/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });

          if (res.ok) {
            setSubCategories(subCategories.filter(s => s.id !== id));
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Subcategory has been deleted.', confirmButtonColor: '#DD2476', timer: 1500, showConfirmButton: false });
          } else {
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to delete subcategory.', confirmButtonColor: '#DD2476' });
          }
        } catch (err) {
          console.error("Error deleting subcategory:", err);
          Swal.fire({ icon: 'error', title: 'Server Error', text: 'Server error while deleting.', confirmButtonColor: '#DD2476' });
        }
      }
    });
  };

  // Helper to find parent category name
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : "Unknown";
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Sub Category Master</h3>
        <button 
          className="btn text-white fw-bold d-flex align-items-center px-4 py-2"
          style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}
          onClick={openAddModal}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Sub Category
        </button>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted">Loading subcategories...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    <th style={{ width: "80px" }} className="text-muted fw-medium">#</th>
                    <th style={{ width: "200px" }} className="text-muted fw-medium">Parent Category</th>
                    <th className="text-muted fw-medium">Sub Category Name</th>
                    <th style={{ width: "150px" }} className="text-muted fw-medium">Status</th>
                    <th style={{ width: "120px" }} className="text-muted fw-medium text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories.length > 0 ? (
                    subCategories.map((sub) => (
                      <tr key={sub.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                        <td className="text-muted">{sub.id}</td>
                        <td>
                          <span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>
                            {getCategoryName(sub.category_id)}
                          </span>
                        </td>
                        <td className="fw-bold text-dark">{sub.name}</td>
                        <td>
                          <span 
                            className="badge rounded-pill px-3 py-2" 
                            style={{ 
                              background: sub.is_active ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", 
                              color: sub.is_active ? "#28a745" : "#6c757d",
                              fontWeight: "500"
                            }}
                          >
                            {sub.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end">
                            {/* Edit Button */}
                            <button className="btn btn-sm btn-link text-primary p-1 me-2" onClick={() => openEditModal(sub)}>
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            {/* Delete Button */}
                            <button className="btn btn-sm btn-link text-danger p-1" onClick={() => handleDelete(sub.id)}>
                              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-5">No subcategories found. Click "Add Sub Category" to create one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOM MODAL FOR MULTIPLE SUBCATEGORIES */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", 
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="modal-content-custom" style={{
            background: "#ffffff", width: "100%", maxWidth: "550px", 
            borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
          }}>
            
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="fw-bold text-dark mb-0">
                {editingSubCatId ? "Edit Sub Category" : "Add Sub Categories"}
              </h5>
              <button className="btn btn-link p-0 text-muted" onClick={closeModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSaveSubCategories} className="p-4">
              
              {/* Parent Category Dropdown */}
              <div className="mb-4">
                <label className="form-label text-muted fw-medium" style={{ fontSize: "14px" }}>Select Parent Category</label>
                <select 
                  className="form-select" 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                  style={{ padding: "14px", borderRadius: "10px", border: "1px solid #e9ecef", backgroundColor: "#f8f9fa" }}
                >
                  <option value="">-- Choose a Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
                <span className="text-muted mx-3" style={{ fontSize: "13px" }}>SUBCATEGORIES</span>
                <hr className="flex-grow-1" style={{ borderColor: "#f0f0f0" }}/>
              </div>

              <div className="dynamic-fields-container" style={{ maxHeight: "250px", overflowY: "auto" }}>
                {modalInputs.map((field, index) => (
                  <div key={field.tempId} className="d-flex align-items-center mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0" style={{ borderRadius: "10px 0 0 10px" }}>
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="e.g. Smartphones"
                        value={field.name}
                        onChange={(e) => handleInputChange(field.tempId, e.target.value)}
                        required={index === 0}
                        style={{ padding: "14px", borderRadius: "0 10px 10px 0", border: "1px solid #e9ecef", borderLeft: "0" }}
                        autoFocus={index === 0}
                      />
                    </div>
                    {!editingSubCatId && modalInputs.length > 1 && (
                      <button 
                        type="button" 
                        className="btn btn-link text-danger ms-2 p-2"
                        onClick={() => removeSubCategoryField(field.tempId)}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {!editingSubCatId && (
                <button 
                  type="button" 
                  className="btn btn-outline-secondary w-100 mt-2 d-flex align-items-center justify-content-center"
                  style={{ borderRadius: "10px", padding: "12px", borderStyle: "dashed" }}
                  onClick={addSubCategoryField}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Add Another Sub Category
                </button>
              )}

              {/* Modal Footer */}
              <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                <button 
                  type="button" 
                  className="btn btn-light me-2 px-4 py-2" 
                  style={{ borderRadius: "10px" }}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn text-white fw-bold px-4 py-2"
                  style={{ background: redGradient, border: "none", borderRadius: "10px" }}
                >
                  {editingSubCatId ? "Update Sub Category" : "Save Sub Categories"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubCategory;