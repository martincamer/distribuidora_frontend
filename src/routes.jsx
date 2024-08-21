import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { Navbar } from "./components/Navbar";
// import { SideBar } from "./components/uiElements/Sidebar";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (!loading && !isAuthenticated) return <Navigate to="/" replace />;
  return (
    <main className="w-full h-full min-h-full max-h-full flex flex-col">
      <Navbar />
      <div className="w-full">
        <Outlet />
      </div>
    </main>
  );
};
