import React, { useState } from "react";

function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to hold the list of categories in the table
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", status: "Active" },
    { id: 2, name: "Clothing", status: "Active" },
    { id: 3, name: "Home Appliances", status: "Inactive" },
  ]);

  // State to hold the multiple inputs inside the modal
  const [modalInputs, setModalInputs] = useState([{ id: Date.now(), name: "" }]);

  // Open Modal and reset inputs
  const openModal = () => {
    setModalInputs([{ id: Date.now(), name: "" }]);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add a new empty input field in the modal
  const addCategoryField = () => {
    setModalInputs([...modalInputs, { id: Date.now(), name: "" }]);
  };

  // Remove a specific input field in the modal
  const removeCategoryField = (id) => {
    setModalInputs(modalInputs.filter((field) => field.id !== id));
  };

  // Handle typing in the input fields
  const handleInputChange = (id, value) => {
    setModalInputs(
      modalInputs.map((field) =>
        field.id === id ? { ...field, name: value } : field
      )
    );
  };

  // Save all categories from the modal to the table
  const handleSaveCategories = (e) => {
    e.preventDefault();
    // Filter out empty inputs
    const validCategories = modalInputs.filter((field) => field.name.trim() !== "");
    
    if (validCategories.length > 0) {
      // Add them to the main table list
      const newCategories = validCategories.map((field, index) => ({
        id: categories.length + index + 1,
        name: field.name,
        status: "Active",
      }));
      
      setCategories([...categories, ...newCategories]);
      closeModal();
    }
  };

  // Red Gradient Theme
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Category Master</h3>
        <button 
          className="btn text-white fw-bold d-flex align-items-center px-4 py-2"
          style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}
          onClick={openModal}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Category
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
                  <th className="text-muted fw-medium">Category Name</th>
                  <th style={{ width: "150px" }} className="text-muted fw-medium">Status</th>
                  <th style={{ width: "100px" }} className="text-muted fw-medium text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td className="text-muted">{cat.id}</td>
                    <td className="fw-bold text-dark">{cat.name}</td>
                    <td>
                      <span 
                        className="badge rounded-pill px-3 py-2" 
                        style={{ 
                          background: cat.status === "Active" ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", 
                          color: cat.status === "Active" ? "#28a745" : "#6c757d",
                          fontWeight: "500"
                        }}
                      >
                        {cat.status}
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

      {/* CUSTOM MODAL FOR MULTIPLE CATEGORIES */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", 
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="modal-content-custom" style={{
            background: "#ffffff", width: "100%", maxWidth: "500px", 
            borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
          }}>
            
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="fw-bold text-dark mb-0">Add Multiple Categories</h5>
              <button className="btn btn-link p-0 text-muted" onClick={closeModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSaveCategories} className="p-4">
              <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                Enter category names below. You can add as many as you need before saving.
              </p>

              <div className="dynamic-fields-container" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {modalInputs.map((field, index) => (
                  <div key={field.id} className="d-flex align-items-center mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0" style={{ borderRadius: "10px 0 0 10px" }}>
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="e.g. Mobile Phones"
                        value={field.name}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={index === 0} // At least the first one is required
                        style={{ padding: "14px", borderRadius: "0 10px 10px 0", border: "1px solid #e9ecef", borderLeft: "0" }}
                        autoFocus={index === 0}
                      />
                    </div>
                    {/* Remove Button (Only show if there is more than 1 field) */}
                    {modalInputs.length > 1 && (
                      <button 
                        type="button" 
                        className="btn btn-link text-danger ms-2 p-2"
                        onClick={() => removeCategoryField(field.id)}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Another Category Button */}
              <button 
                type="button" 
                className="btn btn-outline-secondary w-100 mt-2 d-flex align-items-center justify-content-center"
                style={{ borderRadius: "10px", padding: "12px", borderStyle: "dashed" }}
                onClick={addCategoryField}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Another Category
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
                  Save All Categories
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;