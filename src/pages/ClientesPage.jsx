import { useEffect, useState } from "react";
import { useClientes } from "../context/ClientesContext"; // Cambia el contexto a Clientes
import { CiUser } from "react-icons/ci"; // Icono de usuario para clientes
import { ImFileEmpty } from "react-icons/im";
import { BsFolderPlus } from "react-icons/bs";
import { TableClients } from "../components/clients/TableClients.jsx"; // Cambia la tabla de productos por la de clientes
import { IoFilterOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";

export function ClientesPage() {
  const { clientes, getClientes } = useClientes(); // Cambia a clientes y función para obtener clientes

  useEffect(() => {
    getClientes(); // Obtiene los clientes cuando el componente se monta
  }, []); // Recuerda agregar cualquier dependencia necesaria para evitar advertencias

  return (
    <div>
      {clientes.length === 0 && (
        <div className="flex flex-col gap-6 justify-center items-center p-10 bg-white w-1/3 mx-auto my-10 rounded-xl shadow">
          <div>
            <ImFileEmpty className="text-6xl text-sky-400 m-auto my-2" />
            <h1 className="font-bold text-xl">
              No hay ningún cliente cargado aún
            </h1>
          </div>
          <div>
            <Link
              to={"/crear-cliente"}
              className="bg-sky-100 text-sky-600 py-3 px-6 rounded-2xl hover:shadow-md transition-all ease-linear flex gap-2 items-center"
            >
              Crear nuevo cliente
              <BsFolderPlus className="text-2xl" />
            </Link>
          </div>
        </div>
      )}
      {clientes.length > 0 && (
        <div className="bg-white w-full flex justify-between items-center ">
          <div className="flex">
            <p className="bg-sky-100/80 px-8 text-[16px] py-4 text-sky-600 font-semibold">
              Clientes
            </p>
          </div>
          <div className="mx-5 z-[0] flex gap-2">
            <button className="text-sm font-semibold bg-green-500/90 py-2 px-5 rounded-2xl text-white group flex gap-3 items-center relative transition-all ease-linear duration-300 z-0">
              <Link
                to={"/crear-cliente"}
                className="transition-opacity duration-300 opacity-100 group-hover:opacity-0"
              >
                Crear nuevo cliente
              </Link>
              <IoIosAddCircleOutline className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
            </button>
          </div>
        </div>
      )}
      {clientes.length > 0 && (
        <div className="flex flex-col gap-5 mx-10">
          <section className="py-10 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl py-8 px-5 shadow-lg transition-all ease-linear flex justify-between items-center">
              <div>
                <CiUser className="text-7xl shadow-md text-sky-700 bg-sky-100 rounded-full py-3 px-3.5" />
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="bg-sky-100 py-2 px-3 rounded-xl">
                  <p className="text-xs text-sky-700 font-bold">
                    Número total de clientes
                  </p>
                </div>
                <div>
                  <p className="font-normal">
                    Clientes cargados hasta el momento{" "}
                    <span className="font-bold text-sky-500 bg-sky-100 py-2 px-2 rounded-xl">
                      {clientes.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Aquí podrías agregar otras métricas relacionadas con clientes */}
          </section>
          <div className="bg-white rounded-3xl py-5 px-5 shadow-lg transition-all ease-linear flex gap-2 text-sm">
            <Link
              to={"/crear-cliente"}
              className="bg-sky-100 py-3 px-6 rounded-full text-sky-700 group flex gap-3 items-center relative transition-all"
            >
              Crear nuevo cliente
            </Link>
          </div>
          <TableClients clientes={clientes} />{" "}
        </div>
      )}
    </div>
  );
}