import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";
import { IoLogOutOutline } from "react-icons/io5";
import { BsFiletypePdf, BsPersonCircle } from "react-icons/bs";
import { MdPerson, MdWork } from "react-icons/md";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setClick(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuRef = useRef(null);

  return (
    <header className="bg-[#0287E0] z-[-100]">
      <nav className="flex justify-between items-center py-2 px-10 container mx-auto">
        <h1 className="text-2xl font-bold">
          <Link
            className="text-white relative"
            to={isAuthenticated ? "/home" : "/"}
          >
            <p className="z-100">Gestión Prisma</p>
          </Link>
        </h1>
        {!isAuthenticated && (
          <ul className="flex items-center gap-4 text-lg">
            <Link
              className="hover:bg-teal-500 py-2 px-4 rounded-xl hover:shadow hover:text-white transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Funcionalidades
            </Link>
            <Link
              className="hover:bg-teal-500 py-2 px-4 rounded-xl hover:shadow hover:text-white transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Precios
            </Link>
            <Link
              className="hover:bg-teal-500 py-2 px-4 rounded-xl hover:shadow hover:text-white transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Asesorías
            </Link>
            <Link
              className="hover:bg-teal-500 py-2 px-4 rounded-xl hover:shadow hover:text-white transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Preguntas frecuentes
            </Link>
            <Link
              className="hover:bg-teal-500 py-2 px-4 rounded-xl hover:shadow hover:text-white transition-all ease-in-out"
              to={"/funcionalidades"}
            >
              Nosotros
            </Link>
          </ul>
        )}
        <ul className="flex gap-x-4">
          {isAuthenticated ? (
            <div className="flex justify-between items-center gap-36 w-full">
              <div className="flex gap-4 items-center">
                <img
                  src={
                    user?.imagen ||
                    "https://ppstatic.s3.amazonaws.com/expenses/uploads/people/default.png"
                  }
                  onClick={() => handleClick()}
                  className="
                text-[45px] text-white cursor-pointer hover:shadow transition-all ease-linear rounded-full w-14 border-[2px] border-gray-400"
                />
              </div>{" "}
            </div>
          ) : (
            <>
              <li>
                <ButtonLink to="/login">Login</ButtonLink>
              </li>
              <li>
                <ButtonLink to="/register">Register</ButtonLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      {isAuthenticated && (
        <div
          className={`${
            click
              ? "translate-x-0 opacity-1"
              : "translate-x-32 opacity-0 hidden"
          } transition-all ease-linear duration-200 absolute bottom-[-10] flex justify-center items-center flex-col rounded-bl-xl right-0 bg-white shadow-xl border border-gray-200 py-3  w-1/5 gap-2 z-[100]`}
          ref={menuRef}
        >
          <Link to={"/perfil"}>
            <img
              src={
                user?.imagen ||
                "https://ppstatic.s3.amazonaws.com/expenses/uploads/people/default.png"
              }
              className="
                text-6xl text-sky-600 cursor-pointer hover:shadow transition-all ease-linear rounded-full w-20 shadow-md shadow-gray-300"
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
      )}
    </header>
  );
}
