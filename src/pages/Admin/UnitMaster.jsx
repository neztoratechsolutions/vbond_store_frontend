import React, { useState } from "react";

function UnitMaster() {
  const redGradient = "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)";

  // State for Table
  const [units, setUnits] = useState([
    { id: 1, name: "Pieces", short_name: "Pc", description: "Individual items", display_order: "1", is_active: true },
    { id: 2, name: "Kilograms", short_name: "Kg", description: "Weight in kilograms", display_order: "2", is_active: true },
    { id: 3, name: "Liters", short_name: "L", description: "Volume in liters", display_order: "3", is_active: false },
  ]);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState(null);

  // Form State matching your SQLAlchemy Model
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    description: "",
    display_order: "0",
    is_active: true,
  });

  const openModal = () => {
    setEditingUnitId(null);
    setFormData({ name: "", short_name: "", description: "", display_order: "0", is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (unit) => {
    setEditingUnitId(unit.id);
    setFormData({ ...unit });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUnitId) {
      // Update existing
      setUnits(units.map(u => (u.id === editingUnitId ? { ...formData, id: editingUnitId } : u)));
    } else {
      // Add new
      const newUnit = { ...formData, id: units.length + 1 };
      setUnits([...units, newUnit]);
    }
    closeModal();
  };

  const inputStyle = { padding: "14px", borderRadius: "10px", border: "1px solid #e9ecef", backgroundColor: "#f8f9fa", fontSize: "15px" };
  const labelStyle = { fontSize: "14px", fontWeight: "500", color: "#6c757d", marginBottom: "8px", display: "block" };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Unit Master</h3>
        <button 
          className="btn text-white fw-bold d-flex align-items-center px-4 py-2"
          style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}
          onClick={openModal}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className="me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Unit
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
                  <th className="text-muted fw-medium">Unit Name</th>
                  <th style={{ width: "150px" }} className="text-muted fw-medium">Short Name</th>
                  <th className="text-muted fw-medium">Description</th>
                  <th style={{ width: "100px" }} className="text-muted fw-medium">Order</th>
                  <th style={{ width: "120px" }} className="text-muted fw-medium">Status</th>
                  <th style={{ width: "100px" }} className="text-muted fw-medium text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td className="text-muted">{unit.id}</td>
                    <td className="fw-bold text-dark">{unit.name}</td>
                    <td><span className="badge bg-light text-dark border px-3 py-2" style={{ fontWeight: "500", borderRadius: "8px" }}>{unit.short_name}</span></td>
                    <td className="text-muted text-truncate" style={{ maxWidth: "200px" }}>{unit.description || "-"}</td>
                    <td className="text-muted">{unit.display_order}</td>
                    <td>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: unit.is_active ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)", color: unit.is_active ? "#28a745" : "#6c757d", fontWeight: "500" }}>
                        {unit.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end">
                        {/* Edit Button */}
                        <button className="btn btn-sm btn-link text-primary p-1 me-2" onClick={() => openEditModal(unit)}>
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

      {/* CUSTOM MODAL FOR UNIT FORM */}
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
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom sticky-top bg-white rounded-top" style={{ zIndex: 10 }}>
              <h5 className="fw-bold text-dark mb-0">
                {editingUnitId ? "Edit Unit" : "Create New Unit"}
              </h5>
              <button className="btn btn-link p-0 text-muted" onClick={closeModal}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body (Form) */}
            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="p-4">
              <form onSubmit={handleSubmit} id="unitForm">
                
                {/* Name & Short Name */}
                <div className="row g-4 mb-4">
                  <div className="col-md-8">
                    <label className="form-label" style={labelStyle}>Unit Name *</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g. Kilograms" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>Short Name *</label>
                    <input type="text" className="form-control" name="short_name" value={formData.short_name} onChange={handleChange} style={inputStyle} placeholder="e.g. Kg" required />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label" style={labelStyle}>Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} style={{...inputStyle, minHeight: "100px"}} placeholder="Enter unit description..."></textarea>
                </div>

                {/* Display Order & Active Status */}
                <div className="row g-4 mb-4 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label" style={labelStyle}>Display Order</label>
                    <input type="number" className="form-control" name="display_order" value={formData.display_order} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div className="col-md-8 d-flex align-items-center pb-1">
                    <div className="form-check form-switch me-3">
                      <input className="form-check-input" type="checkbox" role="switch" id="is_active_unit" name="is_active" checked={formData.is_active} onChange={handleChange} style={{ width: "2.5em", height: "1.5em", cursor: "pointer" }} />
                    </div>
                    <label className="form-check-label" htmlFor="is_active_unit" style={{ fontWeight: "500", color: "#333" }}>Is Active</label>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="d-flex justify-content-end p-4 border-top bg-light rounded-bottom">
              <button type="button" className="btn btn-white me-2 px-4 py-2 shadow-sm" style={{ borderRadius: "10px", fontWeight: "500" }} onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" form="unitForm" className="btn text-white fw-bold px-4 py-2" style={{ background: redGradient, border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(221, 36, 118, 0.3)" }}>
                {editingUnitId ? "Update Unit" : "Create Unit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnitMaster;