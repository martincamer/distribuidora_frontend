import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Link, useLocation } from "react-router-dom";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { AiOutlineDatabase } from "react-icons/ai";
import { CiDatabase, CiUser } from "react-icons/ci";

export const SideBar = () => {
  const { logout, user } = useAuth();

  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Aquí podrías implementar la lógica para cerrar sesión
    console.log("Cerrando sesión...");
  };

  return (
    <div
      className={`${
        isOpen ? "w-64 opacity-1" : "w-16 opacity-1"
      } transition-all ease-linear flex flex-col bg-white min-h-screen max-h-full h-full `}
    >
      {/* Botón de menú */}
      <div
        className={`${
          isOpen ? "flex justify-between" : ""
        } transition-all ease-linear duration-300 py-3 px-4 border-b-[2px] border-slate-300 `}
      >
        <button className="text-3xl text-sky-600" onClick={handleToggle}>
          {isOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
        {isOpen && (
          <p className="bg-sky-500 py-1 px-2 rounded-xl text-sm text-white capitalize">
            {user?.username}
          </p>
        )}
      </div>
      {isOpen ? (
        <div className="w-full flex flex-col gap-0">
          <Link
            to={"/productos"}
            className={`${
              location.pathname === "/productos" ? "bg-sky-100" : "bg-none"
            } hover:text-sky-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Productos/crear/editar
          </Link>
          <Link
            to={"/clientes"}
            className="hover:text-sky-700 text-slate-700 text-sm transition-all py-3 px-3"
          >
            Clientes/Editar/Crear
          </Link>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <div
            className={`${
              location.pathname === "/productos" ||
              location.pathname === "/categorias"
                ? "bg-sky-100"
                : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div
              className="tooltip tooltip-right"
              data-tip="VER LOS PRODUCTOS/CRAR/ETC"
            >
              <Link to={"/productos"}>
                <CiDatabase className="text-3xl text-sky-700" />
              </Link>
            </div>
          </div>
          <div className="w-full text-center py-2 items-center transition-all ">
            <div
              className="tooltip tooltip-right"
              data-tip="VER LOS CLIENTES/COMPROBANTES/ETC"
            >
              <Link to={"/productos"}>
                <CiUser className="text-3xl text-sky-700" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
