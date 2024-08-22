import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function Navbar() {
  const { logout } = useAuth();
  return (
    <header className="bg-gray-800 flex items-center justify-between">
      <nav className="py-5 px-12 flex gap-10 items-center">
        <div>
          <Link to={"/home"} className="text-2xl font-bold">
            <img src="https://app.holded.com/assets/img/brand/holded-logo.svg" />
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <div className="dropdown dropdown-hover">
            <button
              type="button"
              className="hover:bg-gray-700 text-sm text-white rounded-md  py-2 px-4 font-semibold transition-all"
            >
              Productos
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 w-52 p-1 rounded-md shadow-xl"
            >
              <li className="hover:bg-gray-800 hover:text-white rounded-md text-xs font-semibold">
                <Link to={"/productos"}>Perfiles</Link>
              </li>
              <li className="hover:bg-gray-800 hover:text-white rounded-md text-xs font-semibold">
                <Link to={"/crear-producto"}>Crear nuevo perfil</Link>
              </li>{" "}
            </ul>
          </div>
          <div className="dropdown dropdown-hover">
            <button
              type="button"
              className="hover:bg-gray-700 text-sm text-white rounded-md  py-2 px-4 font-semibold transition-all"
            >
              Acciones
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 w-60 p-1 rounded-md shadow-xl"
            >
              <li className="hover:bg-gray-800 hover:text-white rounded-md text-xs font-semibold">
                <Link to={"/ventas"}>Sector de ventas/presupuestos</Link>
              </li>
            </ul>
          </div>
          <Link
            className="hover:bg-gray-700 text-sm text-white rounded-md  py-2 px-4 font-semibold transition-all"
            to={"/clientes"}
          >
            Clientes
          </Link>{" "}
          <Link
            className="hover:bg-gray-700 text-sm text-white rounded-md  py-2 px-4 font-semibold transition-all"
            to={"/perfil"}
          >
            Datos/facturación
          </Link>
        </div>
      </nav>
      <div className="px-5">
        <button
          onClick={() => logout()}
          className="bg-primary text-sm font-bold rounded-md py-1 px-4 text-white hover:bg-gray-700/90 transition-all"
        >
          Salir de la cuenta
        </button>
      </div>
    </header>
  );
}
