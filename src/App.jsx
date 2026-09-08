import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Category from './pages/Admin/Category';
import SubCategory from './pages/Admin/SubCategory'; // <-- Import Real SubCategory Page

const DummyPage = ({ title }) => (
  <div className="container-fluid">
    <h3 className="fw-bold text-dark mb-4">{title}</h3>
    <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted">
      This is a placeholder page for {title}. We will build the form/table here soon!
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<DummyPage title="Orders" />} />
          <Route path="/customers" element={<DummyPage title="Customers" />} />
          
          {/* Masters Routes */}
          <Route path="/masters/category" element={<Category />} />
          <Route path="/masters/sub-category" element={<SubCategory />} /> {/* <-- Updated Route */}
          <Route path="/masters/product-creation" element={<DummyPage title="Product Creation" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;