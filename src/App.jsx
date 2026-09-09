import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Category from './pages/Admin/Category';
import SubCategory from './pages/Admin/SubCategory'; // <-- Import Real SubCategory Page
import ProductCreation from './pages/Admin/ProductCreation';
import UnitMaster from './pages/Admin/UnitMaster';
import ProductImages from './pages/Admin/ProductImages';
import ProductVariants from './pages/Admin/ProductVariants'; 
import Orders from './pages/Admin/Orders';
import Customers from './pages/Admin/Customers';

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
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
         
          {/* Masters Routes */}
          <Route path="/masters/category" element={<Category />} />
          <Route path="/masters/sub-category" element={<SubCategory />} /> 
          <Route path="/masters/unit" element={<UnitMaster />} />{/* <-- Updated Route */}
          <Route path="/masters/product-creation" element={<ProductCreation />} />
          <Route path="/masters/product-images" element={<ProductImages />} />
          <Route path="/masters/product-variants" element={<ProductVariants />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;