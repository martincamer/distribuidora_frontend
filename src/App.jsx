import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import { LoginPage } from "./pages/LoginPage";
import { ProductosPage } from "./pages/ProductosPage";
import { ProductosProvider } from "./context/ProductosContext";
import { HomeApp } from "./pages/HomeApp";
import { CrearProductoNuevo } from "./pages/CrearProductoNuevo";
import { CrearCategorias } from "./pages/CrearCategorias";
import { Ventas } from "./pages/Ventas";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <ProductosProvider>
        <BrowserRouter>
          <Navbar />
          {/* <SideBar /> */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route index path="/home" element={<HomeApp />} />
              <Route index path="/ventas" element={<Ventas />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/categorias" element={<CrearCategorias />} />
              <Route path="/crear-producto" element={<CrearProductoNuevo />} />
              <Route path="/profile" element={<h1>Profile</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProductosProvider>
    </AuthProvider>
  );
}

export default App;
