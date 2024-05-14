import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { SideBar } from "./components/uiElements/Sidebar";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (!isAuthenticated && !loading) return <Navigate to="/" replace />;
  return (
    <main className="flex w-full h-full">
      {user?.cuenta === "desactivada" ? (
        ""
      ) : (
        <div className="w-auto">
          <SideBar />
        </div>
      )}
      <div className="w-full">
        <Outlet />
      </div>
    </main>
  );
};
