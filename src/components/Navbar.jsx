import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { CiMenuBurger } from "react-icons/ci";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header
      className={`${isAuthenticated ? "bg-sky-500" : "bg-white"} z-[-100]`}
    >
      <nav className="flex justify-between items-center py-2 px-10 max-md:flex-row max-md:gap-1 max-md:items-center max-md:justify-between max-md:w-full">
        <h1 className="text-2xl font-bold">
          <Link className="relative" to={isAuthenticated ? "/home" : "/"}>
            <p
              className={`${
                isAuthenticated ? "text-white" : "text-sky-500 py-3"
              } z-[-100]`}
            >
              Gestión Prisma
            </p>
          </Link>
        </h1>
        {!isAuthenticated && (
          <ul className="items-center gap-4 text-lg hidden">
            <Link
              className="hover:bg-sky-500/10 py-1.5 text-sm font-medium px-6 rounded-xl hover:text-sky-500 transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Funcionalidades
            </Link>
            <Link
              className="hover:bg-sky-500/10 py-1.5 text-sm font-medium px-6 rounded-xl hover:text-sky-500 transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Precios
            </Link>
            <Link
              className="hover:bg-sky-500/10 py-1.5 text-sm font-medium px-6 rounded-xl hover:text-sky-500 transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Asesorías
            </Link>
            <Link
              className="hover:bg-sky-500/10 py-1.5 text-sm font-medium px-6 rounded-xl hover:text-sky-500 transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Preguntas frecuentes
            </Link>
            <Link
              className="hover:bg-sky-500/10 py-1.5 text-sm font-medium px-6 rounded-xl hover:text-sky-500 transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Nosotros
            </Link>
          </ul>
        )}
        <ul className="flex gap-x-4">
          {isAuthenticated ? (
            <div className="flex justify-between items-center gap-36 w-full">
              <div className="dropdown dropdown-end z-[100]">
                <div tabIndex={0} role="button" className="avatar">
                  <div className="w-16 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={
                        user?.imagen ||
                        "https://ppstatic.s3.amazonaws.com/expenses/uploads/people/default.png"
                      }
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-60"
                >
                  <div className="py-2 px-2">
                    <img
                      className="rounded-full w-28 mx-auto"
                      src={
                        user.imagen ||
                        "https://ppstatic.s3.amazonaws.com/expenses/uploads/people/default.png"
                      }
                      alt=""
                    />
                    <div className="py-2 ">
                      <p className="font-semibold text-sky-500 capitalize text-center">
                        {user.username}
                      </p>
                      <p className="font-semibold text-gray-500 text-xs capitalize text-center">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <li className="mb-1">
                    <Link
                      to={"/perfil"}
                      className="justify-between hover:bg-sky-500 py-2 transition-all hover:text-white font-semibold"
                    >
                      Perfil
                      <span className="badge">Nuevo</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => logout()}
                      type="button"
                      className="justify-between hover:bg-sky-500 py-2 transition-all hover:text-white font-semibold"
                    >
                      Salir de la aplicación
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 max-md:hidden">
              <li>
                <Link
                  className="font-semibold text-white bg-sky-500 py-2 px-6 rounded-full text-sm hover:shadow-md  transition-all"
                  to="/login"
                >
                  Iniciar Sesion
                </Link>
              </li>
              <li>
                <Link
                  className="font-semibold text-white bg-sky-500 py-2 px-6 rounded-full text-sm hover:shadow-md  transition-all"
                  to="/register"
                >
                  Registrarte ahora
                </Link>
              </li>
            </div>
          )}
        </ul>
        <div className="drawer w-auto md:hidden">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          {/* Page content here */}
          <label
            htmlFor="my-drawer"
            className="btn btn-circle swap swap-rotate drawer-button text-sky-500"
          >
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" />

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-2">
              {/* Sidebar content here */}
              <li>
                <Link
                  to={"/register"}
                  className="bg-sky-500 text-white font-bold"
                >
                  Registrate ahora.
                </Link>
              </li>
              <li>
                <Link
                  to={"/register"}
                  className="bg-sky-500 text-white font-bold"
                >
                  Ya tienes una cuenta? Inicia Sesión.
                </Link>
              </li>
              <div className="font-bold text-lg text-orange-500 w-full text-center">
                Gestión Prisma
              </div>
            </ul>
          </div>
        </div>
      </nav>
      {/* {isAuthenticated &&
        (click ? (
          <div
            className={`transition-all ease-linear duration-300 absolute flex justify-center items-center flex-col rounded-bl-xl right-0 bg-white shadow-xl shadow-black/20  py-5 w-1/6 gap-2 z-[100]`}
            ref={menuRef}
          >
            <Link onClick={() => setClick(false)} to={"/perfil"}>
              <img
                src={
                  user?.imagen ||
                  "https://ppstatic.s3.amazonaws.com/expenses/uploads/people/default.png"
                }
                className="
                text-6xl text-sky-600 cursor-pointer hover:shadow transition-all ease-linear rounded-full w-[80px] h-[80px] border shadow-md shadow-gray-300"
              />
            </Link>
            <p className="text-sm capitalize text-slate-700 font-bold">
              {" "}
              {user?.username}
            </p>
            <p className="text-sm capitalize text-slate-500 font-light">
              {" "}
              {user?.email}
            </p>

            <div className="mt-5 flex flex-col gap-2 w-full">
              <div className="cursor-pointer flex gap-2 items-center text-slate-700 font-light hover:bg-sky-100 px-5 py-2 hover:text-sky-600 transition-all ease-linear">
                <MdPerson className="text-4xl" />{" "}
                <Link to={"/perfil"}>Perfil</Link>
              </div>

              <div className="cursor-pointer flex gap-2 items-center text-slate-700 font-light hover:bg-sky-100 px-5 py-2 hover:text-sky-600 transition-all ease-linear">
                <MdWork className="text-4xl" /> Empresa
              </div>

              <div className="cursor-pointer flex gap-2 items-center text-slate-700 font-light hover:bg-sky-100 px-5 py-2 hover:text-sky-600 transition-all ease-linear">
                <BsFiletypePdf className="text-4xl" /> Facturación
              </div>

              <div className="mx-5 my-4">
                <button
                  className="bg-white text-sm border-slate-300 border-[1px] text-sky-700 hover:shadow transition-all ease-linear px-4 py-2 text-white-500 rounded-xl flex items-center gap-2"
                  to="/"
                  onClick={() => {
                    setClick(false);
                    logout();
                  }}
                >
                  Salir de la app
                  <IoLogOutOutline className="text-3xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        ))} */}
    </header>
  );
}
