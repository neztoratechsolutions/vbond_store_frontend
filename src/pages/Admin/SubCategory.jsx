import React, { useState } from "react";

function SubCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dummy list of parent categories (In a real app, you would fetch this from your API)
  const [categories] = useState(["Electronics", "Clothing", "Home Appliances"]);

  // State to hold the list of subcategories in the table
  const [subCategories, setSubCategories] = useState([
    { id: 1, category: "Electronics", name: "Smartphones", status: "Active" },
    { id: 2, category: "Electronics", name: "Laptops", status: "Active" },
    { id: 3, category: "Electronics", name: "PC", status: "Active" },
    { id: 4, category: "Electronics", name: "TV", status: "Active" },
    { id: 5, category: "Electronics", name: "Refrigerator", status: "Active" },
    { id: 6, category: "Electronics", name: "Kyboard", status: "Active" },
    { id: 7, category: "Clothing", name: "Men's Wear", status: "Inactive" },
    { id: 8, category: "Clothing", name: "Men's Wear", status: "Inactive" },
    { id: 9, category: "Clothing", name: "Men's Wear", status: "Inactive" },
  ]);

  // State for the Modal
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalInputs, setModalInputs] = useState([{ id: Date.now(), name: "" }]);

  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  const openModal = () => {
    setSelectedCategory(""); // Reset dropdown
    setModalInputs([{ id: Date.now(), name: "" }]); // Reset inputs
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const addSubCategoryField = () => {
    setModalInputs([...modalInputs, { id: Date.now(), name: "" }]);
  };

  const removeSubCategoryField = (id) => {
    setModalInputs(modalInputs.filter((field) => field.id !== id));
  };

  const handleInputChange = (id, value) => {
    setModalInputs(
      modalInputs.map((field) =>
        field.id === id ? { ...field, name: value } : field
      )
    );
  };

  // Save all subcategories to the table
  const handleSaveSubCategories = (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      alert("Please select a parent category.");
      return;
    }

    const validSubCategories = modalInputs.filter((field) => field.name.trim() !== "");
    
    if (validSubCategories.length > 0) {
      const newSubCategories = validSubCategories.map((field, index) => ({
        id: subCategories.length + index + 1,
        category: selectedCategory,
        name: field.name,
        status: "Active",
      }));
      
      setSubCategories([...subCategories, ...newSubCategories]);
      closeModal();
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Sub Category Master</h3>
        <button 
          className="btn text-white fw-bold d-flex align-items-center px-4 py-2"
          style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}
          onClick={openModal}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Sub Category
        </button>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ width: "80px" }} className="text-muted fw-medium">#</th>
                  <th style={{ width: "200px" }} className="text-muted fw-medium">Parent Category</th>
                  <th className="text-muted fw-medium">Sub Category Name</th>
                  <th style={{ width: "150px" }} className="text-muted fw-medium">Status</th>
                  <th style={{ width: "100px" }} className="text-muted fw-medium text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td className="text-muted">{sub.id}</td>
                    <td>
                      <span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>
                        {sub.category}
                      </span>
                    </td>
                    <td className="fw-bold text-dark">{sub.name}</td>
                    <td>
                      <span 
                        className="badge rounded-pill px-3 py-2" 
                        style={{ 
                          background: sub.status === "Active" ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", 
                          color: sub.status === "Active" ? "#28a745" : "#6c757d",
                          fontWeight: "500"
                        }}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-link text-danger p-1">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <h5 className="fw-bold text-dark mb-0">Add Sub Categories</h5>
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  style={{ padding: "14px", borderRadius: "10px", border: "1px solid #e9ecef", backgroundColor: "#f8f9fa" }}
                >
                  <option value="">-- Choose a Category --</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
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
                  <div key={field.id} className="d-flex align-items-center mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0" style={{ borderRadius: "10px 0 0 10px" }}>
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="e.g. Smartphones"
                        value={field.name}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={index === 0}
                        style={{ padding: "14px", borderRadius: "0 10px 10px 0", border: "1px solid #e9ecef", borderLeft: "0" }}
                        autoFocus={index === 0}
                      />
                    </div>
                    {modalInputs.length > 1 && (
                      <button 
                        type="button" 
                        className="btn btn-link text-danger ms-2 p-2"
                        onClick={() => removeSubCategoryField(field.id)}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Another Sub Category Button */}
              <button 
                type="button" 
                className="btn btn-outline-secondary w-100 mt-2 d-flex align-items-center justify-content-center"
                style={{ borderRadius: "10px", padding: "12px", borderStyle: "dashed" }}
                onClick={addSubCategoryField}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Another Sub Category
              </button>

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
                  Save Sub Categories
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